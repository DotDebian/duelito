'use client';

import { memo } from 'react';
import type { MinesResult } from '../types';

interface ResultHistoryProps {
  results: MinesResult[];
}

export const ResultHistory = memo(function ResultHistory({
  results,
}: ResultHistoryProps) {
  // Afficher les 10 derniers résultats, le plus récent en premier
  const displayResults = results.slice(-10).reverse();

  // Toujours rendre le container avec une hauteur fixe pour éviter les décalages de layout
  return (
    <div className="h-[24px] xl:h-32 flex items-center gap-2 justify-end">
      {displayResults.map((result, index) => {
        const isLatest = index === 0;
        const isWin = result.isWin && result.payout > 0;

        return (
          <div
            key={result.id}
            className={`
              rounded-[6px] px-4
              min-w-[48px] h-full
              flex items-center justify-center
              font-semibold text-b-md
              cursor-pointer
              transition-opacity
              ${isWin ? 'text-green-500' : 'text-dark-200'}
              ${!isLatest ? 'opacity-60' : ''}
            `}
            title={`${result.multiplier.toFixed(2)}x - ${result.payout.toFixed(2)}`}
          >
            {isWin ? result.multiplier.toFixed(2) : '0.00'}
          </div>
        );
      })}
    </div>
  );
});
