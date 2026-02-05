'use client';

import { memo } from 'react';

interface NumberOfBetsInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const NumberOfBetsInput = memo(function NumberOfBetsInput({
  value,
  onChange,
  disabled = false,
}: NumberOfBetsInputProps) {
  return (
    <div className="mb-16">
      <div className="flex w-full flex-col">
        <label className="text-b-md font-semibold text-dark-200">
          <span className="text-dark-200">Number of Bets</span>
        </label>
        <div className="h-4" />
        <div className="relative" style={{ opacity: disabled ? 0.5 : 1 }}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="h-[48px] w-full rounded-8 bg-dark-600 px-[12px] py-8 text-h-sm font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 focus:text-light-000 disabled:cursor-not-allowed [&:not(:disabled):hover]:outline-dark-400 [&:not(:disabled):focus]:outline-dark-400"
          />
          <button
            type="button"
            onClick={() => onChange('∞')}
            disabled={disabled}
            className="absolute right-8 top-8 flex h-[32px] cursor-pointer items-center justify-center rounded-8 bg-dark-400 px-[10px] py-8 text-h-md font-semibold text-light-000 transition-all disabled:cursor-not-allowed [&:not(:disabled):hover]:bg-dark-300"
          >
            <span className="flex items-center justify-center gap-4">∞</span>
          </button>
        </div>
      </div>
    </div>
  );
});
