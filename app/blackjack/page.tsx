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
  const prevHandCountRef = useRef<number>(0);
  // Track all player card IDs across all hands
  const prevAllPlayerCardIdsRef = useRef<Set<string>>(new Set());

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
    prevHandCountRef.current = 0;
    prevAllPlayerCardIdsRef.current = new Set();
    originalNewGame();
  }, [originalNewGame, clearAnimations]);

  // Wrapped deal that handles exit animation for previous cards
  const deal = useCallback(() => {
    // Collect cards from ALL player hands (for split support)
    const allPlayerCards: Card[] = [];
    gameState.playerHands.forEach(hand => {
      allPlayerCards.push(...hand.cards);
    });
    const currentDealerCards = gameState.dealerHand?.cards ?? [];

    // If there are existing cards (from previous game), animate them out first
    if (allPlayerCards.length > 0 || currentDealerCards.length > 0) {
      const exitSequence = createExitAnimationSequence(allPlayerCards, currentDealerCards);
      queueExitAnimation(exitSequence, () => {
        // After exit animation, reset everything and start fresh
        clearAnimations();
        prevPlayerCardsRef.current = [];
        prevDealerCardsRef.current = [];
        prevHandCountRef.current = 0;
        prevAllPlayerCardIdsRef.current = new Set();
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
    const currentHandCount = gameState.playerHands.length;
    const prevHandCount = prevHandCountRef.current;
    const currentPlayerCards = gameState.playerHands[0]?.cards ?? [];
    const currentDealerCards = gameState.dealerHand?.cards ?? [];
    const prevPlayerCards = prevPlayerCardsRef.current;
    const prevDealerCards = prevDealerCardsRef.current;

    // Detect split: 1 hand became 2 hands
    const isSplit = prevHandCount === 1 && currentHandCount === 2;

    console.log('Animation check:', {
      prevHandCount,
      currentHandCount,
      isSplit,
      prevPlayerCardsLen: prevPlayerCards.length,
      currentPlayerCardsLen: currentPlayerCards.length,
      prevDealerCardsLen: prevDealerCards.length,
      currentDealerCardsLen: currentDealerCards.length,
    });

    if (isSplit) {
      // For split: animate the NEW cards dealt to each hand (2nd card of each hand)
      // The original cards just appear in their new positions
      // IMPORTANT: At split time, playerRef is still at center (CSS transition hasn't completed)
      // So we use absolute offsets from center, not relative to playerRef's final position
      const SPLIT_HAND_0_OFFSET = -155; // Main 0 target: -155px from center
      const SPLIT_HAND_1_OFFSET = 155;  // Main 1 target: +155px from center

      const hand0NewCard = gameState.playerHands[0]?.cards[1];
      const hand1NewCard = gameState.playerHands[1]?.cards[1];

      let delay = 0;
      if (hand0NewCard) {
        const sequence = createHitAnimationSequence(hand0NewCard, 'player', 1, true);
        sequence[0].delay = delay;
        sequence[0].handOffsetX = SPLIT_HAND_0_OFFSET;
        sequence[0].totalCardsInHand = 2;
        queueAnimation(sequence);
        delay += 400;
      }
      if (hand1NewCard) {
        const sequence = createHitAnimationSequence(hand1NewCard, 'player', 1, true);
        sequence[0].delay = delay;
        sequence[0].handOffsetX = SPLIT_HAND_1_OFFSET;
        sequence[0].totalCardsInHand = 2;
        queueAnimation(sequence);
      }
    } else if (prevPlayerCards.length === 0 && currentPlayerCards.length >= 2 &&
        prevDealerCards.length === 0 && currentDealerCards.length >= 2) {
      // Check if this is initial deal (going from 0 cards to multiple)
      // Initial deal animation
      const sequence = createDealAnimationSequence(currentPlayerCards, currentDealerCards);
      queueAnimation(sequence);
    } else {
      // Check for new player cards (hit) in any hand
      // playerRef points to hand 0 which is at -155px from center
      // Hand 0: offset 0 (playerRef is already there)
      // Hand 1: offset 310 (distance from hand 0 at -155px to hand 1 at +155px)
      const SPLIT_HAND_0_OFFSET = 0;
      const SPLIT_HAND_1_OFFSET = 310;
      const prevAllCardIds = prevAllPlayerCardIdsRef.current;

      // For each hand, check for new cards
      gameState.playerHands.forEach((hand, handIndex) => {
        const totalCardsInHand = hand.cards.length;
        hand.cards.forEach((card, cardIndex) => {
          if (!prevAllCardIds.has(card.id)) {
            // New card detected - animate it
            const sequence = createHitAnimationSequence(card, 'player', cardIndex, true);
            sequence[0].totalCardsInHand = totalCardsInHand;
            // Apply offset for split hands (relative to playerRef which is hand 0)
            if (currentHandCount > 1) {
              sequence[0].handOffsetX = handIndex === 0 ? SPLIT_HAND_0_OFFSET : SPLIT_HAND_1_OFFSET;
            }
            queueAnimation(sequence);
          }
        });
      });

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
    prevHandCountRef.current = currentHandCount;
    // Update all player card IDs
    const allCardIds = new Set<string>();
    gameState.playerHands.forEach(hand => {
      hand.cards.forEach(card => allCardIds.add(card.id));
    });
    prevAllPlayerCardIdsRef.current = allCardIds;
  }, [gameState.playerHands, gameState.dealerHand, gameState.activeHandIndex, queueAnimation]);

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
          resultsPerHand={gameState.resultsPerHand}
          showResult={showResult}
          betAmount={parseFloat(betAmount) || 0}
          payout={gameState.payout}
          insuranceBet={gameState.insuranceBet}
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
