'use client';

import { memo } from 'react';
import { useBalance } from '@/app/contexts/BalanceContext';

interface BetAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  bgClassName?: string;
  onMax?: () => void;
}

export const BetAmountInput = memo(function BetAmountInput({
  value,
  onChange,
  disabled = false,
  bgClassName = 'bg-dark-600',
  onMax,
}: BetAmountInputProps) {
  const { balance } = useBalance();

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-[-22px] flex justify-between gap-4 whitespace-nowrap text-b-md font-semibold text-dark-200">
        <span>Bet Amount</span>
        <span className="ml-auto max-w-[50%] truncate">${balance.toFixed(2)}</span>
      </div>
      <div
        className={`group flex h-[48px] items-center gap-4 rounded-8 ${bgClassName} px-[12px] py-8 text-b-md font-semibold text-dark-300 outline outline-2 outline-offset-[-2px] outline-transparent transition-all [&_input]:text-h-sm [&_input]:font-semibold ${disabled ? 'opacity-50 pointer-events-none' : 'hover:outline-dark-400 focus-within:outline-dark-400 active:outline-dark-400 active:text-light-000 focus:text-light-000'}`}
      >
        <div className="size-16 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" className="h-full w-full">
            <path fill="#2775ca" d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000" />
            <path fill="#fff" d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84" />
            <path fill="#fff" d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5m441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67" />
          </svg>
        </div>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          onChange={(e) => {
            let val = e.target.value.replace(',', '.');
            // Only allow digits and one decimal point
            val = val.replace(/[^\d.]/g, '');
            // Remove extra decimal points (keep only first)
            const parts = val.split('.');
            if (parts.length > 2) {
              val = parts[0] + '.' + parts.slice(1).join('');
            }
            // Limit to 2 decimal places
            if (parts.length === 2 && parts[1].length > 2) {
              val = parts[0] + '.' + parts[1].slice(0, 2);
            }
            onChange(val);
          }}
          disabled={disabled}
          className="w-full bg-transparent text-h-sm font-semibold text-light-000 outline-none placeholder:text-dark-300 disabled:cursor-not-allowed"
        />
        <div className="-mr-4 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => onChange((parseFloat(value) / 2).toFixed(2))}
            disabled={disabled}
            className="flex h-[32px] min-w-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] text-b-sm font-semibold text-light-000 transition-all cursor-pointer disabled:cursor-not-allowed [&:not(:disabled):hover]:bg-dark-300"
          >
            ½
          </button>
          <button
            type="button"
            onClick={() => onChange((parseFloat(value) * 2).toFixed(2))}
            disabled={disabled}
            className="flex h-[32px] min-w-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] text-b-sm font-semibold text-light-000 transition-all cursor-pointer disabled:cursor-not-allowed [&:not(:disabled):hover]:bg-dark-300"
          >
            2x
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(balance.toFixed(2));
              onMax?.();
            }}
            disabled={disabled}
            className="flex h-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] text-b-sm font-semibold uppercase text-light-000 transition-all cursor-pointer disabled:cursor-not-allowed [&:not(:disabled):hover]:bg-dark-300"
          >
            Max
          </button>
        </div>
      </div>
    </div>
  );
});
