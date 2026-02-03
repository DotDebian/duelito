'use client';

import { memo, useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface CowSpriteProps {
  position: number;
  isDead: boolean;
  laneWidth: number;
}

export const CowSprite = memo(function CowSprite({ position, isDead, laneWidth }: CowSpriteProps) {
  const [isJumping, setIsJumping] = useState(false);
  const prevPositionRef = useRef(position);

  // Trigger jump animation when position changes forward
  useEffect(() => {
    if (position > prevPositionRef.current && !isDead) {
      setIsJumping(true);
      const timer = setTimeout(() => {
        setIsJumping(false);
      }, 500); // Match animation duration
      return () => clearTimeout(timer);
    }
    prevPositionRef.current = position;
  }, [position, isDead]);

  // Position 0 = on sidewalk (left of road), position 1+ = on lanes
  const leftPosition = position === 0
    ? -70 // Centered on sidewalk edge
    : (position - 1) * laneWidth + laneWidth / 2;

  return (
    <div
      className="absolute bottom-[44.5%] transition-[left] duration-500 ease-out z-20"
      style={{
        left: `${leftPosition}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <div
        className={`relative ${isDead ? 'w-[220px] h-[110px]' : 'w-[140px] h-[70px]'} ${isJumping ? 'animate-cow-jump' : ''}`}
      >
        <Image
          src={isDead ? '/images/games/beef/cow_dead.png' : '/images/games/beef/cow.png'}
          alt="Cow"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
});
