'use client';

import { memo } from 'react';
import type { BeefResult } from '../types';

interface BeefHistoryProps {
  results: BeefResult[];
}

export const BeefHistory = memo(function BeefHistory({ results }: BeefHistoryProps) {
  return (
    <div className="absolute right-0 top-0 z-50 rounded-8 p-8">
      <div className="relative flex h-[24px] items-center gap-2 xl:h-32">
        {results.slice(0, 10).map((result) => (
          <div
            key={result.id}
            className={`rounded-[6px] px-4 text-b-md flex h-full min-w-[48px] cursor-pointer items-center justify-center font-semibold transition-all duration-300 hover:bg-dark-700 ${
              result.isWin
                ? 'text-green-500 bg-green-800'
                : 'text-light-000 bg-dark-500'
            }`}
          >
            {result.isWin ? result.multiplier.toFixed(2) : '0.00'}
          </div>
        ))}
      </div>
    </div>
  );
});
