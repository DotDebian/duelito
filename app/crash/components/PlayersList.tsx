'use client';

import { memo } from 'react';
import type { CrashPlayer, CrashPhase } from '../types';

interface PlayersListProps {
  players: CrashPlayer[];
  phase: CrashPhase;
  totalBets: number;
}

// Currency USD icon
const CurrencyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="h-full w-full">
    <path fill="#2B63F4" d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0" />
    <path
      fill="#fff"
      d="M6.927 11.705a.2.2 0 0 1-.2-.2V2.45c0-.11.09-.2.2-.2h.206c.11 0 .2.09.2.2v9.055a.2.2 0 0 1-.2.2zm1.727-6.43c-.103 0-.186-.078-.212-.177a1 1 0 0 0-.404-.577q-.381-.27-.99-.27-.428 0-.735.13-.306.13-.469.35a.85.85 0 0 0-.059.917 1 1 0 0 0 .3.295q.188.118.417.2t.461.136l.71.178q.428.099.823.27.398.168.713.428.317.258.502.624.185.365.185.857 0 .665-.34 1.17-.34.502-.982.787-.639.28-1.548.28-.883 0-1.533-.273a2.3 2.3 0 0 1-1.012-.797 2.3 2.3 0 0 1-.376-1.07.19.19 0 0 1 .193-.208h.954c.105 0 .19.08.211.184q.056.274.219.473.214.262.557.392.348.129.776.129.447 0 .783-.133a1.27 1.27 0 0 0 .532-.377.9.9 0 0 0 .196-.569.72.72 0 0 0-.174-.487 1.3 1.3 0 0 0-.476-.325 4.6 4.6 0 0 0-.71-.236l-.86-.222q-.934-.24-1.477-.728-.54-.491-.54-1.303 0-.669.362-1.171.366-.502.994-.78.627-.28 1.422-.28.805 0 1.41.28a2.3 2.3 0 0 1 .957.773q.291.411.346.927a.187.187 0 0 1-.191.203z"
    />
  </svg>
);

// USDC icon
const USDCIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" className="h-full w-full">
    <path fill="#2775ca" d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000" />
    <path fill="#fff" d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84" />
    <path fill="#fff" d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5m441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67" />
  </svg>
);

// Default user icon
const DefaultUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0.583 0.583 12.834 12.834" className="h-full w-full">
    <g clipPath="url(#icon-user)">
      <path
        fillRule="evenodd"
        d="M13.417 7c0 1.72-.678 3.283-1.78 4.435a6.4 6.4 0 0 1-4.618 1.982H6.98a6.4 6.4 0 0 1-4.617-1.982A6.417 6.417 0 1 1 13.417 7m-2.528 3.208A5.03 5.03 0 0 0 7 8.375a5.03 5.03 0 0 0-3.89 1.833A5.03 5.03 0 0 0 7 12.042a5.03 5.03 0 0 0 3.89-1.834M7 7.458a2.292 2.292 0 1 0 0-4.583 2.292 2.292 0 0 0 0 4.583"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="icon-user">
        <path d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const PlayersList = memo(function PlayersList({
  players,
  phase,
  totalBets,
}: PlayersListProps) {
  return (
    <div className="relative mt-2 flex h-full min-h-[200px] w-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <div className="text-h-xs text-dark-300">{players.length} Players</div>
        <div className="flex items-center gap-4 text-h-xs text-light-000">
          <div className="size-16">
            <CurrencyIcon />
          </div>
          <div>{totalBets.toFixed(2)}</div>
        </div>
      </div>

      {/* Players list */}
      <div className="grow overflow-x-hidden overflow-y-scroll rounded-[12px] bg-dark-600 py-8 pl-16 pr-4 scrollbar-none">
        {players.map((player) => {
          const hasCashedOut = !!player.cashedOutAt;
          const hasLost = phase === 'crashed' && !hasCashedOut;
          const winAmount = hasCashedOut ? player.betAmount * (player.cashedOutMultiplier || 1) : 0;

          return (
            <div
              key={player.id}
              className="flex items-center justify-between py-4"
            >
              {/* Avatar + Username */}
              <div className="flex w-1/3 cursor-pointer items-center gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-dark-700 text-dark-400" style={{ display: player.avatarUrl ? 'none' : 'block' }}>
                    <DefaultUserIcon />
                  </div>
                  {player.avatarUrl && (
                    <img
                      src={player.avatarUrl}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                </div>
                <span className="truncate text-h-xs">{player.username}</span>
              </div>

              {/* Multiplier */}
              <div className={`flex w-1/4 items-center justify-end px-4 text-h-xs ${
                hasCashedOut ? 'text-green-600' : hasLost ? 'text-red-500' : 'text-dark-300'
              }`}>
                {hasCashedOut ? `${player.cashedOutMultiplier?.toFixed(2)}x` : hasLost ? 'Crashed' : '-'}
              </div>

              {/* Win amount */}
              <div className="flex w-5/12 items-center justify-end truncate">
                <span className={`inline-flex items-center justify-center gap-4 tabular-nums text-h-xs transition-colors duration-100 ${
                  hasCashedOut ? 'text-green-600' : hasLost ? 'text-red-500' : 'text-dark-300'
                }`}>
                  <div className="size-16">
                    <USDCIcon />
                  </div>
                  <span>${hasCashedOut ? winAmount.toFixed(2) : hasLost ? `-${player.betAmount.toFixed(2)}` : player.betAmount.toFixed(2)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
