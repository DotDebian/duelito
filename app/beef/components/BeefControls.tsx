'use client';

import { memo } from 'react';
import type { BetMode } from '@/types';
import type { AutoBetConfig, BeefDifficulty, BeefPhase } from '../types';
import {
  BetAmountInput,
  BetModeSelector,
  NumberOfBetsInput,
  ActionButton,
} from '@/app/components/betting';

interface BeefControlsProps {
  phase: BeefPhase;
  betMode: BetMode;
  onBetModeChange: (mode: BetMode) => void;
  betAmount: string;
  onBetAmountChange: (value: string) => void;
  difficulty: BeefDifficulty;
  onDifficultyChange: (difficulty: BeefDifficulty) => void;
  position: number;
  currentMultiplier: number;
  potentialPayout: number;
  nextMultiplier: number;
  autoConfig: AutoBetConfig;
  onAutoConfigChange: (updates: Partial<AutoBetConfig>) => void;
  isAutoPlaying: boolean;
  onStartGame: () => void;
  onJump: () => void;
  onCashout: () => void;
  onToggleAutoPlay: () => void;
  canJump: boolean;
  canCashout: boolean;
}

const DIFFICULTIES: { value: BeefDifficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
];

export const BeefControls = memo(function BeefControls({
  phase,
  betMode,
  onBetModeChange,
  betAmount,
  onBetAmountChange,
  difficulty,
  onDifficultyChange,
  position,
  currentMultiplier,
  potentialPayout,
  nextMultiplier,
  autoConfig,
  onAutoConfigChange,
  isAutoPlaying,
  onStartGame,
  onJump,
  onCashout,
  onToggleAutoPlay,
  canJump,
  canCashout,
}: BeefControlsProps) {
  const isPlaying = phase === 'playing' || phase === 'jumping';
  const canStartNew = phase === 'idle' || phase === 'lost' || phase === 'won';
  const controlsDisabled = isPlaying || (betMode === 'auto' && isAutoPlaying);

  const handleActionClick = () => {
    if (betMode === 'auto') {
      onToggleAutoPlay();
    } else if (canStartNew) {
      onStartGame();
    } else if (canJump) {
      onJump();
    }
  };

  return (
    <div className="flex w-[380px] shrink-0 flex-col rounded-12 rounded-r-none bg-dark-700 p-32 scrollbar-none overflow-y-auto">
      <BetModeSelector value={betMode} onChange={onBetModeChange} />

      <div className="mt-[22px] mb-16">
        <BetAmountInput
          value={betAmount}
          onChange={onBetAmountChange}
          disabled={controlsDisabled}
        />
      </div>

      {/* Difficulty selector - Select dropdown */}
      <div className="mb-16">
        <label className="text-b-md font-semibold text-dark-200">Difficulty</label>
        <div className="mt-4 relative">
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as BeefDifficulty)}
            disabled={controlsDisabled}
            className="h-[48px] w-full appearance-none rounded-8 bg-dark-600 px-[12px] pr-[40px] text-h-sm font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 [&:not(:disabled):hover]:outline-dark-400 [&:not(:disabled):focus]:outline-dark-400"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-200"/>
            </svg>
          </div>
        </div>
      </div>

      {betMode === 'auto' && (
        <>
          {/* Number of Bets and Steps on same row */}
          <div className="mb-16 flex gap-16">
            <div className="flex-1">
              <NumberOfBetsInput
                value={autoConfig.numberOfBets}
                onChange={(value) => onAutoConfigChange({ numberOfBets: value })}
                disabled={controlsDisabled}
              />
            </div>
            <div className="flex-1">
              <label className="text-b-md font-semibold text-dark-200">Steps</label>
              <div className="mt-4 relative">
                <select
                  value={autoConfig.steps}
                  onChange={(e) => onAutoConfigChange({ steps: parseInt(e.target.value) })}
                  disabled={controlsDisabled}
                  className="h-[48px] w-full appearance-none rounded-8 bg-dark-600 px-[12px] pr-[40px] text-h-sm font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 [&:not(:disabled):hover]:outline-dark-400 [&:not(:disabled):focus]:outline-dark-400"
                >
                  {[...Array(19)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-200"/>
                  </svg>
                </div>
              </div>
            </div>
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="h-full w-full">
                    <path fill="#2B63F4" d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0" />
                    <path fill="#fff" d="M6.927 11.705a.2.2 0 0 1-.2-.2V2.45c0-.11.09-.2.2-.2h.206c.11 0 .2.09.2.2v9.055a.2.2 0 0 1-.2.2zm1.727-6.43c-.103 0-.186-.078-.212-.177a1 1 0 0 0-.404-.577q-.381-.27-.99-.27-.428 0-.735.13-.306.13-.469.35a.85.85 0 0 0-.059.917 1 1 0 0 0 .3.295q.188.118.417.2t.461.136l.71.178q.428.099.823.27.398.168.713.428.317.258.502.624.185.365.185.857 0 .665-.34 1.17-.34.502-.982.787-.639.28-1.548.28-.883 0-1.533-.273a2.3 2.3 0 0 1-1.012-.797 2.3 2.3 0 0 1-.376-1.07.19.19 0 0 1 .193-.208h.954c.105 0 .19.08.211.184q.056.274.219.473.214.262.557.392.348.129.776.129.447 0 .783-.133a1.27 1.27 0 0 0 .532-.377.9.9 0 0 0 .196-.569.72.72 0 0 0-.174-.487 1.3 1.3 0 0 0-.476-.325 4.6 4.6 0 0 0-.71-.236l-.86-.222q-.934-.24-1.477-.728-.54-.491-.54-1.303 0-.669.362-1.171.366-.502.994-.78.627-.28 1.422-.28.805 0 1.41.28a2.3 2.3 0 0 1 .957.773q.291.411.346.927a.187.187 0 0 1-.191.203z" />
                  </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="h-full w-full">
                    <path fill="#2B63F4" d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0" />
                    <path fill="#fff" d="M6.927 11.705a.2.2 0 0 1-.2-.2V2.45c0-.11.09-.2.2-.2h.206c.11 0 .2.09.2.2v9.055a.2.2 0 0 1-.2.2zm1.727-6.43c-.103 0-.186-.078-.212-.177a1 1 0 0 0-.404-.577q-.381-.27-.99-.27-.428 0-.735.13-.306.13-.469.35a.85.85 0 0 0-.059.917 1 1 0 0 0 .3.295q.188.118.417.2t.461.136l.71.178q.428.099.823.27.398.168.713.428.317.258.502.624.185.365.185.857 0 .665-.34 1.17-.34.502-.982.787-.639.28-1.548.28-.883 0-1.533-.273a2.3 2.3 0 0 1-1.012-.797 2.3 2.3 0 0 1-.376-1.07.19.19 0 0 1 .193-.208h.954c.105 0 .19.08.211.184q.056.274.219.473.214.262.557.392.348.129.776.129.447 0 .783-.133a1.27 1.27 0 0 0 .532-.377.9.9 0 0 0 .196-.569.72.72 0 0 0-.174-.487 1.3 1.3 0 0 0-.476-.325 4.6 4.6 0 0 0-.71-.236l-.86-.222q-.934-.24-1.477-.728-.54-.491-.54-1.303 0-.669.362-1.171.366-.502.994-.78.627-.28 1.422-.28.805 0 1.41.28a2.3 2.3 0 0 1 .957.773q.291.411.346.927a.187.187 0 0 1-.191.203z" />
                  </svg>
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

      {/* Actions */}
      <div className="mt-auto">
        {/* Cashout info when playing */}
        {canJump && betMode === 'manual' && nextMultiplier > 0 && (
          <div className="flex flex-col items-center justify-center gap-4 text-h-sm font-semibold text-light-000 mb-16">
            <span className="text-b-md font-semibold text-light-200">Cashout on next tile</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="size-16 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="h-full w-full">
                    <path fill="#2B63F4" d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0" />
                    <path fill="#fff" d="M6.927 11.705a.2.2 0 0 1-.2-.2V2.45c0-.11.09-.2.2-.2h.206c.11 0 .2.09.2.2v9.055a.2.2 0 0 1-.2.2zm1.727-6.43c-.103 0-.186-.078-.212-.177a1 1 0 0 0-.404-.577q-.381-.27-.99-.27-.428 0-.735.13-.306.13-.469.35a.85.85 0 0 0-.059.917 1 1 0 0 0 .3.295q.188.118.417.2t.461.136l.71.178q.428.099.823.27.398.168.713.428.317.258.502.624.185.365.185.857 0 .665-.34 1.17-.34.502-.982.787-.639.28-1.548.28-.883 0-1.533-.273a2.3 2.3 0 0 1-1.012-.797 2.3 2.3 0 0 1-.376-1.07.19.19 0 0 1 .193-.208h.954c.105 0 .19.08.211.184q.056.274.219.473.214.262.557.392.348.129.776.129.447 0 .783-.133a1.27 1.27 0 0 0 .532-.377.9.9 0 0 0 .196-.569.72.72 0 0 0-.174-.487 1.3 1.3 0 0 0-.476-.325 4.6 4.6 0 0 0-.71-.236l-.86-.222q-.934-.24-1.477-.728-.54-.491-.54-1.303 0-.669.362-1.171.366-.502.994-.78.627-.28 1.422-.28.805 0 1.41.28a2.3 2.3 0 0 1 .957.773q.291.411.346.927a.187.187 0 0 1-.191.203z" />
                  </svg>
                </div>
                <span className="tabular-nums">${(parseFloat(betAmount) * nextMultiplier).toFixed(2)}</span>
              </div>
              <div>({nextMultiplier.toFixed(2)}x)</div>
            </div>
          </div>
        )}

        <ActionButton
          onClick={handleActionClick}
          isLoading={phase === 'jumping' || (betMode === 'auto' && isAutoPlaying)}
          disabled={false}
          variant={canJump ? 'secondary' : 'primary'}
        >
          {betMode === 'auto'
            ? isAutoPlaying
              ? 'Stop Autobet'
              : 'Start Autobet'
            : canStartNew
            ? 'Start Game'
            : canJump
            ? 'Go'
            : 'Waiting...'}
        </ActionButton>

        {/* Cashout button when playing */}
        {isPlaying && betMode === 'manual' && (
          <button
            type="button"
            onClick={onCashout}
            disabled={!canCashout}
            className={`w-full h-[48px] mt-12 rounded-8 font-bold text-b-lg transition-all active:scale-95 ${
              canCashout
                ? 'bg-blue-600 text-light-000 hover:bg-blue-500'
                : 'bg-dark-500 text-dark-300 cursor-not-allowed'
            }`}
          >
            Cashout ${potentialPayout.toFixed(2)}
          </button>
        )}
      </div>
    </div>
  );
});
