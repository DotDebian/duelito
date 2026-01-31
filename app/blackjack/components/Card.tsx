'use client';

import { memo } from 'react';
import type { Card as CardType } from '../types';
import { isRedSuit } from '@/lib/blackjack-utils';
import { CardBack } from './CardBack';

interface CardProps {
  card: CardType;
  isWinner?: boolean;
  isLoser?: boolean;
  delay?: number;
  isHidden?: boolean;
}

const suitToImage: Record<string, string> = {
  hearts: '/images/games/blackjack/hearts.svg',
  diamonds: '/images/games/blackjack/diamonds.svg',
  clubs: '/images/games/blackjack/clubs.svg',
  spades: '/images/games/blackjack/spades.svg',
};

interface SuitIconProps {
  suit: string;
  size: number;
  isRed: boolean;
}

function SuitIcon({ suit, size, isRed }: SuitIconProps) {
  const filter = isRed
    ? 'invert(36%) sepia(95%) saturate(2000%) hue-rotate(343deg) brightness(90%)'
    : 'none';

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={suitToImage[suit]}
      alt={suit}
      width={size}
      height={size}
      style={{ filter }}
    />
  );
}

export const Card = memo(function Card({ card, isWinner, isLoser, delay = 0, isHidden = false }: CardProps) {
  const isRed = isRedSuit(card.suit);
  const textColor = isRed ? 'text-red-500' : 'text-dark-900';
  const borderColor = isWinner ? 'border-green-500' : isLoser ? 'border-red-500' : 'border-light-000';

  return (
    <div
      className="card-container aspect-[120/167] h-full"
      style={{ visibility: isHidden ? 'hidden' : 'visible' }}
    >
      <div
        data-testid="card-content"
        className="card-flipper relative h-full w-full rounded-8"
        style={{
          transformStyle: 'preserve-3d',
          transform: card.faceUp ? 'rotateY(0deg) translateZ(0px)' : 'rotateY(180deg) translateZ(0px)',
          transitionDelay: `${delay}ms`,
        }}
      >
        {/* Front face */}
        <div
          className={`absolute flex h-full w-full flex-col rounded-8 border bg-light-000 p-2 font-bold shadow-lg sm:shadow-none sm:drop-shadow-lg xl:border-2 ${textColor} transition-colors delay-150 duration-300 ${borderColor}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
        >
          {/* Top left: rank + small icon */}
          <div className="flex gap-0.5 flex-col">
            <span className="text-lg leading-none sm:text-xl xl:text-2xl">{card.rank}</span>
            <SuitIcon suit={card.suit} size={14} isRed={isRed} />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom right: large icon only */}
          <div className="flex justify-end">
            <SuitIcon suit={card.suit} size={48} isRed={isRed} />
          </div>
        </div>

        {/* Back face */}
        <CardBack />
      </div>
    </div>
  );
});
