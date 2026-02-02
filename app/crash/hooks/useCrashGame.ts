'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { BetMode } from '@/types';
import type {
  CrashEvent,
  CrashRoundPublic,
  CrashPlayer,
  CrashResult,
  MultiplierUpdate,
  CrashPhase,
  CrashAutoBetConfig,
} from '../types';
import { useBalance } from '@/app/contexts/BalanceContext';

export interface CrashGameState {
  phase: CrashPhase;
  multiplier: number;
  timeUntilStart: number;
  players: CrashPlayer[];
  history: CrashResult[];
  playerId: string | null;
  betAmount: string;
  autoCashoutAt: string;
  cashoutMultiplier: number | null;
  betMode: BetMode;
  isConnected: boolean;
  queuedBet: { amount: string; autoCashout: string } | null;
  autoConfig: CrashAutoBetConfig;
  isAutoPlaying: boolean;
}

const INITIAL_AUTO_CONFIG: CrashAutoBetConfig = {
  numberOfBets: '0',
  onWin: 'reset',
  onWinPercent: '0',
  onLoss: 'reset',
  onLossPercent: '0',
  stopOnProfit: '',
  stopOnLoss: '',
};

const INITIAL_STATE: CrashGameState = {
  phase: 'waiting',
  multiplier: 1.0,
  timeUntilStart: 0,
  players: [],
  history: [],
  playerId: null,
  betAmount: '0.00',
  autoCashoutAt: '2',
  cashoutMultiplier: null,
  betMode: 'manual',
  isConnected: false,
  queuedBet: null,
  autoConfig: INITIAL_AUTO_CONFIG,
  isAutoPlaying: false,
};

export function useCrashGame() {
  const [gameState, setGameState] = useState<CrashGameState>(INITIAL_STATE);
  const { balance, addBalance, subtractBalance } = useBalance();
  const stateRef = useRef(gameState);
  // Keep ref in sync with state (synchronous, not via useEffect)
  stateRef.current = gameState;
  const balanceRef = useRef(balance);
  balanceRef.current = balance;

  // SSE connection
  useEffect(() => {
    const eventSource = new EventSource('/api/crash/stream');

    eventSource.onopen = () => {
      setGameState((prev) => ({ ...prev, isConnected: true }));
    };

    eventSource.onerror = () => {
      setGameState((prev) => ({ ...prev, isConnected: false }));
    };

    eventSource.onmessage = (event) => {
      const crashEvent: CrashEvent = JSON.parse(event.data);

      switch (crashEvent.type) {
        case 'round_start': {
          const round = crashEvent.data as CrashRoundPublic;
          setGameState((prev) => ({
            ...prev,
            phase: round.phase,
            multiplier: round.currentMultiplier,
            timeUntilStart: round.timeUntilStart,
            players: round.players,
            playerId: null,
            cashoutMultiplier: null,
          }));
          break;
        }
        case 'round_ascending': {
          setGameState((prev) => ({
            ...prev,
            phase: 'ascending',
            timeUntilStart: 0,
          }));
          break;
        }
        case 'multiplier_update': {
          const update = crashEvent.data as MultiplierUpdate;
          setGameState((prev) => ({
            ...prev,
            multiplier: update.multiplier,
          }));
          break;
        }
        case 'player_joined': {
          const player = crashEvent.data as CrashPlayer;
          setGameState((prev) => {
            // Avoid duplicates - check if player already exists
            if (prev.players.some((p) => p.id === player.id)) {
              return prev;
            }
            return {
              ...prev,
              players: [...prev.players, player],
            };
          });
          break;
        }
        case 'player_cashout': {
          const player = crashEvent.data as CrashPlayer;
          setGameState((prev) => ({
            ...prev,
            players: prev.players.map((p) => (p.id === player.id ? player : p)),
          }));
          break;
        }
        case 'round_crashed': {
          const round = crashEvent.data as CrashRoundPublic;
          const crashMultiplier = round.crashMultiplier || round.currentMultiplier;
          setGameState((prev) => ({
            ...prev,
            phase: 'crashed',
            multiplier: crashMultiplier,
          }));
          break;
        }
        case 'history_update': {
          setGameState((prev) => ({
            ...prev,
            history: crashEvent.data as CrashResult[],
          }));
          break;
        }
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (gameState.phase !== 'waiting' || gameState.timeUntilStart <= 0) return;

    const interval = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        timeUntilStart: Math.max(0, prev.timeUntilStart - 100),
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.phase, gameState.timeUntilStart]);

  // Auto-place queued bet when new round starts
  useEffect(() => {
    if (gameState.phase !== 'waiting' || !gameState.queuedBet || gameState.playerId) return;

    const placeQueuedBet = async () => {
      const { amount, autoCashout } = gameState.queuedBet!;
      const bet = parseFloat(amount) || 0;
      const autoCashoutValue = parseFloat(autoCashout);

      // Check if we have enough balance
      if (bet <= 0 || bet > balanceRef.current) {
        setGameState((prev) => ({ ...prev, queuedBet: null }));
        return;
      }

      // Deduct bet amount
      subtractBalance(bet);

      const res = await fetch('/api/crash/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Player',
          avatarUrl: '/images/avatars/default.png',
          betAmount: bet,
          autoCashoutAt: autoCashoutValue > 1 ? autoCashoutValue : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGameState((prev) => ({
          ...prev,
          playerId: data.playerId,
          queuedBet: null,
        }));
      } else {
        // Refund if bet failed
        addBalance(bet);
        setGameState((prev) => ({ ...prev, queuedBet: null }));
      }
    };

    placeQueuedBet();
  }, [gameState.phase, gameState.queuedBet, gameState.playerId, subtractBalance, addBalance]);

  const setBetMode = useCallback((mode: BetMode) => {
    setGameState((prev) => ({ ...prev, betMode: mode }));
  }, []);

  const setBetAmount = useCallback((value: string) => {
    setGameState((prev) => ({ ...prev, betAmount: value }));
  }, []);

  const setAutoCashoutAt = useCallback((value: string) => {
    setGameState((prev) => ({ ...prev, autoCashoutAt: value }));
  }, []);

  const setAutoConfig = useCallback((updates: Partial<CrashAutoBetConfig>) => {
    setGameState((prev) => ({
      ...prev,
      autoConfig: { ...prev.autoConfig, ...updates },
    }));
  }, []);

  const joinRound = useCallback(async () => {
    const { phase, betAmount, autoCashoutAt } = stateRef.current;
    const bet = parseFloat(betAmount) || 0;

    // Check if we have enough balance
    if (bet <= 0 || bet > balanceRef.current) {
      return { success: false, error: 'Insufficient balance' };
    }

    // If game is ascending, queue bet for next round (don't deduct yet)
    if (phase === 'ascending') {
      setGameState((prev) => ({
        ...prev,
        queuedBet: { amount: prev.betAmount, autoCashout: prev.autoCashoutAt },
      }));
      return { success: true, queued: true };
    }

    // Deduct bet amount
    subtractBalance(bet);

    // Place bet directly
    const autoCashout = parseFloat(autoCashoutAt);
    const res = await fetch('/api/crash/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Player',
        avatarUrl: '/images/avatars/default.png',
        betAmount: bet,
        autoCashoutAt: autoCashout > 1 ? autoCashout : undefined,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setGameState((prev) => ({ ...prev, playerId: data.playerId }));
    } else {
      // Refund if bet failed
      addBalance(bet);
    }
    return data;
  }, [subtractBalance, addBalance]);

  const cancelQueuedBet = useCallback(() => {
    setGameState((prev) => ({ ...prev, queuedBet: null }));
  }, []);

  const cashout = useCallback(async () => {
    if (!gameState.playerId) return { success: false, error: 'Not in round' };

    const res = await fetch('/api/crash/cashout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: gameState.playerId }),
    });
    const data = await res.json();
    if (data.success) {
      // Add payout to balance
      const payout = data.payout || (parseFloat(gameState.betAmount) * data.multiplier);
      addBalance(payout);
      setGameState((prev) => ({ ...prev, cashoutMultiplier: data.multiplier }));
    }
    return data;
  }, [gameState.playerId, gameState.betAmount, addBalance]);

  // Computed values
  const totalBets = gameState.players.reduce((sum, p) => sum + p.betAmount, 0);
  const profitOnWin = parseFloat(gameState.betAmount) * (parseFloat(gameState.autoCashoutAt) - 1) || 0;
  const isInRound = !!gameState.playerId;
  const hasCashedOut = !!gameState.cashoutMultiplier;
  const hasQueuedBet = !!gameState.queuedBet;
  const canBet = (gameState.phase === 'waiting' && !isInRound) ||
    (gameState.phase === 'ascending' && (!isInRound || hasCashedOut) && !hasQueuedBet);
  const canCashout = gameState.phase === 'ascending' && isInRound && !hasCashedOut;
  const canCancelBet = hasQueuedBet;

  return {
    gameState,
    setBetMode,
    setBetAmount,
    setAutoCashoutAt,
    setAutoConfig,
    joinRound,
    cancelQueuedBet,
    cashout,
    totalBets,
    profitOnWin,
    isInRound,
    hasCashedOut,
    hasQueuedBet,
    canBet,
    canCashout,
    canCancelBet,
  };
}
