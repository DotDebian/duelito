'use client';

import { memo } from 'react';
import Image from 'next/image';

interface CarProps {
  carType: number;
  position: number;
  isActive: boolean;
  direction?: 'up' | 'down';
  laneWidth: number;
}

export const Car = memo(function Car({
  carType,
  position,
  isActive,
  direction = 'down',
  laneWidth,
}: CarProps) {
  if (!isActive) return null;

  return (
    <div
      className="absolute z-30"
      style={{
        left: `${(position - 1) * laneWidth + laneWidth / 2}px`,
        transform: 'translateX(-50%)',
        animation: isActive
          ? `car-${direction} 1s linear forwards`
          : undefined,
      }}
    >
      <div className="relative w-[80px] h-[140px]">
        <Image
          src={`/images/games/beef/car-${carType}.png`}
          alt={`Car ${carType}`}
          fill
          className="object-contain"
        />
      </div>

      <style jsx>{`
        @keyframes car-down {
          0% {
            top: -200px;
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            top: calc(100% + 200px);
            opacity: 0;
          }
        }
        @keyframes car-up {
          0% {
            bottom: -200px;
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            bottom: calc(100% + 200px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});
