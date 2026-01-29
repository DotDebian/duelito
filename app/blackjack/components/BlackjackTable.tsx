'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { Hand as HandType, HandResult } from '../types';
import { Hand } from './Hand';
import { ScoreBadge } from './ScoreBadge';
import {CardBack} from "@/app/blackjack/components/CardBack";

interface BlackjackTableProps {
  dealerHand: HandType | null;
  playerHands: HandType[];
  activeHandIndex: number;
  result: HandResult;
  showResult: boolean;
}

export const BlackjackTable = memo(function BlackjackTable({
  dealerHand,
  playerHands,
  activeHandIndex,
  result,
  showResult,
}: BlackjackTableProps) {
  return (
    <>
      {/* Table background */}
      <div className="absolute left-1/2 top-0 flex h-[75vh] w-full -translate-x-1/2 items-start justify-center">
        <Image
          src="/images/card-table.png"
          alt="Blackjack table"
          width={1600}
          height={1200}
          className="h-full w-auto object-contain object-top"
          draggable={false}
          priority
          unoptimized
        />
      </div>

      {/* Top gradient overlay */}
      <div className="absolute top-0 z-10 h-32 w-full -translate-y-32 bg-dark-800" />

      {/* Deck pile (dealer's cards to draw from) */}
      <div className="relative flex rounded-8 absolute left-1/2 top-0 aspect-[120/167] translate-x-[170%] translate-y-[-50%] max-h-[17vh] w-[10%]">
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
      {dealerHand && (
        <div className="transition-opacity delay-150 duration-300 absolute left-1/2 top-8 aspect-[120/167] -translate-x-1/2 translate-y-[15%] max-h-[17vh] w-[10%]">
          {/* Score badge */}
          <div
            className="absolute z-[10] h-full w-full transition-all delay-150 duration-300 will-change-transform"
            style={{ transform: 'translate(-125%, 155%)' }}
          >
            <ScoreBadge cards={dealerHand.cards} result={result === 'win' || result === 'blackjack' ? 'lose' : result === 'lose' ? 'win' : result} showResult={showResult} />
          </div>

          {/* Dealer cards */}
          <Hand hand={dealerHand} isDealer result={result === 'win' || result === 'blackjack' ? 'lose' : result === 'lose' ? 'win' : result} showResult={showResult} />
        </div>
      )}

      {/* Player hand(s) area */}
      {playerHands.map((hand, index) => (
        <div
          key={index}
          className="transition-opacity delay-150 duration-300 absolute left-1/2 top-0 aspect-[120/167] -translate-x-1/2 max-h-[17vh] w-[10%]"
          style={{
            transform: playerHands.length > 1
              ? `translateX(${-50 + (index - (playerHands.length - 1) / 2) * 120}%) translateY(235%)`
              : 'translateX(-50%) translateY(280%)',
          }}
        >
          {/* Score badge */}
          <div
            className="absolute z-[10] h-full w-full transition-all delay-150 duration-300 will-change-transform"
            style={{ transform: 'translate(-125%, 0%)' }}
          >
            <ScoreBadge cards={hand.cards} result={result} showResult={showResult && index === activeHandIndex} />
          </div>

          {/* Active hand indicator */}
          {playerHands.length > 1 && index === activeHandIndex && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500" />
          )}

          {/* Player cards */}
          <Hand hand={hand} result={result} showResult={showResult} />
        </div>
      ))}
    </>
  );
});
