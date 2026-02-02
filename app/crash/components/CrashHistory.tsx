'use client';

import { memo } from 'react';
import type { CrashResult } from '../types';

interface CrashHistoryProps {
  results: CrashResult[];
}

// Chart icon button
const ChartButton = () => (
  <button
    type="button"
    className="flex h-[32px] items-center justify-center rounded-8 bg-dark-600 px-[10px] text-dark-200 transition-all hover:bg-dark-500 hover:text-light-000"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 14 15"
      className="size-[14px]"
    >
      <path
        fillRule="evenodd"
        d="M5.286 1.783c0-.63.512-1.142 1.143-1.142h1.143c.63 0 1.142.511 1.142 1.142v11.43c0 .63-.511 1.142-1.142 1.142H6.429a1.143 1.143 0 0 1-1.143-1.143zM.143 8.641c0-.632.512-1.143 1.143-1.143h1.143c.631 0 1.143.511 1.143 1.143v4.571c0 .631-.512 1.143-1.143 1.143H1.286a1.143 1.143 0 0 1-1.143-1.143zm13.714-2.286c0-.631-.511-1.143-1.142-1.143h-1.143c-.631 0-1.143.512-1.143 1.143v6.857c0 .631.511 1.143 1.143 1.143h1.143c.63 0 1.142-.512 1.142-1.143z"
        clipRule="evenodd"
      />
    </svg>
  </button>
);

export const CrashHistory = memo(function CrashHistory({ results }: CrashHistoryProps) {
  return (
    <div className="absolute z-10 flex w-[75%] flex-row-reverse items-center gap-x-16 overflow-hidden self-start">
      <ChartButton />
      {results.slice(0, 15).map((result) => {
        const isGreen = result.crashMultiplier >= 2;
        return (
          <div
            key={result.id}
            className={`flex cursor-pointer flex-col items-center justify-center transition-colors duration-150 ${
              isGreen
                ? 'text-green-600 hover:text-green-500'
                : 'text-dark-300 hover:text-dark-200'
            }`}
          >
            <div className="text-h-xs">{result.crashMultiplier.toFixed(2)}x</div>
          </div>
        );
      })}
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-32 bg-gradient-to-r from-dark-900 to-transparent" />
    </div>
  );
});
