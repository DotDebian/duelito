'use client';

import { memo } from 'react';
import type { BetMode, RiskLevel } from '@/types';
import {
  BetAmountInput,
  BetModeSelector,
  NumberOfBetsInput,
  RiskSelector,
  RowsSlider,
  ActionButton,
} from '@/app/components/betting';

interface PlinkoBettingSidebarProps {
  betMode: BetMode;
  onBetModeChange: (mode: BetMode) => void;
  betAmount: string;
  onBetAmountChange: (amount: string) => void;
  numberOfBets: string;
  onNumberOfBetsChange: (value: string) => void;
  risk: RiskLevel;
  onRiskChange: (risk: RiskLevel) => void;
  rows: number;
  onRowsChange: (rows: number) => void;
  isAutoPlaying: boolean;
  controlsDisabled: boolean;
  onActionClick: () => void;
}

const MIN_ROWS = 8;
const MAX_ROWS = 16;

export const PlinkoBettingSidebar = memo(function PlinkoBettingSidebar({
  betMode,
  onBetModeChange,
  betAmount,
  onBetAmountChange,
  numberOfBets,
  onNumberOfBetsChange,
  risk,
  onRiskChange,
  rows,
  onRowsChange,
  isAutoPlaying,
  controlsDisabled,
  onActionClick,
}: PlinkoBettingSidebarProps) {
  return (
    <div className="flex w-[380px] shrink-0 flex-col overflow-y-auto rounded-12 rounded-r-none bg-dark-700 p-32 scrollbar-none">
      <BetModeSelector value={betMode} onChange={onBetModeChange} />

      <div className="mt-[22px] mb-16">
        <BetAmountInput
          value={betAmount}
          onChange={onBetAmountChange}
          disabled={controlsDisabled}
        />
      </div>

      {betMode === 'auto' && (
        <NumberOfBetsInput
          value={numberOfBets}
          onChange={onNumberOfBetsChange}
          disabled={controlsDisabled}
        />
      )}

      <RiskSelector
        value={risk}
        onChange={onRiskChange}
        disabled={controlsDisabled}
      />

      <RowsSlider
        value={rows}
        onChange={onRowsChange}
        min={MIN_ROWS}
        max={MAX_ROWS}
        disabled={controlsDisabled}
      />

      <div className="mt-auto flex flex-col gap-y-16">
        <ActionButton onClick={onActionClick} isLoading={betMode === 'auto' && isAutoPlaying}>
          {betMode === 'auto' ? (isAutoPlaying ? 'Stop Autobet' : 'Start Autobet') : 'Start Game'}
        </ActionButton>
      </div>
    </div>
  );
});
