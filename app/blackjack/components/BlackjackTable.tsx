'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { Hand as HandType, HandResult, CardAnimationState } from '../types';
import { Hand } from './Hand';
import { ScoreBadge } from './ScoreBadge';
import { CardBack } from "@/app/blackjack/components/CardBack";
import { Card } from './Card';

interface BlackjackTableProps {
  dealerHand: HandType | null;
  playerHands: HandType[];
  activeHandIndex: number;
  result: HandResult;
  showResult: boolean;
  animatingCards?: CardAnimationState[];
  animatingCardIds?: Set<string>;
  deckRef?: React.RefObject<HTMLDivElement | null>;
  dealerRef?: React.RefObject<HTMLDivElement | null>;
  playerRef?: React.RefObject<HTMLDivElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const BlackjackTable = memo(function BlackjackTable({
  dealerHand,
  playerHands,
  activeHandIndex,
  result,
  showResult,
  animatingCards = [],
  animatingCardIds = new Set(),
  deckRef,
  dealerRef,
  playerRef,
  containerRef,
}: BlackjackTableProps) {
  return (
    <>
      {/* Top gradient overlay */}
      <div className="absolute top-0 z-10 h-32 w-full -translate-y-32 bg-dark-800" />

      {/* Table container - constrains all game elements to background size */}
      <div
        ref={containerRef}
        className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-[calc(75vh*1287/787)] aspect-[1287/787]"
      >
        {/* Table background */}
        <Image
          src="/images/card-table.png"
          alt="Blackjack table"
          width={1287}
          height={787}
          className="absolute inset-0 h-full w-full object-contain object-top"
          draggable={false}
          priority
          unoptimized
        />

        {/* Deck pile (dealer's cards to draw from) */}
        <div
          ref={deckRef}
          className="relative flex rounded-8 absolute left-1/2 top-0 aspect-[120/167] translate-x-[170%] translate-y-[-50%] max-h-[17vh] w-[10%]"
        >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute flex h-full w-full select-none will-change-transform shadow-md sm:shadow-none sm:drop-shadow-lg"
            style={{ zIndex: 3 - i, transform: `translateY(${i * 4}px)` }}
          >
            <div className="card-container aspect-[120/167] h-full">
              <div
                className="card-flipper relative h-full w-full rounded-8"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(180deg) translateZ(0px)',
                }}
              >
                <div
                  className="absolute flex h-full w-full flex-col gap-2 rounded-8 border bg-light-000 p-4 pt-0 font-bold shadow-lg sm:shadow-none sm:drop-shadow-lg xl:border-2 xl:p-[6px] xl:pt-2 text-b-sm sm:text-b-lg xl:text-h-lg text-red-500 border-light-000"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
                />
                <CardBack/>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dealer hand area */}
      {dealerHand && (() => {
        const visibleCardCount = dealerHand.cards.filter(c => !animatingCardIds.has(c.id)).length;
        return (
        <div
          ref={dealerRef}
          className="transition-opacity delay-150 duration-300 absolute left-1/2 top-8 aspect-[120/167] translate-y-[15%] max-h-[17vh] w-[10%]"
          style={{ transform: `translateX(-${(105 + ((105 / 3) * (dealerHand.cards.length - 1))) / 2}px)` }}
        >
          {/* Score badge */}
          <div
            className="absolute z-[10] h-full w-full transition-all delay-150 duration-300 will-change-transform"
            style={{ transform: `translate(${73 + 33 * (visibleCardCount - 1)}%, 85%)` }}
          >
            <ScoreBadge cards={dealerHand.cards} result={result === 'win' || result === 'blackjack' ? 'lose' : result === 'lose' ? 'win' : result} showResult={showResult} />
          </div>

          {/* Dealer cards */}
          <Hand
            hand={dealerHand}
            isDealer
            result={result === 'win' || result === 'blackjack' ? 'lose' : result === 'lose' ? 'win' : result}
            showResult={showResult}
            hiddenCardIds={animatingCardIds}
          />
        </div>
        );
      })()}

      {/* Player hand(s) area */}
      {playerHands.map((hand, index) => {
        const visibleCardCount = hand.cards.filter(c => !animatingCardIds.has(c.id)).length;
        return (
        <div
          key={index}
          ref={index === 0 ? playerRef : undefined}
          className="transition-opacity delay-150 duration-300 absolute left-1/2 top-0 aspect-[120/167] -translate-x-1/2 max-h-[17vh] w-[10%]"
          style={{
            transform: 'translateY(220%)',
          }}
        >
          {/* Score badge */}
          <div
            className="absolute z-[10] h-full w-full transition-all delay-150 duration-300 will-change-transform"
            style={{ transform: `translate(${66 + 23 * (visibleCardCount - 1)}%, 0%)` }}
          >
            <ScoreBadge cards={hand.cards} result={result} showResult={showResult && index === activeHandIndex} />
          </div>

          {/* Active hand indicator */}
          {playerHands.length > 1 && index === activeHandIndex && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500" />
          )}

          {/* Player cards */}
          <Hand
            hand={hand}
            result={result}
            showResult={showResult}
            hiddenCardIds={animatingCardIds}
          />
        </div>
        );
      })}

        {/* Animating cards - rendered in absolute position during animation */}
        {animatingCards.map((animCard) => {
          const isMoving = animCard.phase === 'moving' || animCard.phase === 'flipping';
          const targetX = isMoving ? animCard.endX : animCard.startX;
          const targetY = isMoving ? animCard.endY : animCard.startY;

          return (
            <div
              key={animCard.cardId}
              className="absolute z-50 aspect-[120/167] max-h-[17vh] w-[10%] pointer-events-none"
              style={{
                left: 0,
                top: 0,
                transform: `translate(calc(${targetX}px - 50%), calc(${targetY}px - 50%))`,
                transition: isMoving ? 'transform 400ms ease-out' : 'none',
              }}
            >
              <Card card={animCard.card} />
            </div>
          );
        })}
      </div>
    </>
  );
});
