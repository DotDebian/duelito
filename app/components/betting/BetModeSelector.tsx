'use client';

import { memo } from 'react';
import type { BetMode } from '@/types';

interface BetModeSelectorProps {
  value: BetMode;
  onChange: (value: BetMode) => void;
  disabled?: boolean;
}

const TAB_WIDTH = 152;
const TAB_OFFSETS: Record<BetMode, number> = {
  manual: 4,
  auto: 160,
};

export const BetModeSelector = memo(function BetModeSelector({
  value,
  onChange,
  disabled = false,
}: BetModeSelectorProps) {
  const tabOffset = TAB_OFFSETS[value];

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`relative mb-16 inline-flex h-[48px] w-full gap-4 rounded-12 bg-dark-600 p-4 ${disabled ? 'opacity-50' : ''}`}
    >
      <div
        className="absolute left-0 top-[4px] z-10 h-[calc(100%-8px)] transform rounded-8 bg-dark-400 transition-all duration-200"
        style={{ width: `${TAB_WIDTH}px`, transform: `translateX(${tabOffset}px)`, willChange: 'transform, width' }}
      />
      {(['manual', 'auto'] as const).map((mode) => (
        <button
          key={mode}
          role="tab"
          type="button"
          aria-selected={value === mode}
          onClick={() => onChange(mode)}
          disabled={disabled}
          className={`z-20 flex size-full cursor-pointer items-center justify-center gap-8 text-nowrap rounded-8 px-[12px] py-8 text-b-md font-semibold outline-none transition-all duration-100 focus-visible:outline-0 disabled:cursor-not-allowed ${
            value === mode
              ? 'text-light-000 brightness-200'
              : 'text-dark-200 brightness-100 hover:text-light-000'
          }`}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      ))}
    </div>
  );
});
