'use client';

import { memo, useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Manhole, type ManholeState } from './Manhole';
import { CowSprite } from './CowSprite';
import { Car } from './Car';
import { AmbientCar } from './AmbientCar';
import { BeefHistory } from './BeefHistory';
import type { BeefPhase, BeefResult } from '../types';

const CAR_TYPES = [2, 3, 4, 6, 7, 8, 9, 10, 13, 14];

interface AmbientCarData {
  id: string;
  carType: number;
  lane: number;
  spawnTime: number;
  blocked: boolean;
}

interface BeefBoardProps {
  phase: BeefPhase;
  position: number;
  multipliers: number[];
  hitCarType: number | null;
  currentMultiplier: number;
  potentialPayout: number;
  resultHistory: BeefResult[];
  betAmount: number;
  onJump: () => void;
}

// Road dimensions
const LEFT_SIDEWALK_WIDTH = 126;
const RIGHT_SIDEWALK_WIDTH = 525;
const LANE_WIDTH = 120;
const TILE_SIZE = 50;

export const BeefBoard = memo(function BeefBoard({
  phase,
  position,
  multipliers,
  hitCarType,
  currentMultiplier,
  potentialPayout,
  resultHistory,
  betAmount,
  onJump,
}: BeefBoardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPlaying = phase === 'playing' || phase === 'jumping';
  const isDead = phase === 'lost';
  const isIdle = phase === 'idle';

  // Ambient traffic state
  const [ambientCars, setAmbientCars] = useState<AmbientCarData[]>([]);

  // Auto-scroll to current position (or reset to start when position is 0)
  useEffect(() => {
    if (scrollRef.current) {
      if (position === 0) {
        scrollRef.current.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      } else {
        const scrollPosition = Math.max(0, position * LANE_WIDTH - 100);
        scrollRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [position]);

  // When position changes, mark cars as blocked if barrier catches them
  useEffect(() => {
    const now = Date.now();
    setAmbientCars(prev => prev
      .filter(car => car.lane > position - 2) // Remove cars far behind
      .map(car => {
        // Mark as blocked if lane has barrier and car had time to reach it
        if (!car.blocked && car.lane <= position && (now - car.spawnTime) > 300) {
          return { ...car, blocked: true };
        }
        return car;
      })
    );
  }, [position]);

  // Remove cars that completed their animation (not blocked)
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setAmbientCars(prev => prev.filter(car => {
        const age = now - car.spawnTime;
        // Keep if blocked, or if animation not finished (1s)
        return car.blocked || age < 1000;
      }));
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  // Clear all ambient cars when game resets
  useEffect(() => {
    if (position === 0) {
      setAmbientCars([]);
    }
  }, [position]);

  // Spawn ambient cars every ~2 seconds
  useEffect(() => {
    const spawnCar = () => {
      // Spawn on lanes between player + 1 and player + 5
      // Skip death lane (position + 1) when dead
      let minLane = position + 1;
      if (isDead) minLane++;
      const maxLane = Math.min(position + 5, 19);
      if (minLane > maxLane || minLane > 19) return;

      setAmbientCars(prev => {
        // Get lanes that already have a car
        const occupiedLanes = new Set(prev.map(car => car.lane));

        // Find available lanes
        const availableLanes = [];
        for (let l = minLane; l <= maxLane; l++) {
          if (!occupiedLanes.has(l)) {
            availableLanes.push(l);
          }
        }

        // No available lanes, don't spawn
        if (availableLanes.length === 0) return prev;

        const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];

        const newCar: AmbientCarData = {
          id: `ambient-${Date.now()}-${Math.random()}`,
          carType: CAR_TYPES[Math.floor(Math.random() * CAR_TYPES.length)],
          lane,
          spawnTime: Date.now(),
          blocked: false,
        };
        return [...prev, newCar];
      });
    };

    const interval = setInterval(spawnCar, 2000);
    return () => clearInterval(interval);
  }, [position, isDead]);

  const getManholeState = (index: number): ManholeState => {
    if (!isPlaying && !isDead && phase !== 'won') return 'inactive';
    if (index < position) return 'passed';
    if (index === position && !isDead) return 'current';
    if (index === position && isDead) return 'passed';
    if (index === position + 1 && isDead) return 'busted';
    if (index === position + 1 && isPlaying) return 'active';
    return 'inactive';
  };

  // Generate multipliers for display (use API multipliers when available, else show placeholder)
  const displayMultipliers = multipliers?.length > 0
    ? multipliers
    : [1.04, 1.10, 1.17, 1.24, 1.32, 1.42, 1.53, 1.65, 1.80, 1.98, 2.20, 2.48, 2.83, 3.31, 3.97, 4.96, 6.61, 9.92, 19.84];

  return (
    <div className="flex-1 flex flex-col rounded-r-12 bg-[#212342] overflow-hidden relative">
      {/* History */}
      <BeefHistory results={resultHistory} />

      {/* Scrollable game area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-none relative"
      >
        <div className="flex h-full min-w-max">
          {/* Left sidewalk - cow starting position */}
          <div
            className="relative shrink-0 h-full z-10"
            style={{ width: `${LEFT_SIDEWALK_WIDTH}px` }}
          >
            <Image
              src="/images/games/beef/road-left.png"
              alt="Left sidewalk"
              fill
              className="object-cover"
              sizes={`${LEFT_SIDEWALK_WIDTH}px`}
            />
          </div>

          {/* Road with 19 lanes */}
          <div className="flex h-full relative">
            {displayMultipliers.map((multiplier, index) => (
              <div
                key={index}
                className="relative h-full flex flex-col items-center justify-center"
                style={{ width: `${LANE_WIDTH}px` }}
              >
                {/* Lane separator (dashed line) */}
                {index > 0 && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[2px]"
                    style={{
                      background: 'repeating-linear-gradient(to bottom, rgb(66, 69, 99) 0px, rgb(66, 69, 99) 20px, transparent 20px, transparent 40px)',
                    }}
                  />
                )}

                {/* Manhole tile */}
                <Manhole
                  position={index + 1}
                  state={getManholeState(index + 1)}
                  multiplier={multiplier}
                  betAmount={betAmount}
                  onClick={getManholeState(index + 1) === 'active' ? onJump : undefined}
                  showBarrier={index + 1 <= position}
                />
              </div>
            ))}

            {/* Cow sprite */}
            <CowSprite
              position={isDead ? position + 1 : position}
              isDead={isDead}
              laneWidth={LANE_WIDTH}
            />

            {/* Car animation on death */}
            {isDead && hitCarType && (
              <Car
                carType={hitCarType}
                position={position + 1}
                isActive={true}
                direction="down"
                laneWidth={LANE_WIDTH}
              />
            )}

            {/* Ambient traffic */}
            {ambientCars.map(car => (
              <AmbientCar
                key={car.id}
                id={car.id}
                carType={car.carType}
                lane={car.lane}
                laneWidth={LANE_WIDTH}
                blocked={car.blocked}
              />
            ))}
          </div>

          {/* Right sidewalk */}
          <div
            className="relative shrink-0 h-full z-10"
            style={{ width: `${RIGHT_SIDEWALK_WIDTH}px` }}
          >
            <Image
              src="/images/games/beef/road-right.png"
              alt="Right sidewalk"
              fill
              className="object-cover"
              sizes={`${RIGHT_SIDEWALK_WIDTH}px`}
            />
          </div>
        </div>
      </div>

      {/* Cashout popup */}
      {phase === 'won' && (
        <div className="absolute left-1/2 top-1/2 z-50 min-w-[142px] -translate-x-1/2 -translate-y-1/2 rounded-8 border-2 border-green-600 bg-green-600 text-center pointer-events-none">
          <h3 className="px-16 pb-8 pt-[12px] text-h-lg text-dark-900">
            x{currentMultiplier.toFixed(2)}
          </h3>
          <div className="rounded-b-8 bg-dark-900 p-8">
            <span className="inline-flex items-center justify-center gap-4 tabular-nums">
              <div className="size-16 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 2000 2000" className="h-full w-full">
                  <path fill="#2775ca" d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000"></path>
                  <path fill="#fff" d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84"></path>
                  <path fill="#fff" d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5m441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67"></path>
                </svg>
              </div>
              <span className="text-light-000 font-semibold">${potentialPayout.toFixed(2)}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
