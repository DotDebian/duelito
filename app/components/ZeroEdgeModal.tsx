'use client';

import { useState, useEffect } from 'react';

interface ZeroEdgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ZeroEdgeModal({ isOpen, onClose }: ZeroEdgeModalProps) {
  const [timeRemaining, setTimeRemaining] = useState({ hours: 23, minutes: 41, seconds: 21 });

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              minutes = 59;
              seconds = 59;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = () => {
    const h = timeRemaining.hours;
    const m = timeRemaining.minutes;
    const s = timeRemaining.seconds;
    return `${h}h ${m}min ${s}sec`;
  };

  // Mock data - in a real app this would come from an API
  const usedWagers = 0;
  const dailyLimit = 50000;
  const betLimit = 1000;
  const progressPercent = (usedWagers / dailyLimit) * 100;

  return (
    <>
      {/* Backdrop */}
      <div
        className="pointer-events-auto fixed inset-0 bg-dark-900/90"
        style={{ zIndex: 102 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 m-auto flex items-center justify-center transition-all duration-300"
        style={{ zIndex: 103 }}
      >
        <div
          className="relative w-[480px] max-w-[480px] flex-col rounded-12 bg-dark-500 touch-none"
          style={{ maxWidth: '90vw' }}
        >
          {/* Content */}
          <div className="flex h-full flex-col overflow-hidden rounded-12 min-h-[493px]">
            {/* Header */}
            <div>
              <div className="flex flex-col gap-8 px-16 py-32 sm:px-32">
                <div className="flex items-center gap-8">
                  <h2 className="flex items-center gap-8 text-h-md text-light-000">Zero Edge</h2>
                </div>
                <div className="inline-flex flex-wrap text-b-lg text-light-200">
                  <span className="mb-4 mr-4">Play at 0% house edge up to certain limits.</span>
                  <span className="cursor-pointer">
                    <span className="text-blue-500 underline hover:text-blue-600">Learn more</span>
                    <span>.</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="scrollbar flex flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden px-16 pb-16 pt-0 sm:px-32 sm:pb-32">
              <div>
                <div className="flex flex-col gap-0.5 overflow-hidden rounded-12 text-b-sm font-semibold text-dark-200">
                  {/* 0% Edge Wagers */}
                  <div className="bg-dark-600 p-16">
                    <div className="mb-4">0% Edge Wagers</div>
                    <div className="mb-8 flex gap-4 text-b-lg font-bold">
                      <span className="text-light-000">${usedWagers.toFixed(2)}</span>
                      <span className="text-dark-300"> / ${dailyLimit.toLocaleString()}.00</span>
                    </div>
                    <div className="h-8 w-full rounded-full bg-dark-400">
                      <div
                        className="transition-width h-8 rounded-full bg-green-600 duration-700"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Resets in */}
                  <div className="bg-dark-600 p-16">
                    <div className="mb-4">Resets in</div>
                    <div className="text-b-lg font-bold text-light-000">{formatTime()}</div>
                  </div>

                  {/* Bet Limit */}
                  <div className="bg-dark-600 p-16">
                    <div className="mb-4">Bet Limit</div>
                    <div className="text-b-lg font-bold text-light-000">${betLimit.toLocaleString()}.00</div>
                  </div>

                  {/* Daily Limit */}
                  <div className="bg-dark-600 p-16">
                    <div className="mb-4">Daily Limit</div>
                    <div className="text-b-lg font-bold text-light-000">${dailyLimit.toLocaleString()}.00</div>
                  </div>
                </div>

                {/* Footer text */}
                <div className="mt-[24px] text-b-md text-dark-200">
                  After your limit is fully used up, a 0.1% house edge will be applied to all bets (99.9% RTP) until the next reset.
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="touch-manipulation outline-none absolute right-[14px] top-[14px] z-10 cursor-pointer !px-16 text-dark-100 hover:text-light-000 hover:bg-dark-600 active:text-light-000 disabled:bg-transparent disabled:text-light-000 disabled:opacity-50 px-[24px] h-[48px] text-b-lg font-bold flex flex-row items-center justify-center rounded-8 py-8 transition-all disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center w-full gap-8 flex-row">
              <div className="size-16">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 14 14"
                  className="h-full w-full"
                >
                  <path d="m8.285 7 4.363-4.362c.12-.12.186-.28.186-.452a.63.63 0 0 0-.186-.45l-.383-.383a.63.63 0 0 0-.451-.186.63.63 0 0 0-.451.186L7 5.715 2.638 1.353a.63.63 0 0 0-.451-.186.63.63 0 0 0-.451.186l-.383.382a.64.64 0 0 0 0 .903L5.716 7l-4.363 4.362a.63.63 0 0 0-.186.452c0 .17.066.33.186.45l.383.383c.12.12.28.186.45.186.172 0 .332-.066.452-.186L7 8.285l4.363 4.362c.12.12.28.186.45.186.172 0 .332-.066.452-.186l.383-.382c.12-.12.186-.28.186-.451a.63.63 0 0 0-.186-.452z" />
                </svg>
              </div>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

// Zero Edge Badge component - clickable to open modal
interface ZeroEdgeBadgeProps {
  className?: string;
}

export function ZeroEdgeBadge({ className = '' }: ZeroEdgeBadgeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-4 text-b-md text-dark-200 font-bold hover:text-light-200 transition-colors cursor-pointer ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 14 14"
          className="ms-h-full ms-w-full size-16"
        >
          <g clipPath="url(#icon-duel-house-edge_svg__a)">
            <path d="M6.663.082a.73.73 0 0 1 .775.064l6.27 4.702a.73.73 0 1 1-.878 1.169l-.277-.208v5.37a2.82 2.82 0 0 1-2.821 2.82H4.267a2.82 2.82 0 0 1-2.821-2.82v-5.37l-.277.208a.731.731 0 1 1-.877-1.17L6.56.148zm.336 4.828q-1.245 0-1.928.818t-.684 2.316q0 1.495.684 2.317.683.819 1.928.818 1.245 0 1.93-.818.683-.822.683-2.317 0-1.497-.683-2.316-.684-.818-1.93-.818m1.02 3.3q-.022.824-.265 1.287-.263.505-.755.505-.49 0-.758-.505a2 2 0 0 1-.123-.31zm-1.02-2.123q.492 0 .755.505.074.14.126.312l-1.901.986q.02-.834.262-1.298.268-.504.758-.505" />
          </g>
          <defs>
            <clipPath id="icon-duel-house-edge_svg__a">
              <path d="M0 0h14v14H0z" />
            </clipPath>
          </defs>
        </svg>
        <span>Zero Edge</span>
      </button>

      <ZeroEdgeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
