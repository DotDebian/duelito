'use client';

import { memo, useRef, useCallback, useState, useEffect } from 'react';
import type { RollMode } from '../types';

interface DiceSliderProps {
  rollOver: number;
  rollMode: RollMode;
  onChange: (value: number) => void;
  onInteractionStart?: () => void;
  disabled?: boolean;
}

const MIN_VALUE = 2;
const MAX_VALUE = 99.98;

export const DiceSlider = memo(function DiceSlider({
  rollOver,
  rollMode,
  onChange,
  onInteractionStart,
  disabled = false,
}: DiceSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate position percentage (0-100)
  const position = ((rollOver - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;

  const handleMove = useCallback((clientX: number) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const value = MIN_VALUE + (percentage / 100) * (MAX_VALUE - MIN_VALUE);
    onChange(value);
  }, [onChange, disabled]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    onInteractionStart?.();
    handleMove(e.clientX);
  }, [handleMove, disabled, onInteractionStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    onInteractionStart?.();
    handleMove(e.touches[0].clientX);
  }, [handleMove, disabled, onInteractionStart]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove]);

  // Determine which side is red/green based on roll mode
  const isOverMode = rollMode === 'over';

  // Show tooltip when hovering or dragging
  const showTooltip = isHovered || isDragging;

  return (
    <div className="relative w-full select-none">
      {/* Slider track */}
      <div
        ref={sliderRef}
        className={`relative h-[22px] w-full rounded-full overflow-hidden ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Red zone (lose) */}
        <div
          className="absolute top-0 h-full bg-red-500"
          style={{
            left: isOverMode ? '0%' : `${position}%`,
            width: isOverMode ? `${position}%` : `${100 - position}%`,
          }}
        />
        {/* Green zone (win) */}
        <div
          className="absolute top-0 h-full bg-green-600"
          style={{
            left: isOverMode ? `${position}%` : '0%',
            width: isOverMode ? `${100 - position}%` : `${position}%`,
          }}
        />
      </div>

      {/* Markers */}
      <div className="absolute top-0 left-0 w-full h-[12px] pointer-events-none">
        {/* 0 marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-dark-800"
          style={{ left: '2%', top: '125%', transform: 'translate(-50%, -50%)' }}
        />
        {/* 26 marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-dark-800"
          style={{ left: '24%', top: '125%', transform: 'translate(-50%, -50%)' }}
        />
        {/* 50 marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-dark-800"
          style={{ left: '50%', top: '125%',transform: 'translate(-50%, -50%)' }}
        />
        {/* 75 marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-dark-800"
          style={{ left: '75%', top: '125%', transform: 'translate(-50%, -50%)' }}
        />
        {/* 100 marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-dark-800"
          style={{ left: '98%', top: '125%',transform: 'translate(-50%, -50%)' }}
        />
      </div>

      {/* Cursor container */}
      <div
        tabIndex={0}
        className="outline-none absolute top-1/2"
        style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Draggable cursor */}
        <div
          className={`z-10 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-light-000 ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {/* Duel swords icon */}
          <div className="flex shrink-0 items-center justify-center size-[18px] text-dark-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 18"
              className="h-full w-full"
            >
              <g clipPath="url(#icon-duel-swords)">
                <path d="M17.544.323a.55.55 0 0 0-.49-.149L14.66.653a1.64 1.64 0 0 0-.832.445L2.968 12.196l2.937 2.584L16.77 4.044c.228-.228.384-.516.445-.832l.479-2.4a.55.55 0 0 0-.15-.489M2.102 10.653l-.544.543a.54.54 0 0 0-.112.605l.934 2.107-1.909 1.909a.546.546 0 0 0 0 .768l.816.815c.21.211.557.211.767 0l1.91-1.91 2.105.935a.54.54 0 0 0 .605-.112l.543-.543a.546.546 0 0 0 0-.768l-4.348-4.35a.545.545 0 0 0-.767 0m12.34.703L12.72 9.633l-2.942 2.943 1.723 1.722-.703.704a.546.546 0 0 0 0 .768l.543.543c.16.16.4.204.605.112l2.106-.934 1.909 1.91c.21.21.557.21.767 0l.816-.816a.546.546 0 0 0 0-.768l-1.91-1.91.935-2.106a.54.54 0 0 0-.112-.605l-.544-.543a.545.545 0 0 0-.768 0zM1.246 4.044l4.049 4.05 2.941-2.942-4.045-4.054a1.6 1.6 0 0 0-.832-.445L.96.174a.55.55 0 0 0-.492.15.55.55 0 0 0-.15.492l.483 2.392c.064.316.217.605.445.833z" />
              </g>
              <defs>
                <clipPath id="icon-duel-swords">
                  <path d="M.309.164h17.394v17.394H.309z" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>

        {/* Position tooltip */}
        <span
          className={`absolute z-10 min-w-[37px] bg-light-000 px-[8px] py-4 text-center text-b-md font-bold text-dark-900 transition-opacity duration-300 ${
            showTooltip ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ left: '50%', transform: 'translate(-50%, -50%)', top: '-50%', borderRadius: '4px' }}
        >
          {Math.round(rollOver)}
          {/* Arrow */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
            <div className="h-8 w-8 rotate-45 bg-light-000" />
          </div>
        </span>
      </div>
    </div>
  );
});
