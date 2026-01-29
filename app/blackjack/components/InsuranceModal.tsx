'use client';

import { memo } from 'react';

interface InsuranceModalProps {
  onAccept: () => void;
  onDecline: () => void;
  isLoading?: boolean;
}

export const InsuranceModal = memo(function InsuranceModal({
  onAccept,
  onDecline,
  isLoading,
}: InsuranceModalProps) {
  return (
    <div className="flex w-full">
      <div className="flex h-[86px] w-full flex-col items-center justify-center gap-8 rounded-8 bg-dark-600 p-8 sm:h-[105px] sm:p-16">
        <span className="text-h-md">Insurance?</span>
        <div className="flex w-full gap-8">
          <button
            className="touch-manipulation outline-none bg-dark-400 text-light-000 hover:bg-dark-300 hover:text-light-000 active:bg-dark-300 active:text-light-000 disabled:bg-dark-400 disabled:text-light-000 disabled:opacity-50 w-full px-[12px] h-[40px] text-b-md font-semibold touch-manipulation flex flex-row items-center justify-center rounded-8 py-8 transition-all relative disabled:cursor-not-allowed"
            onClick={onDecline}
            disabled={isLoading}
            data-testid="decline-insurance"
          >
            <span className="flex items-center justify-center w-full gap-4 flex-row">No</span>
          </button>
          <button
            className="touch-manipulation outline-none bg-blue-600 text-light-000 hover:bg-blue-500 hover:text-light-000 active:bg-blue-500 active:text-light-000 disabled:bg-dark-400 disabled:text-light-000 disabled:opacity-50 w-full px-[12px] h-[40px] text-b-md font-semibold touch-manipulation flex flex-row items-center justify-center rounded-8 py-8 transition-all relative disabled:cursor-not-allowed"
            onClick={onAccept}
            disabled={isLoading}
            data-testid="accept-insurance"
          >
            <span className="flex items-center justify-center w-full gap-4 flex-row">Yes</span>
          </button>
        </div>
      </div>
    </div>
  );
});
