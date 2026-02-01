'use client';

import { memo } from 'react';
import type { Card as CardType } from '../types';
import { isRedSuit } from '@/lib/blackjack-utils';
import { CardBack } from './CardBack';

interface CardProps {
  card: CardType;
  isWinner?: boolean;
  isLoser?: boolean;
  isPush?: boolean;
  isDealer?: boolean;
  delay?: number;
  isHidden?: boolean;
  flipDirection?: 'horizontal' | 'vertical';
}

interface SuitIconProps {
  suit: string;
  size: number;
}

function SuitIcon({ suit, size }: SuitIconProps) {
  const svgProps = { width: size, height: size, fill: 'currentColor' };

  switch (suit) {
    case 'hearts':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49 49" {...svgProps}>
          <path d="M48.77 15.453c0 12.639-12.927 16.674-23.999 29.603-11.073-12.929-24-16.965-24-29.603 0-7.826 6.234-12.397 12.137-12.397 5.902 0 11.04 5.333 11.863 9.005.823-3.672 5.96-9.005 11.862-9.005S48.77 7.626 48.77 15.453" />
        </svg>
      );
    case 'diamonds':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 49" {...svgProps}>
          <path d="M44 24.5c-8.317 6.067-16.75 16.398-20 24-3.25-7.602-11.683-17.933-20-24 8.317-6.067 16.75-16.398 20-24 3.249 7.602 11.681 17.933 19.999 24z" />
        </svg>
      );
    case 'clubs':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...svgProps}>
          <path d="M47 27.468c0 6.422-5.277 11.629-11.786 11.629a11.8 11.8 0 0 1-10.403-6.16c.165 3.13.72 6.295 2.187 8.67 1.476 2.391 4.11 4.393 6.862 5.076v1.318H14.14v-1.318c2.752-.683 5.386-2.685 6.862-5.075 1.467-2.376 2.021-5.541 2.186-8.67a11.8 11.8 0 0 1-10.402 6.159C6.278 39.095 1 33.89 1 27.467c0-6.422 5.278-11.629 11.786-11.629q.112-.001.224.004a11.5 11.5 0 0 1-.797-4.212C12.215 5.207 17.49 0 24 0c6.51 0 11.786 5.207 11.786 11.63 0 1.485-.282 2.906-.797 4.211q.111-.004.225-.004c6.51 0 11.785 5.208 11.785 11.63z" />
        </svg>
      );
    case 'spades':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49 49" {...svgProps}>
          <path d="M2.515 27.91c0-11.849 11.849-15.633 22-27.753 10.15 12.12 22 15.904 22 27.753 0 7.337-5.715 11.622-11.126 11.622-4.457 0-8.438-3.393-10.124-6.513.123 3.205.629 6.498 2.11 8.937 1.409 2.32 3.922 4.261 6.549 4.924v1.277H15.105V46.88c2.627-.663 5.14-2.605 6.55-4.925 1.48-2.438 1.986-5.731 2.11-8.936-1.686 3.121-5.667 6.513-10.125 6.513-5.41 0-11.125-4.285-11.125-11.622" />
        </svg>
      );
    default:
      return null;
  }
}

export const Card = memo(function Card({ card, isWinner, isLoser, isPush, isDealer, delay = 0, isHidden = false, flipDirection = 'horizontal' }: CardProps) {
  const isRed = isRedSuit(card.suit);
  const textColor = isRed ? 'text-red-500' : 'text-dark-900';

  // Only player cards get colored borders
  let borderColor = 'border-light-000';
  if (!isDealer) {
    if (isWinner) borderColor = 'border-green-500';
    else if (isLoser) borderColor = 'border-red-500';
    else if (isPush) borderColor = 'border-yellow-500';
  }

  const flipTransform = flipDirection === 'vertical'
    ? (card.faceUp ? 'rotateX(0deg) translateZ(0px)' : 'rotateX(180deg) translateZ(0px)')
    : (card.faceUp ? 'rotateY(0deg) translateZ(0px)' : 'rotateY(180deg) translateZ(0px)');

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
          transform: flipTransform,
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
            <SuitIcon suit={card.suit} size={14} />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom right: large icon only */}
          <div className="flex justify-end">
            <SuitIcon suit={card.suit} size={48} />
          </div>
        </div>

        {/* Back face */}
        <CardBack flipDirection={flipDirection} />
      </div>
    </div>
  );
});
