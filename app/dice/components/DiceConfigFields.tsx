'use client';

import { memo, useState, useEffect } from 'react';
import type { RollMode } from '../types';

interface DiceConfigFieldsProps {
  multiplier: number;
  rollOver: number;
  winChance: number;
  rollMode: RollMode;
  onMultiplierChange: (value: number) => void;
  onRollOverChange: (value: number) => void;
  onWinChanceChange: (value: number) => void;
  onToggleRollMode: () => void;
  disabled?: boolean;
}

export const DiceConfigFields = memo(function DiceConfigFields({
  multiplier,
  rollOver,
  winChance,
  rollMode,
  onMultiplierChange,
  onRollOverChange,
  onWinChanceChange,
  onToggleRollMode,
  disabled = false,
}: DiceConfigFieldsProps) {
  const [localMultiplier, setLocalMultiplier] = useState(multiplier.toFixed(4));
  const [localRollOver, setLocalRollOver] = useState(rollOver.toFixed(2));
  const [localWinChance, setLocalWinChance] = useState(winChance.toFixed(2));

  // Sync local state with props
  useEffect(() => {
    setLocalMultiplier(multiplier.toFixed(4));
  }, [multiplier]);

  useEffect(() => {
    setLocalRollOver(rollOver.toFixed(2));
  }, [rollOver]);

  useEffect(() => {
    setLocalWinChance(winChance.toFixed(2));
  }, [winChance]);

  const handleMultiplierBlur = () => {
    const value = parseFloat(localMultiplier);
    if (!isNaN(value) && value > 1) {
      onMultiplierChange(value);
    }
  };

  const handleRollOverBlur = () => {
    const value = parseFloat(localRollOver);
    if (!isNaN(value)) {
      onRollOverChange(value);
    }
  };

  const handleWinChanceBlur = () => {
    const value = parseFloat(localWinChance);
    if (!isNaN(value)) {
      onWinChanceChange(value);
    }
  };

  const resetMultiplier = () => {
    onMultiplierChange(2);
  };

  return (
    <div className="flex gap-16">
      {/* Multiplier */}
      <div className="flex flex-1 flex-col gap-4">
        <label className="text-b-md font-semibold text-dark-200">
          Multiplier
        </label>
        <div
          className={`group flex h-[48px] items-center gap-8 rounded-8 bg-dark-600 px-[12px] outline outline-2 outline-offset-[-2px] outline-transparent transition-all ${
            disabled ? 'opacity-50' : 'hover:outline-dark-400 focus-within:outline-dark-400'
          }`}
        >
          <input
            type="text"
            inputMode="decimal"
            value={localMultiplier}
            onChange={(e) => setLocalMultiplier(e.target.value)}
            onBlur={handleMultiplierBlur}
            disabled={disabled}
            className="w-full bg-transparent text-h-sm font-semibold text-light-000 outline-none placeholder:text-dark-300 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={resetMultiplier}
            disabled={disabled}
            className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-8 bg-dark-400 text-light-000 transition-all disabled:cursor-not-allowed [&:not(:disabled):hover]:bg-dark-300"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Roll Over/Under */}
      <div className="flex flex-1 flex-col gap-4">
        <label className="text-b-md font-semibold text-dark-200">
          Roll {rollMode === 'over' ? 'Over' : 'Under'}
        </label>
        <div
          className={`group flex h-[48px] items-center gap-8 rounded-8 bg-dark-600 px-[12px] outline outline-2 outline-offset-[-2px] outline-transparent transition-all ${
            disabled ? 'opacity-50' : 'hover:outline-dark-400 focus-within:outline-dark-400'
          }`}
        >
          <input
            type="text"
            inputMode="decimal"
            value={localRollOver}
            onChange={(e) => setLocalRollOver(e.target.value)}
            onBlur={handleRollOverBlur}
            disabled={disabled}
            className="w-full bg-transparent text-h-sm font-semibold text-light-000 outline-none placeholder:text-dark-300 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={onToggleRollMode}
            disabled={disabled}
            className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-8 bg-dark-400 text-light-000 transition-all disabled:cursor-not-allowed [&:not(:disabled):hover]:bg-dark-300"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4h12M1 4l3-3M1 4l3 3M13 10H1M13 10l-3-3M13 10l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Win Chance */}
      <div className="flex flex-1 flex-col gap-4">
        <label className="text-b-md font-semibold text-dark-200">
          Win Chance
        </label>
        <div
          className={`group flex h-[48px] items-center gap-8 rounded-8 bg-dark-600 px-[12px] outline outline-2 outline-offset-[-2px] outline-transparent transition-all ${
            disabled ? 'opacity-50' : 'hover:outline-dark-400 focus-within:outline-dark-400'
          }`}
        >
          <input
            type="text"
            inputMode="decimal"
            value={localWinChance}
            onChange={(e) => setLocalWinChance(e.target.value)}
            onBlur={handleWinChanceBlur}
            disabled={disabled}
            className="w-full bg-transparent text-h-sm font-semibold text-light-000 outline-none placeholder:text-dark-300 disabled:cursor-not-allowed"
          />
          <span className="shrink-0 text-h-sm font-semibold text-dark-300">%</span>
        </div>
      </div>
    </div>
  );
});
