'use client';

import { memo } from 'react';
import { formatHandValue } from '@/lib/blackjack-utils';
import type { Card, HandResult } from '../types';

interface ScoreBadgeProps {
  cards: Card[];
  result?: HandResult;
  showResult?: boolean;
}

export const ScoreBadge = memo(function ScoreBadge({ cards, result, showResult }: ScoreBadgeProps) {
  const value = formatHandValue(cards);

  let bgColor = 'bg-dark-400';
  const textColor = 'text-light-000';

  if (showResult) {
    if (result === 'win' || result === 'blackjack') {
      bgColor = 'bg-green-500';
    } else if (result === 'lose') {
      bgColor = 'bg-red-500';
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
