import type { BetMode } from '@/types';

export type BeefPhase = 'idle' | 'playing' | 'jumping' | 'won' | 'lost';
export type BeefDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface BeefResult {
  id: string;
  isWin: boolean;
  multiplier: number;
  betAmount: number;
  payout: number;
  position: number;
  difficulty: BeefDifficulty;
}

export interface AutoBetConfig {
  numberOfBets: string;
  steps: number; // 1-19, number of tiles to cross before auto cashout
  onWin: 'reset' | 'increase';
  onWinPercent: string;
  onLoss: 'reset' | 'increase';
  onLossPercent: string;
  stopOnProfit: string;
  stopOnLoss: string;
}

export interface BeefGameState {
  phase: BeefPhase;
  betAmount: string;
  betMode: BetMode;
  difficulty: BeefDifficulty;

  // Game state
  gameId: string | null;
  position: number; // 0 = starting position, 1-19 = tiles crossed
  multipliers: number[];
  currentMultiplier: number;
  potentialPayout: number;

  // Death animation
  hitCarType: number | null;

  // History
  resultHistory: BeefResult[];

  // Auto mode
  autoConfig: AutoBetConfig;
  isAutoPlaying: boolean;
  autoBetsRemaining: number | null;
  autoProfit: number;
}

export interface StartGameResponse {
  gameId: string;
  betAmount: number;
  difficulty: BeefDifficulty;
  multipliers: number[];
  startedAt: string;
}

export interface JumpResponse {
  success: boolean;
  survived: boolean;
  newPosition?: number;
  multiplier?: number;
  potentialPayout?: number;
  canContinue?: boolean;
  hitPosition?: number;
  carType?: number;
  lostAmount?: number;
}

export interface CashoutResponse {
  success: boolean;
  cashedOutAt: number;
  multiplier: number;
  betAmount: number;
  payout: number;
}
