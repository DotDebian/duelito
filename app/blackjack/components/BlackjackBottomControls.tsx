'use client';

import { memo, useState } from 'react';
import { BetAmountInput, ActionButton } from '@/app/components/betting';
import type { GamePhase, HandResult } from '../types';
import { BlackjackControls } from './BlackjackControls';
import { InsuranceModal } from './InsuranceModal';
import { ZeroEdgeBadge } from '@/app/components/ZeroEdgeModal';
import { ProvablyFairBadge } from '@/app/components/ProvablyFairModal';

interface BlackjackBottomControlsProps {
  phase: GamePhase;
  betAmount: string;
  onBetAmountChange: (amount: string) => void;
  onDeal: () => void;
  onNewGame: () => void;
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onSplit: () => void;
  onAcceptInsurance: () => void;
  onDeclineInsurance: () => void;
  canHit: boolean;
  canStand: boolean;
  canDouble: boolean;
  canSplit: boolean;
  isLoading: boolean;
  result: HandResult;
  payout: number;
}

const RulesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
    <g clipPath="url(#icon-duel-document_svg__a)">
      <path fillRule="evenodd" d="M10.208 11.125V3.064c0-.488.13-.988.34-1.305a.573.573 0 1 1 .954.636c-.02.03-.06.11-.094.24a1.7 1.7 0 0 0-.054.43V4.25H12.5a.917.917 0 0 0 .917-.917v-.687A2.063 2.063 0 0 0 11.354.583H4.708a2.29 2.29 0 0 0-2.291 2.292v8.25A1.375 1.375 0 0 1 1.042 12.5a.458.458 0 1 0 0 .917h6.875a2.29 2.29 0 0 0 2.291-2.292M5.33 3.792c0-.317.257-.573.573-.573h1.776a.573.573 0 1 1 0 1.146H5.902a.573.573 0 0 1-.573-.573m-.611 2.177a.573.573 0 1 0 0 1.146h2.96a.573.573 0 1 0 0-1.146zm-.573 3.323c0-.317.257-.573.573-.573h2.96a.573.573 0 1 1 0 1.146h-2.96a.573.573 0 0 1-.573-.573" clipRule="evenodd" />
    </g>
    <defs>
      <clipPath id="icon-duel-document_svg__a">
        <path d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);


export const BlackjackBottomControls = memo(function BlackjackBottomControls({
  phase,
  betAmount,
  onBetAmountChange,
  onDeal,
  onNewGame,
  onHit,
  onStand,
  onDouble,
  onSplit,
  onAcceptInsurance,
  onDeclineInsurance,
  canHit,
  canStand,
  canDouble,
  canSplit,
  isLoading,
  result,
  payout,
}: BlackjackBottomControlsProps) {
  const [isMaxBet, setIsMaxBet] = useState(false);

  const isBetting = phase === 'betting';
  const isPlaying = phase === 'player_turn';
  const isInsurance = phase === 'insurance_offer';
  const isSettled = phase === 'settled';
  const isDealerTurn = phase === 'dealer_turn';

  const handleBetAmountChange = (amount: string) => {
    setIsMaxBet(false);
    onBetAmountChange(amount);
  };

  const headerButtonClass = "touch-manipulation outline-none cursor-pointer border border-dark-500 text-dark-200 hover:bg-dark-500 hover:text-light-000 active:text-light-000 disabled:bg-transparent disabled:text-light-000 disabled:opacity-50 px-[12px] h-[40px] text-b-md font-semibold flex flex-row items-center justify-center rounded-8 py-8 transition-all relative disabled:cursor-not-allowed";

  return (
    <div
      className="relative inset-x-0 mx-auto flex w-[calc(100%-16px)] max-w-[662px] flex-col items-center transition-opacity md:absolute md:bottom-[160px] md:mt-0 lg:bottom-[96px]"
      style={{ marginTop: 0 }}
    >
      {/* Header row with game info buttons */}
      <div className="mb-16 flex w-full items-end justify-between">
        <div />
        <div className="flex items-center gap-x-8">
          {/* Zero Edge button */}
          <ZeroEdgeBadge className="touch-manipulation outline-none border border-dark-500 text-dark-200 hover:bg-dark-500 hover:text-light-000 px-[12px] h-[40px] text-b-md font-semibold rounded-8 py-8" />

          {/* Rules button */}
          <button className={headerButtonClass} data-testid="open-blackjack-rules-modal">
            <span className="flex items-center justify-center w-full gap-4 flex-row">
              <div className="size-16">
                <RulesIcon />
              </div>
            </span>
          </button>

          {/* Provably Fair button */}
          <ProvablyFairBadge
            gameName="blackjack"
            showLabel={false}
            className={headerButtonClass}
          />
        </div>
      </div>

      {/* Main controls area */}
      <div className="flex w-full">
        {/* Playing phase: Hit/Stand/Double/Split */}
        {isPlaying && (
          <BlackjackControls
            onHit={onHit}
            onStand={onStand}
            onDouble={onDouble}
            onSplit={onSplit}
            canHit={canHit}
            canStand={canStand}
            canDouble={canDouble}
            canSplit={canSplit}
            isLoading={isLoading}
          />
        )}

        {/* Insurance phase */}
        {isInsurance && (
          <InsuranceModal
            onAccept={onAcceptInsurance}
            onDecline={onDeclineInsurance}
            isLoading={isLoading}
          />
        )}

        {/* Dealer turn: waiting */}
        {isDealerTurn && (
          <div className="flex h-[86px] w-full items-center justify-center gap-8 rounded-8 bg-dark-600 p-8 sm:h-[105px] sm:p-16">
            <span className="text-b-lg text-dark-200">Dealer&apos;s turn...</span>
          </div>
        )}

        {/* Betting phase: show bet input + Place bet button */}
        {(isBetting || isSettled) && (
          <div className="flex w-full flex-col items-end gap-16 rounded-8 bg-dark-600 p-16 sm:flex-row">
            <div className="w-full min-w-0">
              <div className="mt-[22px]">
                <BetAmountInput
                  value={betAmount}
                  onChange={handleBetAmountChange}
                  disabled={isLoading}
                  bgClassName="bg-dark-900"
                  onMax={() => setIsMaxBet(true)}
                />
              </div>
            </div>
            <div className="w-full shrink-0 sm:w-auto">
              <ActionButton
                onClick={onDeal}
                isLoading={isLoading}
                disabled={isLoading}
                variant={isMaxBet ? 'confirm' : 'primary'}
              >
                {isMaxBet ? 'Confirm Max Bet' : 'Place bet'}
              </ActionButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
