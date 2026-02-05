'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { Hand as HandType, HandResult, CardAnimationState } from '../types';
import { Hand } from './Hand';
import { ScoreBadge } from './ScoreBadge';
import { BetIndicator } from './BetIndicator';
import { InsuranceIndicator } from './InsuranceIndicator';
import { CardBack } from "@/app/blackjack/components/CardBack";
import { Card } from './Card';

interface BlackjackTableProps {
  dealerHand: HandType | null;
  playerHands: HandType[];
  activeHandIndex: number;
  result: HandResult;
  resultsPerHand: HandResult[];
  showResult: boolean;
  betAmount: number;
  payout: number;
  insuranceBet: number | null;
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
  resultsPerHand,
  showResult,
  betAmount,
  payout,
  insuranceBet,
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
          {/* Score badge - follows visible cards with smooth transition */}
          <div
            className="absolute z-[60] h-full w-full will-change-transform"
            style={{
              transform: `translate(${73 + 33 * Math.max(0, visibleCardCount - 1)}%, 85%)`,
              opacity: visibleCardCount > 0 ? 1 : 0,
              transition: `transform 300ms ease-out, opacity 100ms ease-out ${visibleCardCount > 0 ? '50ms' : '0ms'}`,
            }}
          >
            <ScoreBadge cards={dealerHand.cards} result={result === 'win' || result === 'blackjack' ? 'lose' : result === 'lose' ? 'win' : result} showResult={showResult} isDealer />
          </div>

          {/* Insurance bet indicator - positioned to the left of dealer */}
          <InsuranceIndicator
            insuranceBet={insuranceBet ?? 0}
            isVisible={insuranceBet !== null && insuranceBet > 0}
          />

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
        const isSplit = playerHands.length > 1;
        const isActive = index === activeHandIndex;
        // Use per-hand result for split, fallback to global result for single hand
        const handResult = isSplit ? (resultsPerHand[index] ?? result) : result;

        // Calculate horizontal position for split hands
        // Single hand: center (50%)
        // Split: left hand at 35%, right hand at 65%
        const horizontalOffset = isSplit
          ? (index === 0 ? -155 : 155) // pixels offset from center
          : 0;

        return (
        <div
          key={index}
          ref={index === 0 ? playerRef : undefined}
          className="transition-all duration-300 ease-out absolute left-1/2 top-0 aspect-[120/167] max-h-[17vh] w-[10%]"
          style={{
            transform: `translateX(calc(-50% + ${horizontalOffset}px)) translateY(220%)`,
            opacity: isSplit && !isActive && !showResult ? 0.5 : 1,
          }}
        >
          {/* Score badge - follows visible cards with smooth transition */}
          <div
            className="absolute z-[60] h-full w-full will-change-transform"
            style={{
              transform: `translate(${67 + 23 * Math.max(0, visibleCardCount - 1)}%, 0%)`,
              opacity: visibleCardCount > 0 ? 1 : 0,
              transition: `transform 300ms ease-out, opacity 100ms ease-out ${visibleCardCount > 0 ? '50ms' : '0ms'}`,
            }}
          >
            <ScoreBadge cards={hand.cards} result={handResult} showResult={showResult} isActive={isSplit && isActive} isBusted={hand.isBusted} />
          </div>

          {/* Player cards */}
          <Hand
            hand={hand}
            result={handResult}
            showResult={showResult}
            isActive={isActive}
            isSplit={isSplit}
            hiddenCardIds={animatingCardIds}
          />

          {/* Individual bet indicator for each hand */}
          {isSplit && (
            <div
              className="absolute left-1/2 -translate-x-1/2 z-[9] transition-all duration-300 ease-out"
              style={{
                top: hand.isBusted ? '-50%' : '115%',
                opacity: !isActive && !showResult && !hand.isBusted ? 0.5 : 1,
              }}
            >
              <div className="flex items-center justify-center gap-8 text-nowrap rounded-full p-4 pl-8 text-b-md font-semibold bg-dark-500">
                <span className="inline-flex items-center justify-center gap-4 tabular-nums">
                  <div className="flex-shrink-0 size-16">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 22 22" className="h-full w-full">
                      <path fill="#f7931a" d="M21.67 13.66a11 11 0 1 1-8-13.33 11 11 0 0 1 8 13.33" />
                      <path fill="#fff" d="M15.85 9.43C16.07 8 15 7.18 13.43 6.66l.5-2-1.21-.3-.48 1.94-1-.22.48-1.95-1.2-.3-.5 2c-.26-.06-.52-.11-.77-.18l-1.63-.44L7.3 6.5s.89.21.88.22a.65.65 0 0 1 .56.7l-1.36 5.43a.44.44 0 0 1-.55.29S6 12.92 6 12.92l-.6 1.38 1.57.39.86.23-.5 2 1.21.3.5-2 1 .25-.5 2 1.21.3.5-2c2.06.39 3.61.23 4.26-1.63a2.13 2.13 0 0 0-1.11-2.93 1.92 1.92 0 0 0 1.45-1.78m-2.76 3.87c-.37 1.5-2.89.69-3.71.49l.62-2.66c.86.2 3.48.61 3.09 2.17m.38-3.89c-.34 1.36-2.44.67-3.13.5l.6-2.41c.69.17 2.88.5 2.53 1.91" />
                    </svg>
                  </div>
                  <span>{hand.bet.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </span>
                <div className="flex-shrink-0 size-[24px] text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 25 24" className="h-full w-full">
                    <circle cx="12.499" cy="11.993" r="11.993" fill="#fff" />
                    <path d="M12.5 0a11.993 11.993 0 1 0 11.992 11.993A12.006 12.006 0 0 0 12.5 0M4.703 5.503 6.672 7.47a7.34 7.34 0 0 0-1.499 3.6H2.394c.185-2.048.991-3.99 2.31-5.568m-2.31 7.412H5.18a7.34 7.34 0 0 0 1.5 3.6l-1.975 1.968a10.1 10.1 0 0 1-2.31-5.568m9.183 9.183a10.1 10.1 0 0 1-5.568-2.306l1.969-1.969a7.34 7.34 0 0 0 3.599 1.49zm0-17.425a7.34 7.34 0 0 0-3.6 1.499L6.01 4.198a10.1 10.1 0 0 1 5.568-2.307zm11.027 6.397H19.82a7.34 7.34 0 0 0-1.494-3.599l1.969-1.968a10.1 10.1 0 0 1 2.31 5.567m-9.182-9.182c2.047.184 3.99.989 5.567 2.306l-1.968 1.972a7.34 7.34 0 0 0-3.6-1.5zm0 20.21v-2.785a7.34 7.34 0 0 0 3.599-1.493l1.968 1.968a10.1 10.1 0 0 1-5.567 2.31m6.873-3.615-1.969-1.969a7.34 7.34 0 0 0 1.494-3.599h2.784a10.1 10.1 0 0 1-2.31 5.568" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })}

        {/* Animating cards - rendered in absolute position during animation */}
        {animatingCards.map((animCard) => {
          const isMoving = animCard.phase === 'moving' || animCard.phase === 'flipping';
          const targetX = isMoving ? animCard.endX : animCard.startX;
          const targetY = isMoving ? animCard.endY : animCard.startY;

          // Calculate rotation for player cards based on final hand size
          const totalCards = playerHands[0]?.cards.length ?? 1;
          const rotation = animCard.targetHand === 'player'
            ? (animCard.targetIndex - (totalCards - 1) / 2) * 8
            : 0;
          // Entry: start at 0, animate to rotation. Exit: start at rotation, animate to 0
          const targetRotation = animCard.isExit
            ? (isMoving ? 0 : rotation)
            : (isMoving ? rotation : 0);

          return (
            <div
              key={animCard.cardId}
              className="absolute z-50 aspect-[120/167] max-h-[17vh] w-[10%] pointer-events-none"
              style={{
                left: 0,
                top: 0,
                transform: `translate(calc(${targetX}px - 50%), calc(${targetY}px - 50%)) rotate(${targetRotation}deg)`,
                transition: isMoving ? 'transform 400ms ease-out' : 'none',
              }}
            >
              <Card card={animCard.card} flipDirection={animCard.targetHand === 'dealer' ? 'horizontal' : 'vertical'} />
            </div>
          );
        })}

        {/* Player bet indicator - only show for single hand (not split) */}
        {playerHands.length <= 1 && (
          <BetIndicator
            betAmount={betAmount}
            payout={payout}
            result={result}
            showResult={showResult}
            hasStarted={(playerHands[0]?.cards.length ?? 0) > 0}
          />
        )}
      </div>
    </>
  );
});
