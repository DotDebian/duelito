'use client';

import { memo } from 'react';
import type { DropResult } from '../types';

interface PlinkoResultHistoryProps {
  results: DropResult[];
}

function formatMultiplier(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  if (value >= 100) {
    return `${value}`;
  }
  return `${value}x`;
}

export const PlinkoResultHistory = memo(function PlinkoResultHistory({
  results,
}: PlinkoResultHistoryProps) {
  return (
    <div className="flex w-full items-center justify-end">
      <div className="mr-2 mt-2 xxl:mr-4 xxl:mt-1">
        <div className="relative flex flex-row-reverse h-32 gap-[2px]">
          {results.map((result) => (
            <div
              key={result.id}
              className={`plinko-result-item rounded-[6px] px-4 text-b-md flex w-[48px] cursor-pointer items-center justify-center font-semibold hover:brightness-110 h-32 ${result.exiting ? 'plinko-result-exiting' : ''}`}
              style={{
                backgroundColor: result.color,
                color: 'rgb(26, 26, 26)',
              }}
            >
              {formatMultiplier(result.multiplier)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
