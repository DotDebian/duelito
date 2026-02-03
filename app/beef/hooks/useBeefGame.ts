'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { BetMode } from '@/types';
import type {
  BeefGameState,
  BeefResult,
  AutoBetConfig,
  BeefDifficulty,
  StartGameResponse,
  JumpResponse,
  CashoutResponse,
} from '../types';
import { useBalance } from '@/app/contexts/BalanceContext';

const initialAutoConfig: AutoBetConfig = {
  numberOfBets: '10',
  steps: 1,
  onWin: 'reset',
  onWinPercent: '0',
  onLoss: 'reset',
  onLossPercent: '0',
  stopOnProfit: '0.00',
  stopOnLoss: '0.00',
};

const initialState: BeefGameState = {
  phase: 'idle',
  betAmount: '0.00',
  betMode: 'manual',
  difficulty: 'easy',

  gameId: null,
  position: 0,
  multipliers: [],
  currentMultiplier: 1,
  potentialPayout: 0,

  hitCarType: null,

  resultHistory: [],

  autoConfig: initialAutoConfig,
  isAutoPlaying: false,
  autoBetsRemaining: null,
  autoProfit: 0,
};

export function useBeefGame() {
  const [gameState, setGameState] = useState<BeefGameState>(initialState);
  const { balance, addBalance, subtractBalance } = useBalance();
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const initialBetRef = useRef<number>(0);
  const isStoppingRef = useRef(false);
  const balanceRef = useRef(balance);
  balanceRef.current = balance;

  // Setters
  const setBetAmount = useCallback((value: string) => {
    setGameState(prev => ({ ...prev, betAmount: value }));
  }, []);

  const setBetMode = useCallback((mode: BetMode) => {
    setGameState(prev => ({ ...prev, betMode: mode }));
  }, []);

  const setDifficulty = useCallback((difficulty: BeefDifficulty) => {
    setGameState(prev => ({ ...prev, difficulty }));
  }, []);

  const updateAutoConfig = useCallback((updates: Partial<AutoBetConfig>) => {
    setGameState(prev => ({
      ...prev,
      autoConfig: { ...prev.autoConfig, ...updates },
    }));
  }, []);

  // Start a new game
  const startGame = useCallback(async () => {
    const bet = parseFloat(gameState.betAmount) || 0;
    if (bet > balance || bet < 0) return;

    subtractBalance(bet);

    try {
      const response = await fetch('/api/beef/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          betAmount: bet,
          difficulty: gameState.difficulty,
        }),
      });

      const data: StartGameResponse = await response.json();

      setGameState(prev => ({
        ...prev,
        phase: 'playing',
        gameId: data.gameId,
        position: 0,
        multipliers: data.multipliers,
        currentMultiplier: 1,
        potentialPayout: bet,
        hitCarType: null,
      }));
    } catch {
      addBalance(bet);
    }
  }, [gameState.betAmount, gameState.difficulty, balance, subtractBalance, addBalance]);

  // Jump to next tile
  const jump = useCallback(async () => {
    if (gameState.phase !== 'playing' || !gameState.gameId) return;

    setGameState(prev => ({ ...prev, phase: 'jumping' }));

    try {
      const bet = parseFloat(gameState.betAmount) || 0;
      const response = await fetch('/api/beef/jump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameState.gameId,
          currentPosition: gameState.position,
          difficulty: gameState.difficulty,
          betAmount: bet,
        }),
      });

      const data: JumpResponse = await response.json();

      if (data.survived && data.newPosition !== undefined) {
        setGameState(prev => ({
          ...prev,
          phase: 'playing',
          position: data.newPosition!,
          currentMultiplier: data.multiplier || prev.currentMultiplier,
          potentialPayout: data.potentialPayout || prev.potentialPayout,
        }));
      } else {
        const bet = parseFloat(gameState.betAmount) || 0;
        const result: BeefResult = {
          id: crypto.randomUUID(),
          isWin: false,
          multiplier: 0,
          betAmount: bet,
          payout: 0,
          position: gameState.position,
          difficulty: gameState.difficulty,
        };

        setGameState(prev => ({
          ...prev,
          phase: 'lost',
          hitCarType: data.carType || 2,
          resultHistory: [result, ...prev.resultHistory].slice(0, 20),
        }));
      }
    } catch {
      setGameState(prev => ({ ...prev, phase: 'playing' }));
    }
  }, [gameState.phase, gameState.gameId, gameState.position, gameState.difficulty, gameState.betAmount]);

  // Cashout current position
  const cashout = useCallback(async () => {
    if (gameState.phase !== 'playing' || !gameState.gameId || gameState.position < 1) return;

    try {
      const bet = parseFloat(gameState.betAmount) || 0;
      const response = await fetch('/api/beef/cashout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameState.gameId,
          position: gameState.position,
          difficulty: gameState.difficulty,
          betAmount: bet,
        }),
      });

      const data: CashoutResponse = await response.json();

      if (data.success) {
        addBalance(data.payout);

        const result: BeefResult = {
          id: crypto.randomUUID(),
          isWin: true,
          multiplier: data.multiplier,
          betAmount: bet,
          payout: data.payout,
          position: data.cashedOutAt,
          difficulty: gameState.difficulty,
        };

        setGameState(prev => ({
          ...prev,
          phase: 'won',
          resultHistory: [result, ...prev.resultHistory].slice(0, 20),
        }));

        // Reset to idle after win animation
        setTimeout(() => {
          setGameState(prev => {
            if (prev.phase === 'won') {
              return {
                ...prev,
                phase: 'idle',
                gameId: null,
                position: 0,
                multipliers: [],
                currentMultiplier: 1,
                potentialPayout: 0,
              };
            }
            return prev;
          });
        }, 1000);
      }
    } catch {
      // Keep playing state on error
    }
  }, [gameState.phase, gameState.gameId, gameState.position, gameState.difficulty, gameState.betAmount, addBalance]);

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
    }));
    setTimeout(() => {
      isStoppingRef.current = false;
    }, 100);
  }, []);

  // Start auto play
  const startAutoPlay = useCallback(() => {
    const bet = parseFloat(gameState.betAmount) || 0;
    if (bet > balance || bet <= 0) return;

    initialBetRef.current = bet;
    isStoppingRef.current = false;

    const numberOfBets = gameState.autoConfig.numberOfBets;
    const betsRemaining = numberOfBets === '∞' ? null : parseInt(numberOfBets) || 10;

    setGameState(prev => ({
      ...prev,
      isAutoPlaying: true,
      autoBetsRemaining: betsRemaining,
      autoProfit: 0,
    }));
  }, [gameState.betAmount, balance, gameState.autoConfig.numberOfBets]);

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
      (bet > balanceRef.current) ||
      (gameState.autoBetsRemaining !== null && gameState.autoBetsRemaining <= 0) ||
      (stopProfit > 0 && gameState.autoProfit >= stopProfit) ||
      (stopLoss > 0 && gameState.autoProfit <= -stopLoss);

    if (shouldStop) {
      stopAutoPlay();
      return;
    }

    // Auto-play logic: Start game when idle, jump until steps reached then cashout
    const targetSteps = gameState.autoConfig.steps;

    if (gameState.phase === 'idle') {
      autoPlayRef.current = setTimeout(async () => {
        if (isStoppingRef.current) return;
        const currentBet = parseFloat(gameState.betAmount) || 0;
        if (currentBet > balanceRef.current) {
          stopAutoPlay();
          return;
        }
        await startGame();
      }, 300);
    } else if (gameState.phase === 'playing' && gameState.position >= targetSteps) {
      // Auto cashout when target steps reached
      autoPlayRef.current = setTimeout(async () => {
        if (isStoppingRef.current) return;
        await cashout();
      }, 500);
    } else if (gameState.phase === 'playing' && gameState.position < targetSteps) {
      // Continue jumping until target steps
      autoPlayRef.current = setTimeout(async () => {
        if (isStoppingRef.current) return;
        await jump();
      }, 500);
    } else if (gameState.phase === 'won' || gameState.phase === 'lost') {
      // Calculate profit/loss and prepare next bet
      const lastResult = gameState.resultHistory[0];
      if (lastResult) {
        const profit = lastResult.payout - lastResult.betAmount;
        let newBetAmount = parseFloat(gameState.betAmount) || initialBetRef.current;

        if (lastResult.isWin) {
          if (gameState.autoConfig.onWin === 'reset') {
            newBetAmount = initialBetRef.current;
          } else {
            const increasePercent = parseFloat(gameState.autoConfig.onWinPercent) || 0;
            newBetAmount = newBetAmount * (1 + increasePercent / 100);
          }
        } else {
          if (gameState.autoConfig.onLoss === 'reset') {
            newBetAmount = initialBetRef.current;
          } else {
            const increasePercent = parseFloat(gameState.autoConfig.onLossPercent) || 0;
            newBetAmount = newBetAmount * (1 + increasePercent / 100);
          }
        }

        setGameState(prev => ({
          ...prev,
          betAmount: newBetAmount.toFixed(2),
          autoBetsRemaining: prev.autoBetsRemaining !== null ? prev.autoBetsRemaining - 1 : null,
          autoProfit: prev.autoProfit + profit,
        }));
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [
    gameState.isAutoPlaying,
    gameState.phase,
    gameState.position,
    gameState.betAmount,
    gameState.autoBetsRemaining,
    gameState.autoProfit,
    gameState.autoConfig,
    gameState.resultHistory,
    stopAutoPlay,
    startGame,
    jump,
    cashout,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, []);

  // Computed values
  const nextMultiplier = gameState.multipliers?.[gameState.position] || 0;
  const canJump = gameState.phase === 'playing' && gameState.position < 19;
  const canCashout = gameState.phase === 'playing' && gameState.position >= 1;

  return {
    gameState,
    nextMultiplier,
    canJump,
    canCashout,
    setBetAmount,
    setBetMode,
    setDifficulty,
    updateAutoConfig,
    startGame,
    jump,
    cashout,
    startAutoPlay,
    stopAutoPlay,
    toggleAutoPlay,
  };
}
