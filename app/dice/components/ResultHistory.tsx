'use client';

import { memo, useRef, useEffect, useState } from 'react';
import type { DiceResult } from '../types';

interface ResultHistoryProps {
  results: DiceResult[];
}

export const ResultHistory = memo(function ResultHistory({
  results,
}: ResultHistoryProps) {
  // Show 11 results (10 visible + 1 fading out)
  const displayResults = results.slice(0, 11);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const prevLengthRef = useRef(results.length);

  useEffect(() => {
    // Detect when a new result is added
    if (results.length > prevLengthRef.current && results.length > 0) {
      const newId = results[0].id;
      setAnimatingId(newId);

      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setAnimatingId(null);
      }, 300);

      prevLengthRef.current = results.length;
      return () => clearTimeout(timer);
    }
    prevLengthRef.current = results.length;
  }, [results]);

  return (
    <div className="flex flex-row-reverse items-center justify-start gap-[2px] overflow-hidden min-h-[32px]">
      {displayResults.map((result, index) => (
        <div
          key={result.id}
          className={`text-b-md font-semibold transition-opacity duration-300 w-[48px] h-[32px] ${
            result.isWin ? 'text-green-500' : 'text-dark-200'
          } ${animatingId === result.id ? 'dice-result-enter' : ''}`}
          style={{
            opacity: index === 10 ? 0 : 1,
          }}
        >
          {result.value.toFixed(2)}
        </div>
      ))}
    </div>
  );
});
