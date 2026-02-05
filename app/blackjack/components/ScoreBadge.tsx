'use client';

import { memo } from 'react';
import { formatHandValue } from '@/lib/blackjack-utils';
import type { Card, HandResult } from '../types';

interface ScoreBadgeProps {
  cards: Card[];
  result?: HandResult;
  showResult?: boolean;
  isDealer?: boolean;
  isActive?: boolean;
  isBusted?: boolean;
}

export const ScoreBadge = memo(function ScoreBadge({ cards, result, showResult, isDealer = false, isActive = false, isBusted = false }: ScoreBadgeProps) {
  const value = formatHandValue(cards);

  let bgColor = 'bg-dark-400';
  let textColor = 'text-light-000';

  // Busted hand immediately shows red (even before game ends)
  if (isBusted && !isDealer) {
    bgColor = 'bg-red-500';
    textColor = 'text-dark-900';
  }
  // Active split hand gets blue background
  else if (isActive && !showResult) {
    bgColor = 'bg-blue-500';
    textColor = 'text-light-000';
  }
  // Only player badge changes color on result
  else if (showResult && !isDealer) {
    if (result === 'win' || result === 'blackjack') {
      bgColor = 'bg-green-500';
      textColor = 'text-dark-900';
    } else if (result === 'lose') {
      bgColor = 'bg-red-500';
      textColor = 'text-dark-900';
    } else if (result === 'push') {
      bgColor = 'bg-yellow-500';
      textColor = 'text-dark-900';
    }
  }

  return (
    <div
      className={`flex h-32 max-w-[54px] items-center justify-center text-nowrap rounded-full px-16 text-b-md font-semibold ${bgColor} ${textColor}`}
    >
      {showResult && result === 'blackjack' ? 'BJ' : value}
    </div>
  );
});
