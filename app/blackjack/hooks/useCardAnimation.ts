'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Card, CardAnimationState, CardToAnimate, AnimationPhase } from '../types';

const ANIMATION_DURATION = 400; // ms for card movement
const FLIP_START_OFFSET = 100; // ms before arrival to start flip
const CARD_DELAY = 400; // ms between each card
const EXIT_PAUSE = 200; // ms pause after exit animation before dealing new cards

interface AnimationRefs {
  deckRef: React.RefObject<HTMLDivElement | null>;
  dealerRef: React.RefObject<HTMLDivElement | null>;
  playerRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface CardToExit {
  card: Card;
  fromHand: 'player' | 'dealer';
  fromIndex: number;
}

interface UseCardAnimationReturn {
  animatingCards: CardAnimationState[];
  queueAnimation: (cards: CardToAnimate[]) => void;
  queueExitAnimation: (cards: CardToExit[], onComplete?: () => void) => void;
  isAnimating: boolean;
  clearAnimations: () => void;
}

export function useCardAnimation(refs: AnimationRefs): UseCardAnimationReturn {
  const [animatingCards, setAnimatingCards] = useState<CardAnimationState[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const clearAnimations = useCallback(() => {
    clearTimeouts();
    setAnimatingCards([]);
  }, [clearTimeouts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const getPosition = useCallback((
    element: HTMLElement | null,
    container: HTMLElement | null
  ): { x: number; y: number } => {
    if (!element || !container) return { x: 0, y: 0 };

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      x: elementRect.left - containerRect.left + elementRect.width / 2,
      y: elementRect.top - containerRect.top + elementRect.height / 2,
    };
  }, []);

  const calculateTargetPosition = useCallback((
    targetHand: 'player' | 'dealer',
    targetIndex: number,
    container: HTMLElement | null,
    targetRef: HTMLElement | null,
    handOffsetX: number = 0,
    totalCardsInHand?: number
  ): { x: number; y: number } => {
    const basePos = getPosition(targetRef, container);

    // Get card width from ref for percentage calculations
    const cardWidth = targetRef?.getBoundingClientRect().width ?? 80;

    let offsetX: number;
    if (targetHand === 'dealer') {
      // Dealer cards: simple stacking at 33% per card
      offsetX = targetIndex * (cardWidth * 0.33);
    } else {
      // Player cards: match Hand.tsx calculation
      // offset = index * 36% - centering
      // centering = 35 * (totalCards - 1) / 2 %
      const totalCards = totalCardsInHand ?? (targetIndex + 1);
      const cardOffset = targetIndex * 36; // percentage
      const centeringOffset = 35 * (totalCards - 1) / 2; // percentage
      offsetX = (cardOffset - centeringOffset) * (cardWidth / 100);
    }

    return {
      x: basePos.x + offsetX + handOffsetX,
      y: basePos.y,
    };
  }, [getPosition]);

  const updateCardPhase = useCallback((cardId: string, phase: AnimationPhase) => {
    setAnimatingCards(prev =>
      prev.map(card =>
        card.cardId === cardId ? { ...card, phase } : card
      )
    );
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setAnimatingCards(prev => prev.filter(card => card.cardId !== cardId));
  }, []);

  const queueAnimation = useCallback((cards: CardToAnimate[]) => {
    if (cards.length === 0) return;

    const { deckRef, dealerRef, playerRef, containerRef } = refs;
    const container = containerRef.current;
    const deckPos = getPosition(deckRef.current, container);

    // Create animation states for all cards
    const newAnimatingCards: CardAnimationState[] = cards.map((cardToAnimate) => {
      const targetRef = cardToAnimate.targetHand === 'dealer'
        ? dealerRef.current
        : playerRef.current;

      const targetPos = calculateTargetPosition(
        cardToAnimate.targetHand,
        cardToAnimate.targetIndex,
        container,
        targetRef,
        cardToAnimate.handOffsetX ?? 0,
        cardToAnimate.totalCardsInHand
      );

      return {
        cardId: cardToAnimate.card.id,
        card: { ...cardToAnimate.card, faceUp: false }, // Start face down
        phase: 'queued' as AnimationPhase,
        startX: deckPos.x,
        startY: deckPos.y,
        endX: targetPos.x,
        endY: targetPos.y,
        targetHand: cardToAnimate.targetHand,
        targetIndex: cardToAnimate.targetIndex,
        shouldFlip: cardToAnimate.shouldFlip,
        handOffsetX: cardToAnimate.handOffsetX,
      };
    });

    // Add new cards to existing animating cards
    setAnimatingCards(prev => [...prev, ...newAnimatingCards]);

    // Schedule animations for each card
    cards.forEach((cardToAnimate) => {
      const cardId = cardToAnimate.card.id;
      const startDelay = cardToAnimate.delay;

      // Start movement
      const moveTimeout = setTimeout(() => {
        updateCardPhase(cardId, 'moving');
      }, startDelay);
      timeoutsRef.current.push(moveTimeout);

      // Start flip (if needed) - simultaneously with movement
      if (cardToAnimate.shouldFlip) {
        const flipTimeout = setTimeout(() => {
          updateCardPhase(cardId, 'flipping');
          setAnimatingCards(prev =>
            prev.map(card =>
              card.cardId === cardId
                ? { ...card, card: { ...card.card, faceUp: true } }
                : card
            )
          );
        }, startDelay);
        timeoutsRef.current.push(flipTimeout);
      }

      // Mark as settled and remove
      const settleTimeout = setTimeout(() => {
        removeCard(cardId);
      }, startDelay + ANIMATION_DURATION + 100);
      timeoutsRef.current.push(settleTimeout);
    });
  }, [refs, getPosition, calculateTargetPosition, updateCardPhase, removeCard]);

  const queueExitAnimation = useCallback((cards: CardToExit[], onComplete?: () => void) => {
    if (cards.length === 0) {
      onComplete?.();
      return;
    }

    clearTimeouts();

    const { deckRef, dealerRef, playerRef, containerRef } = refs;
    const container = containerRef.current;
    const deckPos = getPosition(deckRef.current, container);

    // Create animation states for exit (cards going TO the deck)
    const exitAnimatingCards: CardAnimationState[] = cards.map((cardToExit) => {
      const sourceRef = cardToExit.fromHand === 'dealer'
        ? dealerRef.current
        : playerRef.current;

      const sourcePos = calculateTargetPosition(
        cardToExit.fromHand,
        cardToExit.fromIndex,
        container,
        sourceRef
      );

      return {
        cardId: cardToExit.card.id,
        card: cardToExit.card,
        phase: 'queued' as AnimationPhase,
        startX: sourcePos.x,
        startY: sourcePos.y,
        endX: deckPos.x,
        endY: deckPos.y,
        targetHand: cardToExit.fromHand,
        targetIndex: cardToExit.fromIndex,
        shouldFlip: false,
        isExit: true,
      };
    });

    setAnimatingCards(exitAnimatingCards);

    // All cards start moving at the same time for exit
    const moveTimeout = setTimeout(() => {
      setAnimatingCards(prev =>
        prev.map(card => ({ ...card, phase: 'moving' as AnimationPhase }))
      );
    }, 50);
    timeoutsRef.current.push(moveTimeout);

    // Flip cards face down during exit
    const flipTimeout = setTimeout(() => {
      setAnimatingCards(prev =>
        prev.map(card => ({
          ...card,
          phase: 'flipping' as AnimationPhase,
          card: { ...card.card, faceUp: false },
        }))
      );
    }, ANIMATION_DURATION / 2);
    timeoutsRef.current.push(flipTimeout);

    // Call onComplete after a slight pause (don't clear animations here - they will be replaced by the deal animation)
    const completeTimeout = setTimeout(() => {
      onComplete?.();
    }, ANIMATION_DURATION + 100 + EXIT_PAUSE);
    timeoutsRef.current.push(completeTimeout);
  }, [refs, getPosition, calculateTargetPosition, clearTimeouts]);

  return {
    animatingCards,
    queueAnimation,
    queueExitAnimation,
    isAnimating: animatingCards.length > 0,
    clearAnimations,
  };
}

// Helper to create animation sequence for initial deal
export function createDealAnimationSequence(
  playerCards: Card[],
  dealerCards: Card[]
): CardToAnimate[] {
  const sequence: CardToAnimate[] = [];
  let currentDelay = 0;

  // Deal alternates: player, dealer, player, dealer
  for (let i = 0; i < Math.max(playerCards.length, dealerCards.length); i++) {
    if (i < playerCards.length) {
      sequence.push({
        card: playerCards[i],
        targetHand: 'player',
        targetIndex: i,
        shouldFlip: true, // Player cards are face up
        delay: currentDelay,
      });
      currentDelay += CARD_DELAY;
    }

    if (i < dealerCards.length) {
      sequence.push({
        card: dealerCards[i],
        targetHand: 'dealer',
        targetIndex: i,
        shouldFlip: i === 0, // Only first dealer card is face up
        delay: currentDelay,
      });
      currentDelay += CARD_DELAY;
    }
  }

  return sequence;
}

// Helper for hit animation
export function createHitAnimationSequence(
  card: Card,
  targetHand: 'player' | 'dealer',
  cardIndex: number,
  shouldFlip = true
): CardToAnimate[] {
  return [{
    card,
    targetHand,
    targetIndex: cardIndex,
    shouldFlip,
    delay: 0,
  }];
}

// Helper to create exit animation sequence (cards returning to deck)
export function createExitAnimationSequence(
  playerCards: Card[],
  dealerCards: Card[]
): CardToExit[] {
  const sequence: CardToExit[] = [];

  // Add player cards
  playerCards.forEach((card, index) => {
    sequence.push({
      card,
      fromHand: 'player',
      fromIndex: index,
    });
  });

  // Add dealer cards
  dealerCards.forEach((card, index) => {
    sequence.push({
      card,
      fromHand: 'dealer',
      fromIndex: index,
    });
  });

  return sequence;
}

export type { CardToExit };
