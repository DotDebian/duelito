'use client';

import { memo } from 'react';

interface BlackjackControlsProps {
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onSplit: () => void;
  canHit: boolean;
  canStand: boolean;
  canDouble: boolean;
  canSplit: boolean;
  isLoading?: boolean;
}

const HitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
    <path d="M2.755 2.756v8.917c0 .493.4.892.891.892H9.89q.053-.001.104-.008a.89.89 0 0 1-.885.787H2.866a.89.89 0 0 1-.891-.891V3.537c0-.457.343-.834.786-.886a1 1 0 0 0-.006.105m8.379-2.1c.492 0 .891.399.891.891v8.917c0 .493-.399.892-.891.892H4.892A.89.89 0 0 1 4 10.464V1.547c0-.492.4-.891.892-.891zM8.012 3.444a.6.6 0 0 0-.6.6V5.63H6.41a.4.4 0 0 0-.321.641L7.69 8.408c.16.213.482.213.642 0L9.935 6.27a.4.4 0 0 0-.32-.64H8.612V4.043c0-.331-.27-.6-.601-.6" />
  </svg>
);

const StandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
    <path fillRule="evenodd" d="M2.625 2.844v8.312c0 .466.378.844.844.844h7.062a.844.844 0 0 0 .844-.844V2.844A.844.844 0 0 0 10.531 2H3.47a.844.844 0 0 0-.844.844m4.712 6.03L5.024 6.56a.352.352 0 0 1 .497-.497l1.491 1.491 1.49-1.49a.352.352 0 1 1 .498.496L6.687 8.874a.35.35 0 0 1-.248.103h-.004a.35.35 0 0 1-.248-.103z" clipRule="evenodd" />
  </svg>
);

const SplitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
    <path fillRule="evenodd" d="M11.5 3.317V2a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v5.336l1.51-1.84a.75.75 0 0 1 1.126-.038l1.9 2.026zm0 2.052L7.512 9.09a.75.75 0 0 1-1.06-.035L4.628 7.108 2.5 9.701V12a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1z" clipRule="evenodd" />
  </svg>
);

const DoubleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
    <path d="M4.912 1.64A.97.97 0 0 1 6.262 2l3.573 6.363c.27.482.104 1.1-.37 1.382l-4.412 2.62a.97.97 0 0 1-1.35-.362L.13 5.64A1.03 1.03 0 0 1 .5 4.259zm3.151.97a.97.97 0 0 1 1.35-.361L13.5 4.676c.475.282.64.901.37 1.383l-3.331 5.935a.97.97 0 0 1-1.35.361l-.923-.548 1.921-1.14a2.06 2.06 0 0 0 .742-2.766L8.01 2.703z" />
  </svg>
);

export const BlackjackControls = memo(function BlackjackControls({
  onHit,
  onStand,
  onDouble,
  onSplit,
  canHit,
  canStand,
  canDouble,
  canSplit,
  isLoading,
}: BlackjackControlsProps) {
  const buttonBase =
    'touch-manipulation outline-none cursor-pointer h-full px-0 bg-dark-400 text-light-000 hover:bg-dark-300 hover:text-light-000 active:bg-dark-300 active:text-light-000 disabled:bg-dark-400 disabled:text-light-000 disabled:opacity-50 w-full text-b-lg font-bold touch-manipulation flex flex-row items-center justify-center rounded-8 py-8 transition-all relative disabled:cursor-not-allowed';

  return (
    <div className="flex w-full">
      <div className="flex h-[86px] w-full gap-8 rounded-8 bg-dark-600 p-8 sm:h-[105px] sm:p-16">
        <button
          className={buttonBase}
          onClick={onHit}
          disabled={!canHit || isLoading}
          data-testid="hit"
        >
          <span className="flex items-center justify-center w-full gap-4 flex-col">
            <div className="size-16 text-green-500">
              <HitIcon />
            </div>
            Hit
          </span>
        </button>

        <button
          className={buttonBase}
          onClick={onStand}
          disabled={!canStand || isLoading}
          data-testid="stand"
        >
          <span className="flex items-center justify-center w-full gap-4 flex-col">
            <div className="size-16 text-red-500">
              <StandIcon />
            </div>
            Stand
          </span>
        </button>

        <button
          className={buttonBase}
          onClick={onSplit}
          disabled={!canSplit || isLoading}
          data-testid="split"
        >
          <span className="flex items-center justify-center w-full gap-4 flex-col">
            <div className="size-16 text-dark-200">
              <SplitIcon />
            </div>
            Split
          </span>
        </button>

        <button
          className={buttonBase}
          onClick={onDouble}
          disabled={!canDouble || isLoading}
          data-testid="double"
        >
          <span className="flex items-center justify-center w-full gap-4 flex-col">
            <div className="size-16 text-yellow-500">
              <DoubleIcon />
            </div>
            Double
          </span>
        </button>
      </div>
    </div>
  );
});
