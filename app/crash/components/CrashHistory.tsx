'use client';

import { memo, useState, useCallback } from 'react';
import type { CrashResult } from '../types';

interface CrashHistoryProps {
  results: CrashResult[];
}

const ITEMS_PER_PAGE = 10;

// Icons
const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 14 15"
    className="size-[14px]"
  >
    <path
      fillRule="evenodd"
      d="M5.286 1.783c0-.63.512-1.142 1.143-1.142h1.143c.63 0 1.142.511 1.142 1.142v11.43c0 .63-.511 1.142-1.142 1.142H6.429a1.143 1.143 0 0 1-1.143-1.143zM.143 8.641c0-.632.512-1.143 1.143-1.143h1.143c.631 0 1.143.511 1.143 1.143v4.571c0 .631-.512 1.143-1.143 1.143H1.286a1.143 1.143 0 0 1-1.143-1.143zm13.714-2.286c0-.631-.511-1.143-1.142-1.143h-1.143c-.631 0-1.143.512-1.143 1.143v6.857c0 .631.511 1.143 1.143 1.143h1.143c.63 0 1.142-.512 1.142-1.143z"
      clipRule="evenodd"
    />
  </svg>
);

const CrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 182.74 182.74" className="h-full w-full">
    <path d="M170.006 58.37h-55.649l.013-29.764c0-8.608-4.652-13.881-13.813-15.778C99.107 5.612 96.164 0 91.541 0c-4.653 0-7.605 5.686-9.045 12.971-8.71 2.014-13.126 7.242-13.126 15.635V58.37H12.734c-4.061 0-7.364 3.469-7.364 7.733v13.883c0 3.872 2.931 7.64 6.679 8.58l18.663 4.637c2.909.73 7.602 1.167 10.458 1.167h30.395c.849 8.911 1.623 18.373 1.623 23.288 0 4.185 1.318 9.516 1.374 9.74l6.189 20.412-19.643 5.618c-2.657.735-4.738 3.463-4.738 6.21v5.63c0 2.909 2.376 5.103 5.527 5.103H84.32c1.649 8.539 3.884 12.37 7.221 12.37s5.572-3.831 7.221-12.37h22.686c2.911 0 5.923-1.909 5.923-5.103v-5.63c0-2.722-2.211-5.553-4.924-6.311l-20.206-5.682 6.516-22.229c.299-.755 1.432-3.905 1.432-8.232 0-4.811.835-14.062 1.756-22.814h29.087c2.801 0 7.403-.4 10.405-1.139l19.245-4.622c3.751-.924 6.689-4.711 6.689-8.623V66.103c-.001-4.264-3.305-7.733-7.365-7.733" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
    <path d="m8.285 7 4.363-4.362c.12-.12.186-.28.186-.452a.63.63 0 0 0-.186-.45l-.383-.383a.63.63 0 0 0-.451-.186.63.63 0 0 0-.451.186L7 5.715 2.638 1.353a.63.63 0 0 0-.451-.186.63.63 0 0 0-.451.186l-.383.382a.64.64 0 0 0 0 .903L5.716 7l-4.363 4.362a.63.63 0 0 0-.186.452c0 .17.066.33.186.45l.383.383c.12.12.28.186.45.186.172 0 .332-.066.452-.186L7 8.285l4.363 4.362c.12.12.28.186.45.186.172 0 .332-.066.452-.186l.383-.382c.12-.12.186-.28.186-.451a.63.63 0 0 0-.186-.452z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" className="h-full w-full">
    <g clipPath="url(#icon-duel-link-external_svg__a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 2.762H3.286a.524.524 0 0 0-.524.524v9.428a.524.524 0 0 0 .524.524h9.428a.524.524 0 0 0 .524-.524V8a1.048 1.048 0 0 1 2.095 0v4.714a2.62 2.62 0 0 1-2.619 2.62H3.286a2.62 2.62 0 0 1-2.62-2.62V3.286a2.62 2.62 0 0 1 2.62-2.62H8a1.048 1.048 0 1 1 0 2.096M10.66.99a.52.52 0 0 1 .484-.323h3.667a.524.524 0 0 1 .523.523v3.667a.523.523 0 0 1-.894.371l-1.092-1.094-4.606 4.607a1.048 1.048 0 0 1-1.482-1.482l4.606-4.606-1.093-1.092a.52.52 0 0 1-.113-.57"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="icon-duel-link-external_svg__a">
        <path fill="currentColor" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${displayHours}:${minutes} ${ampm} ${day}/${month}/${year}`;
}

// Modal
function CrashHistoryModal({ results, onClose }: { results: CrashResult[]; onClose: () => void }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(results.length / ITEMS_PER_PAGE));
  const pageResults = results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const maxVisiblePages = 5;
  const startPage = Math.max(1, Math.min(page - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <>
      {/* Backdrop */}
      <div
        className="pointer-events-auto fixed inset-0 bg-dark-900/90"
        style={{ zIndex: 103 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 m-auto flex items-center justify-center transition-all duration-300"
        style={{ zIndex: 104 }}
      >
        <div className="absolute inset-0" onClick={onClose} />
        <div
          className="relative w-[440px] flex flex-col z-10 touch-none rounded-12 bg-dark-500"
          style={{ maxWidth: 'unset', transform: 'translateY(0%)', transition: 'transform 0.3s', touchAction: 'none', userSelect: 'none' }}
        >
          <div className="flex h-full flex-col overflow-hidden rounded-12">
            {/* Header */}
            <div>
              <div className="flex flex-col gap-8 px-16 py-32 sm:px-32">
                <h2 className="flex items-center gap-8 text-h-md text-light-000">
                  <div className="size-[20px] text-dark-200">
                    <CrashIcon />
                  </div>
                  Crash History
                </h2>
              </div>
            </div>

            {/* Body */}
            <div className="scrollbar overflow-y-auto flex flex-1 flex-col justify-between overflow-x-hidden px-16 pb-16 pt-0 sm:px-32 sm:pb-32">
              <div>
                <table className="w-full overflow-hidden rounded-12 text-dark-200 text-b-md" style={{ borderSpacing: 0 }}>
                  <thead>
                    <tr className="h-[48px] bg-dark-500 font-semibold">
                      <td valign="middle" className="whitespace-nowrap px-8 first:pl-16 last:pr-16 lg:px-16">
                        <div className="flex items-center justify-start">Time</div>
                      </td>
                      <td valign="middle" className="whitespace-nowrap px-8 first:pl-16 last:pr-16 lg:px-16">
                        <div className="flex items-center justify-end">Multiplier</div>
                      </td>
                      <td valign="middle" className="whitespace-nowrap px-8 first:pl-16 last:pr-16 lg:px-16">
                        <div className="flex items-center justify-end w-[55px]">Verify</div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {pageResults.map((result) => {
                      const isGreen = result.crashMultiplier >= 2;
                      return (
                        <tr key={result.id} className="h-[42px] odd:bg-dark-600 even:bg-dark-500">
                          <td valign="middle" className="whitespace-nowrap px-8 first:pl-16 last:pr-16 lg:px-16">
                            <div className="flex items-center justify-start">{formatTime(result.timestamp)}</div>
                          </td>
                          <td valign="middle" className={`whitespace-nowrap px-8 first:pl-16 last:pr-16 lg:px-16 font-semibold ${isGreen ? 'text-green-600' : ''}`}>
                            <div className="flex items-center justify-end">{result.crashMultiplier.toFixed(2)}x</div>
                          </td>
                          <td valign="middle" className="whitespace-nowrap px-8 first:pl-16 last:pr-16 lg:px-16 w-[55px]">
                            <div className="flex items-center justify-end">
                              <button className="touch-manipulation outline-none text-dark-100 hover:text-light-000 hover:bg-dark-600 active:text-light-000 px-[10px] h-[32px] text-b-sm font-semibold flex items-center justify-center rounded-8 py-8 transition-all cursor-pointer">
                                <span className="flex items-center justify-center w-full gap-4">
                                  <div className="flex shrink-0 items-center justify-center size-[14px]">
                                    <ExternalLinkIcon />
                                  </div>
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-[28px] flex w-full justify-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="touch-manipulation outline-none min-w-[40px] whitespace-nowrap text-dark-100 hover:text-light-000 hover:enabled:bg-dark-300 active:text-light-000 disabled:text-light-000 disabled:opacity-50 px-[12px] h-[40px] text-b-md font-semibold flex items-center justify-center rounded-8 py-8 transition-all disabled:cursor-not-allowed cursor-pointer"
                    >
                      Prev
                    </button>
                    {visiblePages.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`touch-manipulation outline-none min-w-[40px] px-[12px] h-[40px] text-b-md font-semibold flex items-center justify-center rounded-8 py-8 cursor-pointer ${
                          p === page
                            ? 'bg-dark-400 text-light-000 hover:bg-dark-400 hover:cursor-default'
                            : 'text-dark-100 hover:text-light-000 hover:bg-dark-300 active:text-light-000 transition-none'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="touch-manipulation outline-none min-w-[40px] whitespace-nowrap text-dark-100 hover:text-light-000 hover:enabled:bg-dark-300 active:text-light-000 disabled:text-light-000 disabled:opacity-50 px-[12px] h-[40px] text-b-md font-semibold flex items-center justify-center rounded-8 py-8 transition-all disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="touch-manipulation outline-none absolute right-[14px] top-[14px] z-10 cursor-pointer !px-16 text-dark-100 hover:text-light-000 hover:bg-dark-600 active:text-light-000 px-[24px] h-[48px] text-b-lg font-bold flex items-center justify-center rounded-8 py-8 transition-all"
          >
            <span className="flex items-center justify-center w-full gap-8">
              <div className="size-16">
                <CloseIcon />
              </div>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export const CrashHistory = memo(function CrashHistory({ results }: CrashHistoryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = useCallback(() => setIsModalOpen(true), []);
  const handleClose = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <div className="absolute z-10 flex w-[75%] flex-row-reverse items-center gap-x-16 overflow-hidden self-start">
        <button
          type="button"
          onClick={handleOpen}
          className="flex h-[32px] cursor-pointer items-center justify-center rounded-8 bg-dark-600 px-[10px] text-dark-200 transition-all hover:bg-dark-500 hover:text-light-000"
        >
          <ChartIcon />
        </button>
        {results.slice(0, 15).map((result) => {
          const isGreen = result.crashMultiplier >= 2;
          return (
            <div
              key={result.id}
              className={`flex cursor-pointer flex-col items-center justify-center transition-colors duration-150 ${
                isGreen
                  ? 'text-green-600 hover:text-green-500'
                  : 'text-dark-300 hover:text-dark-200'
              }`}
            >
              <div className="text-h-xs">{result.crashMultiplier.toFixed(2)}x</div>
            </div>
          );
        })}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-32 bg-gradient-to-r from-dark-900 to-transparent" />
      </div>

      {isModalOpen && <CrashHistoryModal results={results} onClose={handleClose} />}
    </>
  );
});