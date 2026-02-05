'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { BlackjackGameState } from '../types';
import { canSplitHand } from '@/lib/blackjack-utils';
import { useBalance } from '@/app/contexts/BalanceContext';

const initialState: BlackjackGameState = {
  gameId: null,
  phase: 'betting',
  dealerHand: null,
  playerHands: [],
  activeHandIndex: 0,
  currentBet: 0,
  insuranceBet: null,
  result: null,
  payout: 0,
};

export function useBlackjackGame() {
  const [gameState, setGameState] = useState<BlackjackGameState>(initialState);
  const [betAmount, setBetAmount] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const { balance, addBalance, subtractBalance } = useBalance();

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
    if (bet < 0 || bet > balance) return;

    // Deduct bet from balance
    subtractBalance(bet);

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
  }, [betAmount, balance, subtractBalance, triggerDealerTurn]);

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
        // Add payout to balance
        if (data.payout > 0) {
          addBalance(data.payout);
        }
        setGameState(prev => ({
          ...prev,
          dealerHand: data.dealerHand,
          playerHands: data.playerHands,
          phase: 'settled',
          result: data.result,
          payout: data.payout,
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
  }, [gameState.gameId, gameState.phase, gameState.dealerHand, gameState.playerHands, gameState.activeHandIndex, addBalance]);

  // Update ref when stand changes
  useEffect(() => {
    standRef.current = stand;
  }, [stand]);

  const double = useCallback(async () => {
    if (gameState.phase !== 'player_turn' || !currentHand || currentHand.cards.length !== 2) return;
    if (balance < currentHand.bet) return;

    // Deduct additional bet
    subtractBalance(currentHand.bet);

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
      }));

      // If phase changed to dealer_turn, trigger it
      if (data.phase === 'dealer_turn') {
        triggerDealerTurn(500);
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.phase, gameState.playerHands, gameState.activeHandIndex, balance, currentHand, triggerDealerTurn, subtractBalance]);

  const split = useCallback(async () => {
    if (gameState.phase !== 'player_turn' || !canSplitHand(currentHand)) return;
    if (balance < (currentHand?.bet ?? 0)) return;

    // Deduct additional bet
    subtractBalance(currentHand?.bet ?? 0);

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
      }));

      // If phase changed to dealer_turn, trigger it
      if (data.phase === 'dealer_turn') {
        triggerDealerTurn(500);
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.phase, gameState.playerHands, gameState.activeHandIndex, balance, currentHand, triggerDealerTurn, subtractBalance]);

  const acceptInsurance = useCallback(async () => {
    if (gameState.phase !== 'insurance_offer') return;

    const insuranceBet = gameState.currentBet / 2;

    // Deduct insurance bet
    subtractBalance(insuranceBet);

    setIsLoading(true);
    try {
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
        // Add payout to balance
        if (data.payout > 0) {
          addBalance(data.payout);
        }
        setGameState(prev => ({
          ...prev,
          dealerHand: data.dealerHand,
          phase: 'settled',
          result: data.result,
          payout: data.payout,
          insuranceBet,
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          dealerHand: data.dealerHand,
          phase: data.phase,
          insuranceBet,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.phase, gameState.dealerHand, gameState.playerHands, gameState.currentBet, subtractBalance, addBalance]);

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
        // Add payout to balance
        if (data.payout > 0) {
          addBalance(data.payout);
        }
        setGameState(prev => ({
          ...prev,
          dealerHand: data.dealerHand,
          phase: 'settled',
          result: data.result,
          payout: data.payout,
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
  }, [gameState.gameId, gameState.phase, gameState.dealerHand, gameState.playerHands, gameState.currentBet, addBalance]);

  const newGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  // Computed properties
  const canHit = gameState.phase === 'player_turn' && currentHand && !currentHand.isBusted && !currentHand.isStood;
  const canStand = gameState.phase === 'player_turn' && currentHand && !currentHand.isBusted;
  const canDouble = gameState.phase === 'player_turn' && currentHand && currentHand.cards.length === 2 && !currentHand.isBusted && balance >= currentHand.bet;
  const canSplit = gameState.phase === 'player_turn' && canSplitHand(currentHand) && balance >= (currentHand?.bet ?? 0);

  return {
    gameState,
    balance,
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
