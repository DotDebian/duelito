'use client';

import { memo, useState, useEffect, useRef } from 'react';

interface ResultTooltipProps {
  result: number | null;
  isWin: boolean;
  resultCount: number; // Increments each time there's a new result
}

export const ResultTooltip = memo(function ResultTooltip({
  result,
  isWin,
  resultCount,
}: ResultTooltipProps) {
  const [position, setPosition] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const prevCount = useRef(0);

  useEffect(() => {
    if (result === null) return;

    // New result detected
    if (resultCount !== prevCount.current) {
      const isFirst = prevCount.current === 0;
      prevCount.current = resultCount;

      if (isFirst) {
        // First result: start from left with fade in
        setPosition(0);
        setOpacity(0);

        const timer = setTimeout(() => {
          setPosition(result);
          setOpacity(1);
        }, 50);

        return () => clearTimeout(timer);
      } else {
        // Subsequent results: just animate position
        setPosition(result);
      }
    }
  }, [result, resultCount]);

  if (result === null) return null;

  return (
    <div
      className="absolute -top-[48px] transition-all duration-500 ease-out"
      style={{
        left: `${position}%`,
        transform: 'translateX(-50%)',
        opacity,
      }}
    >
      {/* Tooltip body */}
      <div
        className={`relative px-[10px] py-[4px] text-b-md font-semibold text-light-000 ${
          isWin ? 'bg-green-500' : 'bg-red-500'
        }`}
        style={{ borderRadius: '4px' }}
      >
        {result.toFixed(2)}
        {/* Arrow pointing down */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent ${
            isWin ? 'border-t-green-500' : 'border-t-red-500'
          }`}
        />
      </div>
    </div>
  );
});
