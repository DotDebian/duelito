'use client';

import { memo } from 'react';
import type { BetMode } from '@/types';
import type { CrashPhase, CrashPlayer, CrashAutoBetConfig } from '../types';
import { BetAmountInput, BetModeSelector, NumberOfBetsInput } from '@/app/components/betting';
import { PlayersList } from './PlayersList';

interface CrashControlsProps {
  betMode: BetMode;
  onBetModeChange: (mode: BetMode) => void;
  betAmount: string;
  onBetAmountChange: (value: string) => void;
  autoCashoutAt: string;
  onAutoCashoutChange: (value: string) => void;
  profitOnWin: number;
  phase: CrashPhase;
  players: CrashPlayer[];
  totalBets: number;
  isInRound: boolean;
  hasCashedOut: boolean;
  hasQueuedBet: boolean;
  canBet: boolean;
  canCashout: boolean;
  canCancelBet: boolean;
  multiplier: number;
  autoConfig: CrashAutoBetConfig;
  onAutoConfigChange: (updates: Partial<CrashAutoBetConfig>) => void;
  isAutoPlaying: boolean;
  onBetClick: () => void;
  onCashoutClick: () => void;
  onCancelBetClick: () => void;
}

// Currency icon
const CurrencyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="h-full w-full">
    <path fill="#2B63F4" d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0" />
    <path
      fill="#fff"
      d="M6.927 11.705a.2.2 0 0 1-.2-.2V2.45c0-.11.09-.2.2-.2h.206c.11 0 .2.09.2.2v9.055a.2.2 0 0 1-.2.2zm1.727-6.43c-.103 0-.186-.078-.212-.177a1 1 0 0 0-.404-.577q-.381-.27-.99-.27-.428 0-.735.13-.306.13-.469.35a.85.85 0 0 0-.059.917 1 1 0 0 0 .3.295q.188.118.417.2t.461.136l.71.178q.428.099.823.27.398.168.713.428.317.258.502.624.185.365.185.857 0 .665-.34 1.17-.34.502-.982.787-.639.28-1.548.28-.883 0-1.533-.273a2.3 2.3 0 0 1-1.012-.797 2.3 2.3 0 0 1-.376-1.07.19.19 0 0 1 .193-.208h.954c.105 0 .19.08.211.184q.056.274.219.473.214.262.557.392.348.129.776.129.447 0 .783-.133a1.27 1.27 0 0 0 .532-.377.9.9 0 0 0 .196-.569.72.72 0 0 0-.174-.487 1.3 1.3 0 0 0-.476-.325 4.6 4.6 0 0 0-.71-.236l-.86-.222q-.934-.24-1.477-.728-.54-.491-.54-1.303 0-.669.362-1.171.366-.502.994-.78.627-.28 1.422-.28.805 0 1.41.28a2.3 2.3 0 0 1 .957.773q.291.411.346.927a.187.187 0 0 1-.191.203z"
    />
  </svg>
);

// USDC icon
const USDCIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" className="h-full w-full">
    <path fill="#2775ca" d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000" />
    <path fill="#fff" d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84" />
    <path fill="#fff" d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5m441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67" />
  </svg>
);

// Chevron down icon
const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 14 14"
    className="h-full w-full"
  >
    <path
      fillRule="evenodd"
      d="M6.903 7.74c.053.055.14.055.194 0l3.428-3.494a.543.543 0 0 1 .775 0l.211.216a.543.543 0 0 1 0 .76L7.387 9.426a.543.543 0 0 1-.774 0L2.489 5.222a.543.543 0 0 1 0-.76l.211-.216a.543.543 0 0 1 .775 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Chevron up icon
const ChevronUp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 14 14"
    className="h-full w-full"
  >
    <path
      fillRule="evenodd"
      d="M6.903 5.931a.136.136 0 0 1 .194 0l3.428 3.495a.543.543 0 0 0 .775 0l.211-.216a.543.543 0 0 0 0-.76L7.387 4.246a.543.543 0 0 0-.774 0L2.489 8.45a.543.543 0 0 0 0 .76l.211.216a.543.543 0 0 0 .775 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const CrashControls = memo(function CrashControls({
  betMode,
  onBetModeChange,
  betAmount,
  onBetAmountChange,
  autoCashoutAt,
  onAutoCashoutChange,
  profitOnWin,
  phase,
  players,
  totalBets,
  isInRound,
  hasCashedOut,
  hasQueuedBet,
  canBet,
  canCashout,
  canCancelBet,
  multiplier,
  autoConfig,
  onAutoConfigChange,
  isAutoPlaying,
  onBetClick,
  onCashoutClick,
  onCancelBetClick,
}: CrashControlsProps) {
  const controlsDisabled = isInRound || hasQueuedBet || (betMode === 'auto' && isAutoPlaying);

  const incrementCashout = () => {
    const current = parseFloat(autoCashoutAt) || 1;
    onAutoCashoutChange((current + 1).toString());
  };

  const decrementCashout = () => {
    const current = parseFloat(autoCashoutAt) || 2;
    onAutoCashoutChange(Math.max(1.01, current - 1).toString());
  };

  const getButtonText = () => {
    // Cashout pendant ascending si dans le round
    if (phase === 'ascending' && isInRound && !hasCashedOut) {
      const potentialWin = parseFloat(betAmount) * multiplier;
      return `Cashout $${potentialWin.toFixed(2)}`;
    }

    // Cancel bet si bet en queue
    if (hasQueuedBet) {
      return 'Cancel Bet';
    }

    // Bet placed si en waiting et dans le round
    if (phase === 'waiting' && isInRound) {
      return 'Bet Placed';
    }

    // Bet (Next Round) si ascending
    if (phase === 'ascending') {
      return 'Bet (Next Round)';
    }

    // Bet par défaut (waiting, pas dans le round)
    return 'Bet';
  };

  const handleClick = () => {
    if (canCashout) {
      onCashoutClick();
    } else if (canCancelBet) {
      onCancelBetClick();
    } else if (canBet) {
      onBetClick();
    }
  };

  const isButtonDisabled = !canBet && !canCashout && !canCancelBet;

  return (
    <div className="flex w-[380px] shrink-0 flex-col gap-16 overflow-y-auto rounded-12 rounded-r-none bg-dark-700 p-32 scrollbar-hidden">
      <div>
        <BetModeSelector
          value={betMode}
          onChange={onBetModeChange}
          disabled={controlsDisabled}
        />

        <div className="flex w-full flex-col gap-16 mb-16">
          <div className="mt-[22px]">
            <BetAmountInput
              value={betAmount}
              onChange={onBetAmountChange}
              disabled={controlsDisabled}
            />
          </div>

          {/* Cashout at input */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <label className="text-b-md font-semibold text-dark-200">
                Cashout at
              </label>
            </div>
            <div className="mt-4 group flex h-[48px] items-center gap-4 rounded-8 bg-dark-600 px-[12px] py-8 text-b-md font-semibold outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:outline-dark-400 focus-within:outline-dark-400">
              <span className="-mr-2 text-h-xs text-light-000">x</span>
              <input
                type="text"
                inputMode="decimal"
                value={autoCashoutAt}
                onChange={(e) => onAutoCashoutChange(e.target.value)}
                disabled={controlsDisabled}
                className="w-full bg-transparent pl-8 text-h-sm font-semibold text-light-000 outline-none placeholder:text-dark-300 disabled:cursor-not-allowed disabled:text-dark-200"
              />
              <div className="-mr-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={decrementCashout}
                  disabled={controlsDisabled}
                  aria-label="Decrease cashout"
                  className="flex h-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] text-light-000 transition-all disabled:cursor-not-allowed disabled:opacity-50 [&:not(:disabled):hover]:bg-dark-300"
                >
                  <div className="size-[12px]">
                    <ChevronDown />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={incrementCashout}
                  disabled={controlsDisabled}
                  aria-label="Increase cashout"
                  className="flex h-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] text-light-000 transition-all disabled:cursor-not-allowed disabled:opacity-50 [&:not(:disabled):hover]:bg-dark-300"
                >
                  <div className="size-[12px]">
                    <ChevronUp />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Auto mode controls */}
        {betMode === 'auto' && (
          <>
            {/* Number of Bets */}
            <div className="mb-16">
              <NumberOfBetsInput
                value={autoConfig.numberOfBets}
                onChange={(value) => onAutoConfigChange({ numberOfBets: value })}
                disabled={controlsDisabled}
              />
            </div>

            {/* On Win */}
            <div className="mb-16">
              <label className="text-b-md font-semibold text-dark-200">On Win</label>
              <div className="mt-4 flex h-[48px] items-center rounded-8 bg-dark-600 p-4 gap-4">
                <button
                  type="button"
                  onClick={() => onAutoConfigChange({ onWin: 'reset' })}
                  disabled={controlsDisabled}
                  className={`flex items-center justify-center rounded-8 py-[8px] px-[10px] text-b-sm font-bold transition-all ml-1 ${
                    autoConfig.onWin === 'reset'
                      ? 'bg-blue-600 text-light-000'
                      : 'text-dark-200 hover:text-light-000'
                  }`}
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => onAutoConfigChange({ onWin: 'increase' })}
                  disabled={controlsDisabled}
                  className={`flex items-center justify-center rounded-8 py-[8px] px-[10px] text-b-sm font-bold transition-all ${
                    autoConfig.onWin === 'increase'
                      ? 'bg-blue-600 text-light-000'
                      : 'text-dark-200 hover:text-light-000'
                  }`}
                >
                  Increase by
                </button>
                <div className="ml-auto flex items-center">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={autoConfig.onWinPercent}
                    onChange={(e) => onAutoConfigChange({ onWinPercent: e.target.value })}
                    disabled={controlsDisabled || autoConfig.onWin === 'reset'}
                    className="w-[50px] bg-transparent text-right text-h-sm font-semibold text-light-000 outline-none placeholder:text-dark-300 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="text-b-md font-semibold text-dark-300 ml-1">%</span>
                </div>
              </div>
            </div>

            {/* On Loss */}
            <div className="mb-16">
              <label className="text-b-md font-semibold text-dark-200">On Loss</label>
              <div className="mt-4 flex h-[48px] items-center rounded-8 bg-dark-600 p-4 gap-4">
                <button
                  type="button"
                  onClick={() => onAutoConfigChange({ onLoss: 'reset' })}
                  disabled={controlsDisabled}
                  className={`flex items-center justify-center rounded-8 py-[8px] px-[10px] text-b-sm font-bold transition-all ml-1 ${
                    autoConfig.onLoss === 'reset'
                      ? 'bg-blue-600 text-light-000'
                      : 'text-dark-200 hover:text-light-000'
                  }`}
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => onAutoConfigChange({ onLoss: 'increase' })}
                  disabled={controlsDisabled}
                  className={`flex items-center justify-center rounded-8 py-[8px] px-[10px] text-b-sm font-bold transition-all ${
                    autoConfig.onLoss === 'increase'
                      ? 'bg-blue-600 text-light-000'
                      : 'text-dark-200 hover:text-light-000'
                  }`}
                >
                  Increase by
                </button>
                <div className="ml-auto flex items-center">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={autoConfig.onLossPercent}
                    onChange={(e) => onAutoConfigChange({ onLossPercent: e.target.value })}
                    disabled={controlsDisabled || autoConfig.onLoss === 'reset'}
                    className="w-[50px] bg-transparent text-right text-h-sm font-semibold text-light-000 outline-none placeholder:text-dark-300 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="text-b-md font-semibold text-dark-300 ml-1">%</span>
                </div>
              </div>
            </div>

            {/* Stop conditions */}
            <div className="mb-16 flex gap-16">
              <div className="flex flex-1 flex-col">
                <label className="text-b-md font-semibold text-dark-200">Stop on Profit</label>
                <div className="mt-4 relative">
                  <div className="absolute left-[12px] top-1/2 -translate-y-1/2 size-16 shrink-0">
                    <CurrencyIcon />
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={autoConfig.stopOnProfit}
                    onChange={(e) => onAutoConfigChange({ stopOnProfit: e.target.value })}
                    disabled={controlsDisabled}
                    className="h-[48px] w-full rounded-8 bg-dark-600 pl-[36px] pr-[12px] text-h-sm font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 disabled:cursor-not-allowed disabled:opacity-50 [&:not(:disabled):hover]:outline-dark-400 [&:not(:disabled):focus]:outline-dark-400"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <label className="text-b-md font-semibold text-dark-200">Stop on Loss</label>
                <div className="mt-4 relative">
                  <div className="absolute left-[12px] top-1/2 -translate-y-1/2 size-16 shrink-0">
                    <CurrencyIcon />
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={autoConfig.stopOnLoss}
                    onChange={(e) => onAutoConfigChange({ stopOnLoss: e.target.value })}
                    disabled={controlsDisabled}
                    className="h-[48px] w-full rounded-8 bg-dark-600 pl-[36px] pr-[12px] text-h-sm font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 disabled:cursor-not-allowed disabled:opacity-50 [&:not(:disabled):hover]:outline-dark-400 [&:not(:disabled):focus]:outline-dark-400"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Profit on Win + Bet button */}
      <div className="flex flex-col gap-y-16">
        <div className="flex min-h-[30px] w-full items-center justify-center gap-x-8">
          <span className="text-h-xs text-dark-200">Profit on Win</span>
          <span className="min-w-[50px] text-h-sm">
            <span className="inline-flex items-center justify-center gap-4 tabular-nums">
              <span className="size-16">
                <USDCIcon />
              </span>
              <span>${profitOnWin.toFixed(2)}</span>
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleClick}
          disabled={isButtonDisabled}
          className={`relative mt-2 flex h-[48px] w-full shrink-0 flex-row items-center justify-center rounded-8 px-[24px] py-8 text-b-lg font-bold touch-manipulation outline-none transition-colors duration-[250ms] disabled:cursor-not-allowed disabled:bg-dark-400 disabled:text-light-000 disabled:opacity-50 ${
            canCashout
              ? 'bg-green-600 text-dark-700 hover:bg-green-500 hover:text-dark-700 active:bg-green-500 active:text-dark-700'
              : canCancelBet
                ? 'bg-dark-400 text-light-000 hover:bg-dark-300 hover:text-light-000 active:bg-dark-300 active:text-light-000'
                : 'bg-blue-600 text-light-000 hover:bg-blue-500 active:bg-blue-500'
          }`}
        >
          <span className="flex items-center gap-x-8 truncate">
            <span className="truncate">{getButtonText()}</span>
          </span>
        </button>
      </div>

      {/* Players list */}
      <PlayersList players={players} phase={phase} totalBets={totalBets} />
    </div>
  );
});
