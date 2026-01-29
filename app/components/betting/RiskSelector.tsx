'use client';

import { memo } from 'react';
import type { RiskLevel } from '@/types';

interface RiskSelectorProps {
  value: RiskLevel;
  onChange: (value: RiskLevel) => void;
  disabled?: boolean;
}

const RISK_TAB_WIDTH = 100;
const RISK_OFFSETS: Record<RiskLevel, number> = {
  low: 4,
  medium: 108,
  high: 212,
};

export const RiskSelector = memo(function RiskSelector({
  value,
  onChange,
  disabled = false,
}: RiskSelectorProps) {
  const tabOffset = RISK_OFFSETS[value];

  return (
    <div className="w-full mb-16">
      <label className="text-b-md font-semibold text-dark-200">Risk</label>
      <div className="h-4" />
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="relative inline-flex h-[48px] w-full gap-4 rounded-12 bg-dark-600 p-4"
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        <div
          className="absolute left-0 top-[4px] z-10 h-[calc(100%-8px)] transform rounded-8 bg-dark-400 transition-all duration-200"
          style={{ width: `${RISK_TAB_WIDTH}px`, transform: `translateX(${tabOffset}px)`, willChange: 'transform, width' }}
        />
        {(['low', 'medium', 'high'] as const).map((riskLevel) => (
          <button
            key={riskLevel}
            role="tab"
            type="button"
            aria-selected={value === riskLevel}
            onClick={() => !disabled && onChange(riskLevel)}
            disabled={disabled}
            className={`z-20 flex flex-1 items-center justify-center gap-8 text-nowrap rounded-8 px-[12px] py-8 text-b-md font-semibold outline-none transition-all duration-100 focus-visible:outline-0 ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            } ${
              value === riskLevel
                ? 'text-light-000 brightness-200'
                : `text-dark-200 brightness-100 ${!disabled ? 'hover:text-light-000' : ''}`
            }`}
          >
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
});
