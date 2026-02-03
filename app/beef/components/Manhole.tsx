'use client';

import { memo, useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export type ManholeState = 'inactive' | 'active' | 'passed' | 'current' | 'busted';

interface ManholeProps {
  position: number;
  state: ManholeState;
  multiplier: number;
  betAmount: number;
  onClick?: () => void;
  showBarrier?: boolean;
}

export const Manhole = memo(function Manhole({
  position,
  state,
  multiplier,
  betAmount,
  onClick,
  showBarrier = false,
}: ManholeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showGold, setShowGold] = useState(false);
  const prevStateRef = useRef(state);

  const isClickable = state === 'active';
  const isPassed = state === 'passed';
  const isCurrent = state === 'current';
  const isBusted = state === 'busted';
  const isGoldState = isPassed || isCurrent;

  // Trigger flip animation when transitioning to gold state
  useEffect(() => {
    const wasGold = prevStateRef.current === 'passed' || prevStateRef.current === 'current';
    const isNowGold = isGoldState;

    if (!wasGold && isNowGold) {
      // Start flip animation
      setIsFlipping(true);
      // Switch to gold tile at midpoint of animation
      setTimeout(() => {
        setShowGold(true);
      }, 150); // Half of the 300ms animation
      // End animation
      setTimeout(() => {
        setIsFlipping(false);
      }, 300);
    } else if (wasGold && !isNowGold) {
      // Reset without animation (game reset)
      setShowGold(false);
    } else if (isNowGold && !showGold) {
      // Initial render with gold state (no animation)
      setShowGold(true);
    }

    prevStateRef.current = state;
  }, [state, isGoldState, showGold]);

  // Calculate win chance based on position (inverse of hit probability)
  // Hit probability: 5% at position 1, 95% at position 19
  const winChance = Math.round(95 - ((position - 1) / 18) * 90);
  const profitOnWin = betAmount * multiplier;

  return (
    <div className="flex flex-col items-center relative">
      {/* Barrier above tile - always present for layout, opacity controls visibility */}
      <Image
        src="/images/games/beef/barrier.png"
        alt="Barrier"
        width={80}
        height={60}
        className={`pointer-events-none mb-8 h-[40px] w-[60px] select-none md:h-[60px] md:w-[80px] transition-opacity duration-300 ${
          showBarrier ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Manhole tile with 3D flip */}
      <div className="[perspective:500px]">
        <button
          type="button"
          onClick={onClick}
          disabled={!isClickable}
          className={`relative w-[77px] h-[77px] transition-all duration-200 [transform-style:preserve-3d] ${
            isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          } ${isFlipping ? 'animate-flip-tile' : ''}`}
          style={{
            transform: isFlipping ? undefined : (showGold ? 'rotateY(180deg)' : 'rotateY(0deg)'),
            transition: isFlipping ? undefined : 'transform 0s',
          }}
        >
          {/* Front face - normal tile */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <Image
              src="/images/games/beef/manhole_tile.png"
              alt={`Tile ${position}`}
              fill
              className="object-contain"
            />
          </div>
          {/* Back face - gold tile */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Image
              src="/images/games/beef/manhole_gold_tile.png"
              alt={`Tile ${position} gold`}
              fill
              className="object-contain"
            />
          </div>
        </button>
      </div>

      {/* Multiplier badge with tooltip - below tile */}
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div
          className={`mt-[12px] min-w-[86px] cursor-help select-none rounded-full px-[26px] py-[6px] text-center text-h-xs font-semibold ${
            isBusted
              ? 'bg-red-600 text-light-000'
              : isCurrent
              ? 'bg-blue-600 text-light-000'
              : 'bg-cross-road-dark-1 text-light-200'
          }`}
        >
          {multiplier.toFixed(2)}x
        </div>

        {/* Tooltip - below the badge */}
        {showTooltip && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50">
            {/* Tooltip arrow pointing up */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-[6px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-dark-700"></div>
            <div className="bg-dark-700 rounded-8 p-12 shadow-lg border border-dark-500">
              <div className="flex min-w-[200px] items-center justify-between text-xs">
                <div className="flex flex-col gap-8">
                  <span className="text-dark-200">Profit on Win</span>
                  <span className="inline-flex items-center gap-4 tabular-nums font-bold text-light-000">
                    <div className="size-16 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 2000 2000" className="h-full w-full">
                        <path fill="#2775ca" d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000"></path>
                        <path fill="#fff" d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84"></path>
                        <path fill="#fff" d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5m441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67"></path>
                      </svg>
                    </div>
                    <span>${profitOnWin.toFixed(2)}</span>
                  </span>
                </div>
                <div className="flex flex-col gap-8 text-right">
                  <span className="text-dark-200">Win Chance</span>
                  <span className="font-bold text-light-000">{winChance}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
