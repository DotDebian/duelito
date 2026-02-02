'use client';

import { memo } from 'react';
import { BetAmountInput, ActionButton } from '@/app/components/betting';
import type { GamePhase, HandResult } from '../types';

interface BlackjackBettingSidebarProps {
  betAmount: string;
  onBetAmountChange: (amount: string) => void;
  onDeal: () => void;
  onNewGame: () => void;
  phase: GamePhase;
  isLoading: boolean;
  result: HandResult;
  payout: number;
  balance: number;
}

export const BlackjackBettingSidebar = memo(function BlackjackBettingSidebar({
  betAmount,
  onBetAmountChange,
  onDeal,
  onNewGame,
  phase,
  isLoading,
  result,
  payout,
  balance,
}: BlackjackBettingSidebarProps) {
  const isBetting = phase === 'betting';
  const isSettled = phase === 'settled';

  const getResultText = () => {
    if (!result) return '';
    switch (result) {
      case 'blackjack':
        return 'Blackjack!';
      case 'win':
        return 'You Win!';
      case 'lose':
        return 'You Lose';
      case 'push':
        return 'Push';
      default:
        return '';
    }
  };

  const getResultColor = () => {
    if (!result) return '';
    switch (result) {
      case 'blackjack':
      case 'win':
        return 'text-green-500';
      case 'lose':
        return 'text-red-500';
      case 'push':
        return 'text-yellow-500';
      default:
        return '';
    }
  };

  return (
    <div className="flex w-[380px] shrink-0 flex-col overflow-y-auto rounded-12 rounded-r-none bg-dark-700 p-32 scrollbar-none">
      {/* Balance display */}
      <div className="mb-16 flex items-center justify-between text-b-md text-dark-200">
        <span>Balance</span>
        <span className="font-semibold text-light-000">${balance.toFixed(2)}</span>
      </div>

      <div className="mt-[22px]">
        <BetAmountInput
          value={betAmount}
          onChange={onBetAmountChange}
          disabled={!isBetting || isLoading}
        />
      </div>

      {/* Result display */}
      {isSettled && result && (
        <div className="mb-16 flex flex-col items-center gap-8 rounded-8 bg-dark-600 p-16">
          <span className={`text-h-lg font-bold ${getResultColor()}`}>
            {getResultText()}
          </span>
          {payout > 0 && (
            <span className="text-b-md text-green-500">
              +${payout.toFixed(2)}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-y-16">
        {isBetting ? (
          <ActionButton onClick={onDeal} isLoading={isLoading} disabled={isLoading}>
            Deal
          </ActionButton>
        ) : isSettled ? (
          <ActionButton onClick={onNewGame} disabled={isLoading}>
            New Game
          </ActionButton>
        ) : (
          <div className="flex h-[48px] w-full items-center justify-center rounded-8 bg-dark-600 text-b-lg font-semibold text-dark-200">
            Playing...
          </div>
        )}
      </div>
    </div>
  );
});
