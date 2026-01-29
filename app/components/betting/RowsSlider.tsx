'use client';

import { memo } from 'react';
import { useSlider } from '@/hooks';

interface RowsSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
  label?: string;
}

export const RowsSlider = memo(function RowsSlider({
  value,
  onChange,
  min,
  max,
  disabled = false,
  label = 'Number of Rows',
}: RowsSliderProps) {
  const { sliderRef, progress, handleClick, handleThumbMouseDown } = useSlider({
    min,
    max,
    value,
    onChange,
    disabled,
  });

  return (
    <div className="mb-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <label className="text-b-md font-semibold text-dark-200">{label}</label>
        <div className="h-4" />
        <span className="text-14 text-white font-bold">{value}</span>
      </div>
      <div className="gap-12 mx-4 flex flex-col" style={{ opacity: disabled ? 0.5 : 1 }}>
        <div className="relative">
          <div
            ref={sliderRef}
            className={`relative h-4 w-full rounded-full bg-dark-600 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={handleClick}
          >
            <div
              className="h-4 rounded-full bg-blue-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
            <div
              className={`bg-white absolute top-1/2 flex h-[16px] w-[16px] -translate-y-1/2 items-center justify-center rounded-full shadow-xl transition-all duration-200 ${disabled ? 'cursor-not-allowed' : 'cursor-grab hover:scale-110 hover:shadow-2xl focus:scale-110 active:scale-105 active:cursor-grabbing'} focus:outline-none focus:ring-4 focus:ring-blue-600/50`}
              style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
              tabIndex={disabled ? -1 : 0}
              onMouseDown={handleThumbMouseDown}
            >
              <div className="bg-blue-600 absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
