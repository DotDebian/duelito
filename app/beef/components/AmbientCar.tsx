'use client';

import { memo } from 'react';
import Image from 'next/image';

interface AmbientCarProps {
  carType: number;
  lane: number;
  laneWidth: number;
  id: string;
  blocked: boolean;
}

export const AmbientCar = memo(function AmbientCar({
  carType,
  lane,
  laneWidth,
  id,
  blocked,
}: AmbientCarProps) {
  return (
    <div
      key={id}
      className="absolute z-10 pointer-events-none"
      style={{
        left: `${(lane - 1) * laneWidth + laneWidth / 2}px`,
        transform: 'translateX(-50%)',
        animation: blocked ? 'none' : 'ambient-car-down 1s linear forwards',
        top: blocked ? '18%' : undefined,
      }}
    >
      <div className="relative w-[100px] h-[142px]">
        <Image
          src={`/images/games/beef/car-${carType}.png`}
          alt={`Car ${carType}`}
          fill
          className="object-contain"
        />
      </div>

      <style jsx>{`
        @keyframes ambient-car-down {
          0% {
            top: -150px;
          }
          100% {
            top: 100%;
          }
        }
      `}</style>
    </div>
  );
});
