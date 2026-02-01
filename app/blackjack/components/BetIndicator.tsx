'use client';

import { memo } from 'react';
import type { HandResult } from '../types';

interface BetIndicatorProps {
  betAmount: number;
  payout: number;
  result: HandResult;
  showResult: boolean;
  hasStarted?: boolean;
}

export const BetIndicator = memo(function BetIndicator({
  betAmount,
  payout,
  result,
  showResult,
  hasStarted = false,
}: BetIndicatorProps) {
  // Position Y: 94% before playing, 76% when playing/won, 30% when lost
  const isLost = showResult && result === 'lose';
  const topPercent = !hasStarted ? 94 : (isLost ? 30 : 76);

  // Show bet during play, payout when settled
  const displayAmount = showResult ? payout : betAmount;

  // Format amount as currency
  const formattedAmount = displayAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-[9] transition-all duration-300 ease-out"
      style={{ top: `${topPercent}%` }}
    >
      <div className="flex items-center justify-center gap-8 text-nowrap rounded-full p-4 pl-8 text-b-md font-semibold bg-dark-500">
        <span className="inline-flex items-center justify-center gap-4 tabular-nums">
          {/* Bitcoin icon */}
          <div className="flex-shrink-0 size-16">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 22 22" className="h-full w-full">
              <path fill="#f7931a" d="M21.67 13.66a11 11 0 1 1-8-13.33 11 11 0 0 1 8 13.33" />
              <path fill="#fff" d="M15.85 9.43C16.07 8 15 7.18 13.43 6.66l.5-2-1.21-.3-.48 1.94-1-.22.48-1.95-1.2-.3-.5 2c-.26-.06-.52-.11-.77-.18l-1.63-.44L7.3 6.5s.89.21.88.22a.65.65 0 0 1 .56.7l-1.36 5.43a.44.44 0 0 1-.55.29S6 12.92 6 12.92l-.6 1.38 1.57.39.86.23-.5 2 1.21.3.5-2 1 .25-.5 2 1.21.3.5-2c2.06.39 3.61.23 4.26-1.63a2.13 2.13 0 0 0-1.11-2.93 1.92 1.92 0 0 0 1.45-1.78m-2.76 3.87c-.37 1.5-2.89.69-3.71.49l.62-2.66c.86.2 3.48.61 3.09 2.17m.38-3.89c-.34 1.36-2.44.67-3.13.5l.6-2.41c.69.17 2.88.5 2.53 1.91" />
            </svg>
          </div>
          <span>{formattedAmount}</span>
        </span>
        {/* Blue circular icon */}
        <div className="flex-shrink-0 size-[24px] text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 25 24" className="h-full w-full">
            <circle cx="12.499" cy="11.993" r="11.993" fill="#fff" />
            <path d="M12.5 0a11.993 11.993 0 1 0 11.992 11.993A12.006 12.006 0 0 0 12.5 0M4.703 5.503 6.672 7.47a7.34 7.34 0 0 0-1.499 3.6H2.394c.185-2.048.991-3.99 2.31-5.568m-2.31 7.412H5.18a7.34 7.34 0 0 0 1.5 3.6l-1.975 1.968a10.1 10.1 0 0 1-2.31-5.568m9.183 9.183a10.1 10.1 0 0 1-5.568-2.306l1.969-1.969a7.34 7.34 0 0 0 3.599 1.49zm0-17.425a7.34 7.34 0 0 0-3.6 1.499L6.01 4.198a10.1 10.1 0 0 1 5.568-2.307zm11.027 6.397H19.82a7.34 7.34 0 0 0-1.494-3.599l1.969-1.968a10.1 10.1 0 0 1 2.31 5.567m-9.182-9.182c2.047.184 3.99.989 5.567 2.306l-1.968 1.972a7.34 7.34 0 0 0-3.6-1.5zm0 20.21v-2.785a7.34 7.34 0 0 0 3.599-1.493l1.968 1.968a10.1 10.1 0 0 1-5.567 2.31m6.873-3.615-1.969-1.969a7.34 7.34 0 0 0 1.494-3.599h2.784a10.1 10.1 0 0 1-2.31 5.568" />
          </svg>
        </div>
      </div>
    </div>
  );
});
