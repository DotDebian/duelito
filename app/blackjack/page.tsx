'use client';

import { useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { GameLayout } from '@/app/components';
import { BlackjackTable, BlackjackBottomControls } from './components';
import { useBlackjackGame } from './hooks';
import { useCardAnimation, createDealAnimationSequence, createHitAnimationSequence, createExitAnimationSequence } from './hooks/useCardAnimation';
import type { Card } from './types';

export default function BlackjackPage() {
  // Refs for animation positioning
  const deckRef = useRef<HTMLDivElement>(null);
  const dealerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track previous cards to detect new ones
  const prevPlayerCardsRef = useRef<Card[]>([]);
  const prevDealerCardsRef = useRef<Card[]>([]);

  const {
    gameState,
    betAmount,
    setBetAmount,
    isLoading,
    deal: originalDeal,
    hit: originalHit,
    stand,
    double: originalDouble,
    split,
    acceptInsurance,
    declineInsurance,
    newGame: originalNewGame,
    canHit,
    canStand,
    canDouble,
    canSplit,
  } = useBlackjackGame();

  const { animatingCards, queueAnimation, queueExitAnimation, isAnimating, clearAnimations } = useCardAnimation({
    deckRef,
    dealerRef,
    playerRef,
    containerRef,
  });

  // Reset card tracking on new game
  const newGame = useCallback(() => {
    clearAnimations();
    prevPlayerCardsRef.current = [];
    prevDealerCardsRef.current = [];
    originalNewGame();
  }, [originalNewGame, clearAnimations]);

  // Wrapped deal that handles exit animation for previous cards
  const deal = useCallback(() => {
    const currentPlayerCards = gameState.playerHands[0]?.cards ?? [];
    const currentDealerCards = gameState.dealerHand?.cards ?? [];

    // If there are existing cards (from previous game), animate them out first
    if (currentPlayerCards.length > 0 || currentDealerCards.length > 0) {
      const exitSequence = createExitAnimationSequence(currentPlayerCards, currentDealerCards);
      queueExitAnimation(exitSequence, () => {
        // After exit animation, reset everything and start fresh
        clearAnimations();
        prevPlayerCardsRef.current = [];
        prevDealerCardsRef.current = [];
        originalNewGame();
        // Small delay to ensure state is reset before dealing
        setTimeout(() => {
          originalDeal();
        }, 0);
      });
    } else {
      originalDeal();
    }
  }, [gameState.playerHands, gameState.dealerHand, queueExitAnimation, originalDeal, originalNewGame, clearAnimations]);

  // Watch for card changes and trigger animations
  useLayoutEffect(() => {
    const currentPlayerCards = gameState.playerHands[0]?.cards ?? [];
    const currentDealerCards = gameState.dealerHand?.cards ?? [];
    const prevPlayerCards = prevPlayerCardsRef.current;
    const prevDealerCards = prevDealerCardsRef.current;

    // Check if this is initial deal (going from 0 cards to multiple)
    if (prevPlayerCards.length === 0 && currentPlayerCards.length >= 2 &&
        prevDealerCards.length === 0 && currentDealerCards.length >= 2) {
      // Initial deal animation
      const sequence = createDealAnimationSequence(currentPlayerCards, currentDealerCards);
      queueAnimation(sequence);
    } else {
      // Check for new player cards (hit)
      if (currentPlayerCards.length > prevPlayerCards.length) {
        const newCards = currentPlayerCards.slice(prevPlayerCards.length);
        newCards.forEach((card, i) => {
          const sequence = createHitAnimationSequence(
            card,
            'player',
            prevPlayerCards.length + i,
            true
          );
          queueAnimation(sequence);
        });
      }

      // Check for new dealer cards (dealer turn)
      if (currentDealerCards.length > prevDealerCards.length) {
        const newCards = currentDealerCards.slice(prevDealerCards.length);
        newCards.forEach((card, i) => {
          const sequence = createHitAnimationSequence(
            card,
            'dealer',
            prevDealerCards.length + i,
            card.faceUp
          );
          queueAnimation(sequence);
        });
      }
    }

    // Update refs immediately
    prevPlayerCardsRef.current = currentPlayerCards;
    prevDealerCardsRef.current = currentDealerCards;
  }, [gameState.playerHands, gameState.dealerHand, queueAnimation]);

  const showResult = gameState.phase === 'settled';

  // Get IDs of cards currently being animated OR about to be animated
  // This includes cards that were just added but haven't been processed by useLayoutEffect yet
  const animatingCardIds = useMemo(() => {
    const ids = new Set(animatingCards.map(c => c.cardId));

    const currentPlayerCards = gameState.playerHands[0]?.cards ?? [];
    const currentDealerCards = gameState.dealerHand?.cards ?? [];
    const prevPlayerCards = prevPlayerCardsRef.current;
    const prevDealerCards = prevDealerCardsRef.current;

    // Add IDs of newly added cards that will be animated
    // (these cards are in gameState but not yet in animatingCards)
    if (prevPlayerCards.length === 0 && currentPlayerCards.length >= 2 &&
        prevDealerCards.length === 0 && currentDealerCards.length >= 2) {
      // Initial deal - all cards will animate
      currentPlayerCards.forEach(c => ids.add(c.id));
      currentDealerCards.forEach(c => ids.add(c.id));
    } else {
      // Hit/dealer turn - only new cards will animate
      currentPlayerCards.slice(prevPlayerCards.length).forEach(c => ids.add(c.id));
      currentDealerCards.slice(prevDealerCards.length).forEach(c => ids.add(c.id));
    }

    return ids;
  }, [animatingCards, gameState.playerHands, gameState.dealerHand]);

  return (
    <GameLayout>
      {/* Main container matching duel.com structure */}
      <div className="relative mt-32 -mx-16 w-[calc(100%+32px)] overflow-hidden sm:-mx-32 sm:w-[calc(100%+64px)] md:h-[calc(100vh-80px)]">
        {/* Table area */}
        <BlackjackTable
          dealerHand={gameState.dealerHand}
          playerHands={gameState.playerHands}
          activeHandIndex={gameState.activeHandIndex}
          result={gameState.result}
          showResult={showResult}
          animatingCards={animatingCards}
          animatingCardIds={animatingCardIds}
          deckRef={deckRef}
          dealerRef={dealerRef}
          playerRef={playerRef}
          containerRef={containerRef}
        />

        {/* Bottom controls */}
        <BlackjackBottomControls
          phase={gameState.phase}
          betAmount={betAmount}
          onBetAmountChange={setBetAmount}
          onDeal={deal}
          onNewGame={newGame}
          onHit={originalHit}
          onStand={stand}
          onDouble={originalDouble}
          onSplit={split}
          onAcceptInsurance={acceptInsurance}
          onDeclineInsurance={declineInsurance}
          canHit={canHit && !isAnimating}
          canStand={canStand && !isAnimating}
          canDouble={canDouble && !isAnimating}
          canSplit={canSplit && !isAnimating}
          isLoading={isLoading || isAnimating}
          result={gameState.result}
          payout={gameState.payout}
        />
      </div>
    </GameLayout>
  );
}
