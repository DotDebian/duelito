'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { BlackjackGameState } from '../types';
import { canSplitHand } from '@/lib/blackjack-utils';

const INITIAL_BALANCE = 1000;

const initialState: BlackjackGameState = {
  gameId: null,
  phase: 'betting',
  dealerHand: null,
  playerHands: [],
  activeHandIndex: 0,
  balance: INITIAL_BALANCE,
  currentBet: 0,
  insuranceBet: null,
  result: null,
  payout: 0,
};

export function useBlackjackGame() {
  const [gameState, setGameState] = useState<BlackjackGameState>(initialState);
  const [betAmount, setBetAmount] = useState('10.00');
  const [isLoading, setIsLoading] = useState(false);

  const currentHand = useMemo(() => {
    return gameState.playerHands[gameState.activeHandIndex] ?? null;
  }, [gameState.playerHands, gameState.activeHandIndex]);

  // Use a ref to avoid circular dependency with stand
  const standRef = useRef<(() => Promise<void>) | undefined>(undefined);

  const triggerDealerTurn = useCallback((delay: number) => {
    setTimeout(() => {
      standRef.current?.();
    }, delay);
  }, []);

  const deal = useCallback(async () => {
    const bet = parseFloat(betAmount) || 0;
    if (bet <= 0 || bet > gameState.balance) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/blackjack/deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betAmount: bet }),
      });
      const data = await response.json();

      setGameState(prev => ({
        ...prev,
        gameId: data.gameId,
        phase: data.phase,
        dealerHand: data.dealerHand,
        playerHands: data.playerHands,
        activeHandIndex: data.activeHandIndex,
        balance: prev.balance - bet,
        currentBet: bet,
        result: null,
        payout: 0,
      }));

      // If player has blackjack, trigger dealer turn
      if (data.phase === 'dealer_turn') {
        triggerDealerTurn(1000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [betAmount, gameState.balance, triggerDealerTurn]);

  const hit = useCallback(async () => {
    if (gameState.phase !== 'player_turn' || !currentHand || currentHand.isBusted) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/blackjack/hit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameState.gameId,
          playerHands: gameState.playerHands,
          activeHandIndex: gameState.activeHandIndex,
        }),
      });
      const data = await response.json();

      setGameState(prev => ({
        ...prev,
        playerHands: data.playerHands,
        activeHandIndex: data.activeHandIndex,
        phase: data.phase,
      }));

      // If phase changed to dealer_turn, trigger it
      if (data.phase === 'dealer_turn') {
        triggerDealerTurn(500);
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.phase, gameState.playerHands, gameState.activeHandIndex, currentHand, triggerDealerTurn]);

  const stand = useCallback(async () => {
    if (gameState.phase !== 'player_turn' && gameState.phase !== 'dealer_turn') return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/blackjack/stand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameState.gameId,
          dealerHand: gameState.dealerHand,
          playerHands: gameState.playerHands,
          activeHandIndex: gameState.activeHandIndex,
        }),
      });
      const data = await response.json();

      if (data.phase === 'settled') {
        setGameState(prev => ({
          ...prev,
          dealerHand: data.dealerHand,
          playerHands: data.playerHands,
          phase: 'settled',
          result: data.result,
          payout: data.payout,
          balance: prev.balance + data.payout,
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          playerHands: data.playerHands,
          activeHandIndex: data.activeHandIndex,
          phase: data.phase,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.phase, gameState.dealerHand, gameState.playerHands, gameState.activeHandIndex]);

  // Update ref when stand changes
  useEffect(() => {
    standRef.current = stand;
  }, [stand]);

  const double = useCallback(async () => {
    if (gameState.phase !== 'player_turn' || !currentHand || currentHand.cards.length !== 2) return;
    if (gameState.balance < currentHand.bet) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/blackjack/double', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameState.gameId,
          playerHands: gameState.playerHands,
          activeHandIndex: gameState.activeHandIndex,
        }),
      });
      const data = await response.json();

      setGameState(prev => ({
        ...prev,
        playerHands: data.playerHands,
        activeHandIndex: data.activeHandIndex,
        phase: data.phase,
        balance: prev.balance - currentHand.bet, // Deduct additional bet
      }));

      // If phase changed to dealer_turn, trigger it
      if (data.phase === 'dealer_turn') {
        triggerDealerTurn(500);
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.phase, gameState.playerHands, gameState.activeHandIndex, gameState.balance, currentHand, triggerDealerTurn]);

  const split = useCallback(async () => {
    if (gameState.phase !== 'player_turn' || !canSplitHand(currentHand)) return;
    if (gameState.balance < (currentHand?.bet ?? 0)) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/blackjack/split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameState.gameId,
          playerHands: gameState.playerHands,
          activeHandIndex: gameState.activeHandIndex,
        }),
      });
      const data = await response.json();

      setGameState(prev => ({
        ...prev,
        playerHands: data.playerHands,
        activeHandIndex: data.activeHandIndex,
        phase: data.phase,
        balance: prev.balance - (currentHand?.bet ?? 0), // Deduct additional bet
      }));

      // If phase changed to dealer_turn, trigger it
      if (data.phase === 'dealer_turn') {
        triggerDealerTurn(500);
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.phase, gameState.playerHands, gameState.activeHandIndex, gameState.balance, currentHand, triggerDealerTurn]);

  const acceptInsurance = useCallback(async () => {
    if (gameState.phase !== 'insurance_offer') return;

    setIsLoading(true);
    try {
      const insuranceBet = gameState.currentBet / 2;
      const response = await fetch('/api/blackjack/insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameState.gameId,
          dealerHand: gameState.dealerHand,
          playerHands: gameState.playerHands,
          acceptInsurance: true,
          currentBet: gameState.currentBet,
        }),
      });
      const data = await response.json();

      if (data.phase === 'settled') {
        setGameState(prev => ({
          ...prev,
          dealerHand: data.dealerHand,
          phase: 'settled',
          result: data.result,
          payout: data.payout,
          insuranceBet,
          balance: prev.balance - insuranceBet + data.payout,
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          dealerHand: data.dealerHand,
          phase: data.phase,
          insuranceBet,
          balance: prev.balance - insuranceBet,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.phase, gameState.dealerHand, gameState.playerHands, gameState.currentBet]);

  const declineInsurance = useCallback(async () => {
    if (gameState.phase !== 'insurance_offer') return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/blackjack/insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameState.gameId,
          dealerHand: gameState.dealerHand,
          playerHands: gameState.playerHands,
          acceptInsurance: false,
          currentBet: gameState.currentBet,
        }),
      });
      const data = await response.json();

      if (data.phase === 'settled') {
        setGameState(prev => ({
          ...prev,
          dealerHand: data.dealerHand,
          phase: 'settled',
          result: data.result,
          payout: data.payout,
          balance: prev.balance + data.payout,
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          dealerHand: data.dealerHand,
          phase: data.phase,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.phase, gameState.dealerHand, gameState.playerHands, gameState.currentBet]);

  const newGame = useCallback(() => {
    setGameState(prev => ({
      ...initialState,
      balance: prev.balance,
    }));
  }, []);

  // Computed properties
  const canHit = gameState.phase === 'player_turn' && currentHand && !currentHand.isBusted && !currentHand.isStood;
  const canStand = gameState.phase === 'player_turn' && currentHand && !currentHand.isBusted;
  const canDouble = gameState.phase === 'player_turn' && currentHand && currentHand.cards.length === 2 && !currentHand.isBusted && gameState.balance >= currentHand.bet;
  const canSplit = gameState.phase === 'player_turn' && canSplitHand(currentHand) && gameState.balance >= (currentHand?.bet ?? 0);

  return {
    gameState,
    betAmount,
    setBetAmount,
    isLoading,
    deal,
    hit,
    stand,
    double,
    split,
    acceptInsurance,
    declineInsurance,
    newGame,
    canHit,
    canStand,
    canDouble,
    canSplit,
    currentHand,
  };
}
