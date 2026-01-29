'use client';

import { memo } from 'react';

interface BetAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const BetAmountInput = memo(function BetAmountInput({
  value,
  onChange,
  disabled = false,
}: BetAmountInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-[-22px] flex justify-between gap-4 whitespace-nowrap text-b-md font-semibold text-dark-200">
        <span>Bet Amount</span>
        <span className="ml-auto max-w-[50%] truncate">{value}</span> BTC
      </div>
      <div
        className={`group flex h-[48px] items-center gap-4 rounded-8 bg-dark-900 px-[12px] py-8 text-b-md font-semibold text-dark-300 outline outline-2 outline-offset-[-2px] outline-transparent transition-all [&_input]:text-h-sm [&_input]:font-semibold ${disabled ? 'opacity-50 pointer-events-none' : 'hover:outline-dark-400 focus-within:outline-dark-400 active:outline-dark-400 active:text-light-000 focus:text-light-000'}`}
      >
        <div className="size-16 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="h-full w-full">
            <path fill="#2B63F4" d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0" />
            <path fill="#fff" d="M6.927 11.705a.2.2 0 0 1-.2-.2V2.45c0-.11.09-.2.2-.2h.206c.11 0 .2.09.2.2v9.055a.2.2 0 0 1-.2.2zm1.727-6.43c-.103 0-.186-.078-.212-.177a1 1 0 0 0-.404-.577q-.381-.27-.99-.27-.428 0-.735.13-.306.13-.469.35a.85.85 0 0 0-.059.917 1 1 0 0 0 .3.295q.188.118.417.2t.461.136l.71.178q.428.099.823.27.398.168.713.428.317.258.502.624.185.365.185.857 0 .665-.34 1.17-.34.502-.982.787-.639.28-1.548.28-.883 0-1.533-.273a2.3 2.3 0 0 1-1.012-.797 2.3 2.3 0 0 1-.376-1.07.19.19 0 0 1 .193-.208h.954c.105 0 .19.08.211.184q.056.274.219.473.214.262.557.392.348.129.776.129.447 0 .783-.133a1.27 1.27 0 0 0 .532-.377.9.9 0 0 0 .196-.569.72.72 0 0 0-.174-.487 1.3 1.3 0 0 0-.476-.325 4.6 4.6 0 0 0-.71-.236l-.86-.222q-.934-.24-1.477-.728-.54-.491-.54-1.303 0-.669.362-1.171.366-.502.994-.78.627-.28 1.422-.28.805 0 1.41.28a2.3 2.3 0 0 1 .957.773q.291.411.346.927a.187.187 0 0 1-.191.203z" />
          </svg>
        </div>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-transparent text-h-sm font-semibold text-light-000 outline-none placeholder:text-dark-300 disabled:cursor-not-allowed"
        />
        <div className="-mr-4 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => onChange((parseFloat(value) / 2).toFixed(2))}
            disabled={disabled}
            className="flex h-[32px] min-w-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] text-b-sm font-semibold text-light-000 transition-all disabled:cursor-not-allowed [&:not(:disabled):hover]:bg-dark-300"
          >
            ½
          </button>
          <button
            type="button"
            onClick={() => onChange((parseFloat(value) * 2).toFixed(2))}
            disabled={disabled}
            className="flex h-[32px] min-w-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] text-b-sm font-semibold text-light-000 transition-all disabled:cursor-not-allowed [&:not(:disabled):hover]:bg-dark-300"
          >
            2x
          </button>
          <button
            type="button"
            disabled={disabled}
            className="flex h-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] text-b-sm font-semibold uppercase text-light-000 transition-all disabled:cursor-not-allowed [&:not(:disabled):hover]:bg-dark-300"
          >
            Max
          </button>
        </div>
      </div>
    </div>
  );
});
