import type {
  CrashRound,
  CrashRoundPublic,
  CrashPlayer,
  CrashResult,
  CrashEvent,
  CrashEventType,
  MultiplierUpdate,
} from '@/app/crash/types';

// Mock players who will "join" and cash out during rounds
const MOCK_PLAYERS: Omit<CrashPlayer, 'id' | 'autoCashoutAt' | 'cashedOutAt' | 'cashedOutMultiplier' | 'payout'>[] = [
  { username: 'LuckyDave', avatarUrl: 'https://i.pravatar.cc/150?u=LuckyDave', betAmount: 150 },
  { username: 'CryptoQueen', avatarUrl: 'https://i.pravatar.cc/150?u=CryptoQueen', betAmount: 500 },
  { username: 'RocketMan', avatarUrl: 'https://i.pravatar.cc/150?u=RocketMan', betAmount: 75 },
  { username: 'DiamondHands', avatarUrl: 'https://i.pravatar.cc/150?u=DiamondHands', betAmount: 1000 },
  { username: 'MoonShot', avatarUrl: 'https://i.pravatar.cc/150?u=MoonShot', betAmount: 250 },
  { username: 'SafePlayer', avatarUrl: 'https://i.pravatar.cc/150?u=SafePlayer', betAmount: 100 },
];

const WAITING_DURATION = 5000; // 5 seconds
const MULTIPLIER_UPDATE_INTERVAL = 200; // 200ms between updates

type EventCallback = (event: CrashEvent) => void;

class CrashGameManager {
  private currentRound: CrashRound | null = null;
  private roundHistory: CrashResult[] = [];
  private subscribers: Set<EventCallback> = new Set();
  private gameLoopTimer: ReturnType<typeof setTimeout> | null = null;
  private multiplierTimer: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;
  private playerIdCounter = 1;
  private roundIdCounter = 1;

  constructor() {
    // Auto-start on first access
    this.start();
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startNewRound();
  }

  stop(): void {
    this.isRunning = false;
    if (this.gameLoopTimer) {
      clearTimeout(this.gameLoopTimer);
      this.gameLoopTimer = null;
    }
    if (this.multiplierTimer) {
      clearInterval(this.multiplierTimer);
      this.multiplierTimer = null;
    }
  }

  subscribe(callback: EventCallback): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private emit(type: CrashEventType, data: CrashEvent['data']): void {
    const event: CrashEvent = {
      type,
      data,
      timestamp: Date.now(),
    };
    this.subscribers.forEach((cb) => {
      try {
        cb(event);
      } catch (e) {
        console.error('Error in crash event subscriber:', e);
      }
    });
  }

  private generateCrashMultiplier(): number {
    // House edge of ~4%
    // Using inverse transform sampling for exponential distribution
    const houseEdge = 0.04;
    const random = Math.random();

    // Prevent instant crashes (minimum 1.00x)
    if (random < houseEdge) {
      return 1.0;
    }

    // Exponential distribution: higher multipliers are rarer
    // Most crashes between 1x-3x, occasional big ones
    const crashPoint = 1 / (1 - random * (1 - houseEdge));

    // Round to 2 decimal places, cap at 1000x
    return Math.min(Math.round(crashPoint * 100) / 100, 1000);
  }

  private createMockPlayers(crashMultiplier: number): CrashPlayer[] {
    // Add 2-4 random mock players to each round
    const numPlayers = 2 + Math.floor(Math.random() * 3);
    const shuffled = [...MOCK_PLAYERS].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, numPlayers).map((p) => {
      // Some players set auto-cashout, some don't (and will crash)
      const willSetAutoCashout = Math.random() > 0.3;
      let autoCashoutAt: number | null = null;

      if (willSetAutoCashout && crashMultiplier > 1.1) {
        // Target between 1.01x and just below crash point (minimum 1.01x for profit)
        const minTarget = 1.01;
        const maxTarget = crashMultiplier - 0.01;
        const target = minTarget + Math.random() * (maxTarget - minTarget);
        autoCashoutAt = Math.max(1.01, Math.round(target * 100) / 100);
      }

      return {
        ...p,
        id: `mock-${this.playerIdCounter++}`,
        autoCashoutAt,
        cashedOutAt: null,
        cashedOutMultiplier: null,
        payout: null,
      };
    });
  }

  private startNewRound(): void {
    if (!this.isRunning) return;

    const roundId = `round-${this.roundIdCounter++}`;
    const crashMultiplier = this.generateCrashMultiplier();
    const mockPlayers = this.createMockPlayers(crashMultiplier);

    this.currentRound = {
      id: roundId,
      phase: 'waiting',
      startTime: Date.now(),
      ascendStartTime: null,
      crashMultiplier,
      currentMultiplier: 1.0,
      players: mockPlayers,
      waitingDuration: WAITING_DURATION,
    };

    console.log(`[Crash] New round ${roundId} started. Crash point: ${crashMultiplier}x`);

    const roundState = this.getPublicRoundState();
    if (roundState) {
      this.emit('round_start', roundState);
    }

    // Don't emit player_joined for mock players - they're already in round_start.players

    // Schedule ascending phase
    this.gameLoopTimer = setTimeout(() => {
      this.startAscending();
    }, WAITING_DURATION);
  }

  private startAscending(): void {
    if (!this.currentRound || !this.isRunning) return;

    this.currentRound.phase = 'ascending';
    this.currentRound.ascendStartTime = Date.now();
    this.currentRound.currentMultiplier = 1.0;

    console.log(`[Crash] Round ${this.currentRound.id} ascending...`);

    const roundState = this.getPublicRoundState();
    if (roundState) {
      this.emit('round_ascending', roundState);
    }

    // Start multiplier updates
    this.multiplierTimer = setInterval(() => {
      this.updateMultiplier();
    }, MULTIPLIER_UPDATE_INTERVAL);
  }

  private processAutoCashouts(): void {
    if (!this.currentRound || this.currentRound.phase !== 'ascending') return;

    const currentMultiplier = this.currentRound.currentMultiplier;

    for (const player of this.currentRound.players) {
      // Skip if already cashed out or no auto-cashout set
      if (player.cashedOutAt !== null || player.autoCashoutAt === null) continue;

      // Check if target reached
      if (currentMultiplier >= player.autoCashoutAt) {
        player.cashedOutAt = Date.now();
        player.cashedOutMultiplier = player.autoCashoutAt;
        player.payout = Math.round(player.betAmount * player.autoCashoutAt * 100) / 100;

        console.log(`[Crash] Auto-cashout: ${player.username} at ${player.autoCashoutAt}x`);
        this.emit('player_cashout', player);
      }
    }
  }

  private updateMultiplier(): void {
    if (!this.currentRound || this.currentRound.phase !== 'ascending') return;

    const now = Date.now();
    const elapsedMs = now - this.currentRound.ascendStartTime!;
    const elapsedSec = elapsedMs / 1000;
    // Quadratic growth: m(t) = 1 + (t/10)² — reaches 2x at 10s, 5x at 20s
    const newMultiplier = 1 + Math.pow(elapsedSec / 10, 2);

    this.currentRound.currentMultiplier = Math.round(newMultiplier * 100) / 100;

    // Process auto-cashouts
    this.processAutoCashouts();

    // Check for crash
    if (this.currentRound.currentMultiplier >= this.currentRound.crashMultiplier) {
      this.crash();
      return;
    }

    const update: MultiplierUpdate = {
      roundId: this.currentRound.id,
      multiplier: this.currentRound.currentMultiplier,
      elapsed: elapsedMs,
      timestamp: now,
    };

    this.emit('multiplier_update', update);
  }

  private crash(): void {
    if (!this.currentRound) return;

    if (this.multiplierTimer) {
      clearInterval(this.multiplierTimer);
      this.multiplierTimer = null;
    }

    this.currentRound.phase = 'crashed';
    this.currentRound.currentMultiplier = this.currentRound.crashMultiplier;

    console.log(`[Crash] Round ${this.currentRound.id} crashed at ${this.currentRound.crashMultiplier}x`);

    // Add to history
    const result: CrashResult = {
      id: this.currentRound.id,
      crashMultiplier: this.currentRound.crashMultiplier,
      timestamp: Date.now(),
    };
    this.roundHistory.unshift(result);
    if (this.roundHistory.length > 20) {
      this.roundHistory.pop();
    }

    const crashedState = this.getPublicRoundState();
    if (crashedState) {
      this.emit('round_crashed', crashedState);
    }
    this.emit('history_update', this.roundHistory);

    // Start next round after a short delay
    this.gameLoopTimer = setTimeout(() => {
      this.startNewRound();
    }, 3000); // 3 second pause between rounds
  }

  getPublicRoundState(): CrashRoundPublic | null {
    if (!this.currentRound) return null;

    const timeUntilStart =
      this.currentRound.phase === 'waiting'
        ? Math.max(0, this.currentRound.waitingDuration - (Date.now() - this.currentRound.startTime))
        : 0;

    return {
      id: this.currentRound.id,
      phase: this.currentRound.phase,
      startTime: this.currentRound.startTime,
      ascendStartTime: this.currentRound.ascendStartTime,
      currentMultiplier: this.currentRound.currentMultiplier,
      players: this.currentRound.players,
      waitingDuration: this.currentRound.waitingDuration,
      timeUntilStart,
      crashMultiplier:
        this.currentRound.phase === 'crashed' ? this.currentRound.crashMultiplier : undefined,
    };
  }

  getHistory(): CrashResult[] {
    return [...this.roundHistory];
  }

  joinRound(username: string, avatarUrl: string, betAmount: number, autoCashoutAt?: number): { success: boolean; playerId?: string; error?: string } {
    if (!this.currentRound) {
      return { success: false, error: 'No active round' };
    }

    if (this.currentRound.phase !== 'waiting') {
      return { success: false, error: 'Round already started' };
    }

    // Check if player already joined
    const existingPlayer = this.currentRound.players.find(
      (p) => p.username === username && !p.id.startsWith('mock-')
    );
    if (existingPlayer) {
      return { success: false, error: 'Already joined this round' };
    }

    const playerId = `player-${this.playerIdCounter++}`;
    const player: CrashPlayer = {
      id: playerId,
      username,
      avatarUrl,
      betAmount,
      autoCashoutAt: autoCashoutAt && autoCashoutAt > 1 ? autoCashoutAt : null,
      cashedOutAt: null,
      cashedOutMultiplier: null,
      payout: null,
    };

    this.currentRound.players.push(player);
    this.emit('player_joined', player);

    const autoCashoutInfo = autoCashoutAt ? ` (auto-cashout @ ${autoCashoutAt}x)` : '';
    console.log(`[Crash] Player ${username} joined with ${betAmount} bet${autoCashoutInfo}`);

    return { success: true, playerId };
  }

  cashout(playerId: string): { success: boolean; multiplier?: number; payout?: number; error?: string } {
    if (!this.currentRound) {
      return { success: false, error: 'No active round' };
    }

    if (this.currentRound.phase !== 'ascending') {
      return { success: false, error: 'Cannot cash out in current phase' };
    }

    const player = this.currentRound.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: 'Player not found in round' };
    }

    if (player.cashedOutAt !== null) {
      return { success: false, error: 'Already cashed out' };
    }

    const multiplier = this.currentRound.currentMultiplier;
    const payout = Math.round(player.betAmount * multiplier * 100) / 100;

    player.cashedOutAt = Date.now();
    player.cashedOutMultiplier = multiplier;
    player.payout = payout;

    this.emit('player_cashout', player);

    console.log(`[Crash] Player ${player.username} cashed out at ${multiplier}x for ${payout}`);

    return { success: true, multiplier, payout };
  }
}

// Singleton instance - use globalThis to persist across HMR in dev
const globalForCrash = globalThis as unknown as {
  crashGameManager: CrashGameManager | undefined;
};

export function getCrashGameManager(): CrashGameManager {
  if (!globalForCrash.crashGameManager) {
    globalForCrash.crashGameManager = new CrashGameManager();
  }
  return globalForCrash.crashGameManager;
}

export type { CrashGameManager };
