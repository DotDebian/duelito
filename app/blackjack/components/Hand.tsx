'use client';

import { memo } from 'react';
import type { Hand as HandType, HandResult } from '../types';
import { Card } from './Card';

interface HandProps {
  hand: HandType;
  isDealer?: boolean;
  result?: HandResult;
  showResult?: boolean;
  hiddenCardIds?: Set<string>;
}

export const Hand = memo(function Hand({ hand, isDealer, result, showResult, hiddenCardIds = new Set() }: HandProps) {
  const isWinner = showResult && (result === 'win' || result === 'blackjack');
  const isLoser = showResult && result === 'lose';

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {hand.cards.map((card, index) => {
        // Calculate offset for stacking
        const offset = isDealer
          ? index * 33 // Dealer cards stack horizontally
          : index * 35; // Player cards fan out horizontally

        const rotation = isDealer ? 0 : (index - (hand.cards.length - 1) / 2) * 8;

        return (
          <div
            key={card.id}
            className="absolute z-[8] flex h-full w-full select-none rounded-8 will-change-transform"
            style={{
              transform: isDealer
                ? `translateX(${offset}%)`
                : `translateX(${offset - 35 * (hand.cards.length - 1) / 2}%) rotate(${rotation}deg)`,
              zIndex: index + 1,
            }}
          >
            <Card
              card={card}
              isWinner={isWinner}
              isLoser={isLoser}
              delay={index * 150}
              isHidden={hiddenCardIds.has(card.id)}
            />
          </div>
        );
      })}
    </div>
  );
});
