'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { BetMode } from '@/types';
import type { DiceGameState, DiceResult, AutoBetConfig, RollMode } from '../types';

const INITIAL_BALANCE = 1000;
const MIN_ROLL_OVER = 2;
const MAX_ROLL_OVER = 99.98;
const DEFAULT_ROLL_OVER = 50.05;

const initialAutoConfig: AutoBetConfig = {
  numberOfBets: '10',
  onWin: 'reset',
  onWinPercent: '0',
  onLoss: 'reset',
  onLossPercent: '0',
  stopOnProfit: '0.00',
  stopOnLoss: '0.00',
};

const initialState: DiceGameState = {
  phase: 'idle',
  balance: INITIAL_BALANCE,
  betAmount: '0.00',
  betMode: 'manual',

  rollOver: DEFAULT_ROLL_OVER,
  rollMode: 'over',

  currentResult: null,
  resultHistory: [],

  autoConfig: initialAutoConfig,
  isAutoPlaying: false,
  autoBetsRemaining: null,
  autoProfit: 0,
};

function generateResult(): number {
  return Math.round(Math.random() * 10000) / 100;
}

export function useDiceGame() {
  const [gameState, setGameState] = useState<DiceGameState>(initialState);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const initialBetRef = useRef<number>(0);
  const isStoppingRef = useRef(false);

  // Computed values
  const winChance = useMemo(() => {
    return gameState.rollMode === 'over'
      ? 100 - gameState.rollOver
      : gameState.rollOver;
  }, [gameState.rollOver, gameState.rollMode]);

  const multiplier = useMemo(() => {
    if (winChance <= 0) return 0;
    return 100 / winChance;
  }, [winChance]);

  const profitOnWin = useMemo(() => {
    const bet = parseFloat(gameState.betAmount) || 0;
    return bet * (multiplier - 1);
  }, [gameState.betAmount, multiplier]);

  // Setters
  const setBetAmount = useCallback((value: string) => {
    setGameState(prev => ({ ...prev, betAmount: value }));
  }, []);

  const setBetMode = useCallback((mode: BetMode) => {
    setGameState(prev => ({ ...prev, betMode: mode }));
  }, []);

  const setRollOver = useCallback((value: number) => {
    const clamped = Math.max(MIN_ROLL_OVER, Math.min(MAX_ROLL_OVER, value));
    const rounded = Math.round(clamped * 100) / 100;
    setGameState(prev => ({ ...prev, rollOver: rounded }));
  }, []);

  const clearCurrentResult = useCallback(() => {
    setGameState(prev => ({ ...prev, currentResult: null }));
  }, []);

  const toggleRollMode = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      rollMode: prev.rollMode === 'over' ? 'under' : 'over',
    }));
  }, []);

  const setMultiplier = useCallback((value: number) => {
    const winCh = 100 / value;
    setGameState(prev => {
      const newRollOver = prev.rollMode === 'over' ? 100 - winCh : winCh;
      const clamped = Math.max(MIN_ROLL_OVER, Math.min(MAX_ROLL_OVER, newRollOver));
      return { ...prev, rollOver: Math.round(clamped * 100) / 100 };
    });
  }, []);

  const setWinChance = useCallback((value: number) => {
    setGameState(prev => {
      const newRollOver = prev.rollMode === 'over' ? 100 - value : value;
      const clamped = Math.max(MIN_ROLL_OVER, Math.min(MAX_ROLL_OVER, newRollOver));
      return { ...prev, rollOver: Math.round(clamped * 100) / 100 };
    });
  }, []);

  const updateAutoConfig = useCallback((updates: Partial<AutoBetConfig>) => {
    setGameState(prev => ({
      ...prev,
      autoConfig: { ...prev.autoConfig, ...updates },
    }));
  }, []);

  // Check if bet is won
  const checkWin = useCallback((result: number, rollOver: number, rollMode: RollMode): boolean => {
    return rollMode === 'over' ? result > rollOver : result < rollOver;
  }, []);

  // Single roll (manual mode)
  const roll = useCallback(() => {
    const bet = parseFloat(gameState.betAmount) || 0;
    if (bet > gameState.balance) return;

    setGameState(prev => ({ ...prev, phase: 'rolling' }));

    setTimeout(() => {
      const result = generateResult();
      const isWin = checkWin(result, gameState.rollOver, gameState.rollMode);
      const payout = isWin ? bet * multiplier : 0;

      const diceResult: DiceResult = {
        id: crypto.randomUUID(),
        value: result,
        isWin,
        rollOver: gameState.rollOver,
        rollMode: gameState.rollMode,
        multiplier,
        betAmount: bet,
        payout,
      };

      setGameState(prev => ({
        ...prev,
        phase: 'settled',
        currentResult: result,
        balance: prev.balance - bet + payout,
        resultHistory: [diceResult, ...prev.resultHistory].slice(0, 20),
      }));
    }, 500);
  }, [gameState.betAmount, gameState.balance, gameState.rollOver, gameState.rollMode, multiplier, checkWin]);

  // Stop auto play
  const stopAutoPlay = useCallback(() => {
    isStoppingRef.current = true;
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    setGameState(prev => ({
      ...prev,
      isAutoPlaying: false,
      phase: prev.phase === 'rolling' ? prev.phase : 'idle',
    }));
    setTimeout(() => {
      isStoppingRef.current = false;
    }, 100);
  }, []);

  // Start auto play
  const startAutoPlay = useCallback(() => {
    const bet = parseFloat(gameState.betAmount) || 0;
    if (bet > gameState.balance) return;

    initialBetRef.current = bet;
    isStoppingRef.current = false;

    const numberOfBets = gameState.autoConfig.numberOfBets;
    const betsRemaining = numberOfBets === '∞' ? null : parseInt(numberOfBets) || 10;

    setGameState(prev => ({
      ...prev,
      isAutoPlaying: true,
      autoBetsRemaining: betsRemaining,
      autoProfit: 0,
      phase: 'idle',
    }));
  }, [gameState.betAmount, gameState.balance, gameState.autoConfig.numberOfBets]);

  const toggleAutoPlay = useCallback(() => {
    if (gameState.isAutoPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }, [gameState.isAutoPlaying, stopAutoPlay, startAutoPlay]);

  // Auto play loop
  useEffect(() => {
    if (!gameState.isAutoPlaying || isStoppingRef.current) return;

    const bet = parseFloat(gameState.betAmount) || 0;
    const stopProfit = parseFloat(gameState.autoConfig.stopOnProfit) || 0;
    const stopLoss = parseFloat(gameState.autoConfig.stopOnLoss) || 0;

    // Check stop conditions
    const shouldStop =
      (bet > gameState.balance) ||
      (gameState.autoBetsRemaining !== null && gameState.autoBetsRemaining <= 0) ||
      (stopProfit > 0 && gameState.autoProfit >= stopProfit) ||
      (stopLoss > 0 && gameState.autoProfit <= -stopLoss);

    if (shouldStop) {
      stopAutoPlay();
      return;
    }

    if (gameState.phase === 'idle' || gameState.phase === 'settled') {
      // Start rolling
      autoPlayRef.current = setTimeout(() => {
        if (isStoppingRef.current) return;
        setGameState(prev => ({ ...prev, phase: 'rolling' }));
      }, 100);
    } else if (gameState.phase === 'rolling') {
      // Process result
      autoPlayRef.current = setTimeout(() => {
        if (isStoppingRef.current) return;

        const result = generateResult();

        setGameState(prev => {
          const currentBet = parseFloat(prev.betAmount) || 0;
          const isWin = checkWin(result, prev.rollOver, prev.rollMode);
          const currentMultiplier = prev.rollMode === 'over'
            ? 100 / (100 - prev.rollOver)
            : 100 / prev.rollOver;
          const payout = isWin ? currentBet * currentMultiplier : 0;
          const profit = payout - currentBet;

          const diceResult: DiceResult = {
            id: crypto.randomUUID(),
            value: result,
            isWin,
            rollOver: prev.rollOver,
            rollMode: prev.rollMode,
            multiplier: currentMultiplier,
            betAmount: currentBet,
            payout,
          };

          // Calculate new bet amount
          let newBetAmount = currentBet;
          if (isWin) {
            if (prev.autoConfig.onWin === 'reset') {
              newBetAmount = initialBetRef.current;
            } else {
              const increasePercent = parseFloat(prev.autoConfig.onWinPercent) || 0;
              newBetAmount = currentBet * (1 + increasePercent / 100);
            }
          } else {
            if (prev.autoConfig.onLoss === 'reset') {
              newBetAmount = initialBetRef.current;
            } else {
              const increasePercent = parseFloat(prev.autoConfig.onLossPercent) || 0;
              newBetAmount = currentBet * (1 + increasePercent / 100);
            }
          }

          return {
            ...prev,
            phase: 'settled',
            currentResult: result,
            balance: prev.balance - currentBet + payout,
            betAmount: newBetAmount.toFixed(2),
            resultHistory: [diceResult, ...prev.resultHistory].slice(0, 20),
            autoBetsRemaining: prev.autoBetsRemaining !== null ? prev.autoBetsRemaining - 1 : null,
            autoProfit: prev.autoProfit + profit,
          };
        });
      }, 650);
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [gameState.isAutoPlaying, gameState.phase, gameState.betAmount, gameState.balance, gameState.autoBetsRemaining, gameState.autoProfit, gameState.autoConfig, stopAutoPlay, checkWin]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, []);

  return {
    gameState,
    winChance,
    multiplier,
    profitOnWin,
    setBetAmount,
    setBetMode,
    setRollOver,
    toggleRollMode,
    setMultiplier,
    setWinChance,
    updateAutoConfig,
    clearCurrentResult,
    roll,
    startAutoPlay,
    stopAutoPlay,
    toggleAutoPlay,
  };
}
