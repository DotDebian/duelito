'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bet, CurrencyType } from '@/types';

type TabType = 'all' | 'high-rollers';

const GameIcons: Record<string, React.ReactNode> = {
  dice: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="h-full w-full">
      <path fillRule="evenodd" d="M3.143 1.143a2 2 0 0 0-2 2v9.714a2 2 0 0 0 2 2h9.714a2 2 0 0 0 2-2V3.143a2 2 0 0 0-2-2zM8 9.37A1.371 1.371 0 1 0 8 6.63 1.371 1.371 0 0 0 8 9.37M12.572 4.8a1.371 1.371 0 1 1-2.743 0 1.371 1.371 0 0 1 2.743 0M11.2 12.571a1.371 1.371 0 1 0 0-2.742 1.371 1.371 0 0 0 0 2.742M6.172 4.8a1.371 1.371 0 1 1-2.743 0 1.371 1.371 0 0 1 2.743 0M4.8 12.571a1.371 1.371 0 1 0 0-2.742 1.371 1.371 0 0 0 0 2.742" clipRule="evenodd" />
    </svg>
  ),
  blackjack: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
      <g clipPath="url(#icon-blackjack)">
        <path d="M3.433 9.052a1.73 1.73 0 0 0 .616 1.82c.18.14.386.24.606.3l4.39 1.175-.023.007-6.084 1.63a.48.48 0 0 1-.587-.34L.016 4.937a.48.48 0 0 1 .172-.506.5.5 0 0 1 .168-.082L5.029 3.1zM7.56.33zl6.084 1.629a.48.48 0 0 1 .34.588l-2.335 8.707a.48.48 0 0 1-.587.34L4.98 9.964a.48.48 0 0 1-.34-.587L6.973.669a.48.48 0 0 1 .587-.34m2.89 3.65a.727.727 0 0 0-.957-.257l-1.773.94c-.575.308-.734.974-.555 1.508.09.268.265.509.521.659.218.128.49.188.808.147l-.44.883a.09.09 0 0 0-.002.074c.01.024.032.041.057.048l1.408.377a.09.09 0 0 0 .072-.014.09.09 0 0 0 .036-.064l.061-.985c.254.193.52.277.772.275.297-.002.57-.123.782-.31.42-.373.617-1.028.274-1.582z" />
      </g>
      <defs>
        <clipPath id="icon-blackjack">
          <path d="M0 0h14v14H0z" />
        </clipPath>
      </defs>
    </svg>
  ),
  casino: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
      <g clipPath="url(#icon-casino)">
        <path d="M6.364 4.25a.935.935 0 0 1 1.274 0l1.888 1.758c.61.573.585 1.452.186 2.055-.201.303-.5.544-.868.645-.314.086-.67.07-1.05-.086l.252 1.245a.11.11 0 0 1-.11.133H6.064a.11.11 0 0 1-.109-.133l.252-1.243c-.38.156-.738.172-1.051.086a1.53 1.53 0 0 1-.868-.645c-.399-.604-.423-1.483.189-2.057zM3.278 11.348a.52.52 0 0 1 .67-.043c.629.447 1.36.76 2.15.895a.546.546 0 0 1 .456.535v1.28a6.97 6.97 0 0 1-4.205-1.74zM10.04 11.305a.52.52 0 0 1 .669.043l.928.927a6.97 6.97 0 0 1-4.205 1.74v-1.28c0-.27.2-.49.456-.535a5.25 5.25 0 0 0 2.151-.895M1.29 7.457c.258 0 .47.206.516.47.135.77.438 1.483.87 2.1.157.223.147.536-.045.727l-.903.902A6.94 6.94 0 0 1-.014 7.457zM14 7.457a6.94 6.94 0 0 1-1.742 4.199l-.903-.902c-.192-.191-.202-.504-.045-.727.432-.617.735-1.33.87-2.1.046-.264.259-.47.517-.47zM2.631 3.284c.192.192.202.505.046.728a5.2 5.2 0 0 0-.87 2.1c-.047.263-.26.47-.517.47H-.014a6.94 6.94 0 0 1 1.742-4.2zM12.258 2.383A6.94 6.94 0 0 1 14 6.58h-1.303c-.258 0-.47-.206-.517-.47a5.2 5.2 0 0 0-.87-2.1c-.157-.222-.146-.535.045-.727zM10.709 2.666a.52.52 0 0 1-.67.043 5.25 5.25 0 0 0-2.151-.895.546.546 0 0 1-.456-.534V0a6.97 6.97 0 0 1 4.205 1.739zM3.947 2.71a.52.52 0 0 1-.67-.044L2.35 1.74A6.97 6.97 0 0 1 6.554 0v1.28c0 .269-.2.49-.455.534a5.25 5.25 0 0 0-2.152.895" />
      </g>
    </svg>
  ),
  plinko: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
      <circle cx="7" cy="2" r="1.5" />
      <circle cx="4" cy="5" r="1.5" />
      <circle cx="10" cy="5" r="1.5" />
      <circle cx="1" cy="8" r="1.5" />
      <circle cx="7" cy="8" r="1.5" />
      <circle cx="13" cy="8" r="1.5" />
      <circle cx="4" cy="11" r="1.5" />
      <circle cx="10" cy="11" r="1.5" />
    </svg>
  ),
  crash: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
      <path d="M1 12L6 7L8 9L13 3M13 3V7M13 3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  mines: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
      <circle cx="7" cy="7" r="4" />
      <line x1="7" y1="1" x2="7" y2="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="7" y1="11" x2="7" y2="13" stroke="currentColor" strokeWidth="1.5" />
      <line x1="1" y1="7" x2="3" y2="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="11" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2.75" y1="2.75" x2="4.25" y2="4.25" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9.75" y1="9.75" x2="11.25" y2="11.25" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2.75" y1="11.25" x2="4.25" y2="9.75" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9.75" y1="4.25" x2="11.25" y2="2.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  keno: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
      <rect x="1" y="1" width="5" height="5" rx="1" />
      <rect x="8" y="1" width="5" height="5" rx="1" />
      <rect x="1" y="8" width="5" height="5" rx="1" />
      <rect x="8" y="8" width="5" height="5" rx="1" />
    </svg>
  ),
};

const CurrencyIcons: Record<CurrencyType, React.ReactNode> = {
  usdc: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 2000 2000" className="h-full w-full">
      <path fill="#2775ca" d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000" />
      <path fill="#fff" d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84" />
      <path fill="#fff" d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5m441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67" />
    </svg>
  ),
  usdt: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 339.43 295.27" className="h-full w-full">
      <path d="m62.15 1.45-61.89 130a2.52 2.52 0 0 0 .54 2.94l167.15 160.17a2.55 2.55 0 0 0 3.53 0L338.63 134.4a2.52 2.52 0 0 0 .54-2.94l-61.89-130A2.5 2.5 0 0 0 275 0H64.45a2.5 2.5 0 0 0-2.3 1.45" style={{ fill: '#50af95', fillRule: 'evenodd' }} />
      <path d="M191.19 144.8c-1.2.09-7.4.46-21.23.46-11 0-18.81-.33-21.55-.46-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25 74.24-18.15v28.91c2.78.2 10.74.67 21.74.67 13.2 0 19.81-.55 21-.66v-28.9c42.42 1.89 74.08 9.29 74.08 18.13s-31.65 16.24-74.08 18.12Zm0-39.25V79.68h59.2V40.23H89.21v39.45h59.19v25.86c-48.11 2.21-84.29 11.74-84.29 23.16s36.18 20.94 84.29 23.16v82.9h42.78v-82.93c48-2.21 84.12-11.73 84.12-23.14s-36.09-20.93-84.12-23.15Zm0 0" style={{ fill: '#fff', fillRule: 'evenodd' }} />
    </svg>
  ),
  sol: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 128 128" className="h-full w-full">
      <defs>
        <linearGradient id="sol-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="50%" stopColor="#14F195" />
          <stop offset="100%" stopColor="#00FFA3" />
        </linearGradient>
      </defs>
      <circle cx="64" cy="64" r="64" fill="url(#sol-gradient)" />
      <path fill="#fff" d="M36.5 82.5h55l-10 10h-55l10-10zM36.5 35.5h55l-10 10h-55l10-10zM81.5 59h-55l10-10h55l-10 10z" />
    </svg>
  ),
  eth: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 32 32" className="h-full w-full">
      <g fillRule="evenodd">
        <circle cx="50%" cy="50%" r="50%" fill="#627EEA" />
        <g fill="#FFF">
          <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z" />
          <path d="M16.498 4 9 16.22l7.498-3.35z" />
          <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z" />
          <path d="M16.498 27.995v-6.028L9 17.616z" />
          <path fillOpacity=".2" d="m16.498 20.573 7.497-4.353-7.497-3.348z" />
          <path fillOpacity=".602" d="m9 16.22 7.498 4.353v-7.701z" />
        </g>
      </g>
    </svg>
  ),
  ltc: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0.847 0.876 329.254 329.256" className="h-full w-full">
      <path fill="#bebebe" d="M330.102 165.503c0 90.922-73.705 164.629-164.626 164.629S.848 256.425.848 165.503 74.554.876 165.476.876c90.92 0 164.626 73.706 164.626 164.627" />
      <path fill="#bebebe" d="M295.15 165.505c0 71.613-58.057 129.675-129.674 129.675-71.616 0-129.677-58.062-129.677-129.675 0-71.619 58.061-129.677 129.677-129.677 71.618 0 129.674 58.057 129.674 129.677" />
      <path fill="#fff" d="m155.854 209.482 10.693-40.264 25.316-9.249 6.297-23.663-.215-.587-24.92 9.104 17.955-67.608h-50.921l-23.481 88.23-19.605 7.162-6.478 24.395 19.59-7.156-13.839 51.998h135.521l8.688-32.362z" />
    </svg>
  ),
  xrp: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="h-full w-full">
      <rect fill="#23292F" rx="7" width="14" height="14" />
      <g fill="#fff" clipPath="url(#icon-xrp)">
        <path d="M9.475 4.083h1.011L8.381 6.181c-.763.76-1.999.76-2.762 0L3.513 4.083h1.012l1.6 1.594a1.24 1.24 0 0 0 1.749 0zM4.512 9.917H3.5l2.12-2.111a1.96 1.96 0 0 1 2.76 0l2.12 2.11H9.488L7.875 8.31a1.24 1.24 0 0 0-1.749 0z" />
      </g>
      <defs>
        <clipPath id="icon-xrp">
          <path fill="#fff" d="M3.5 4.083h7v5.833h-7z" />
        </clipPath>
      </defs>
    </svg>
  ),
  duel: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 15 14" className="h-full w-full">
      <path fill="#EF0027" d="M7.875 14a7 7 0 1 0 0-14 7 7 0 0 0 0 14" />
      <path fill="#fff" d="M10.47 4.337 4.156 3.175l3.323 8.361 4.63-5.64zm-.101.512.966.918-2.642.478zm-2.25 1.3L5.335 3.84l4.55.838zm-.198.409-.454 3.754L5.019 4.15zm.42.199 2.926-.53-3.356 4.088z" />
    </svg>
  ),
};

function formatCurrency(value: number): string {
  if (value >= 1000) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${value.toFixed(2)}`;
}

interface BetRowProps {
  bet: Bet;
}

function BetRow({ bet }: BetRowProps) {
  const gameIcon = GameIcons[bet.gameIcon] || GameIcons.casino;
  const currencyIcon = CurrencyIcons[bet.currency];

  const isWin = bet.payout !== null && bet.payout > bet.wager;
  const isPartialWin = bet.payout !== null && bet.payout > 0 && bet.payout < bet.wager;

  let payoutColorClass = 'text-light-000';
  if (isWin) {
    payoutColorClass = 'text-green-600';
  } else if (isPartialWin) {
    payoutColorClass = 'text-dark-200';
  }

  return (
    <tr className="h-[48px] cursor-pointer bg-dark-600 first-of-type:font-semibold first-of-type:!font-normal">
      <td valign="middle" className="max-w-[1px] whitespace-nowrap px-8 first-of-type:pl-16 last-of-type:pr-16 text-light-000 lg:px-16">
        <div className="flex items-center justify-start truncate">
          <div className="flex items-center gap-8 truncate">
            <div className="size-[16px] shrink-0">{gameIcon}</div>
            <span className="truncate">{bet.game}</span>
          </div>
        </div>
      </td>
      <td valign="middle" className="whitespace-nowrap px-8 first-of-type:pl-16 last-of-type:pr-16 lg:px-16">
        <div className="flex items-center justify-start">
          <div className="flex h-[46px] cursor-pointer items-center text-light-000 hover:opacity-80">
            {bet.player}
          </div>
        </div>
      </td>
      <td valign="middle" className="whitespace-nowrap px-8 first-of-type:pl-16 last-of-type:pr-16 font-bold lg:px-16">
        <div className="flex items-center justify-end">
          <span className="inline-flex items-center justify-center gap-4 tabular-nums">
            <div className="flex size-16 shrink-0 items-center justify-center">{currencyIcon}</div>
            <span>{formatCurrency(bet.wager)}</span>
          </span>
        </div>
      </td>
      <td valign="middle" className="max-w-[1px] whitespace-nowrap px-8 first-of-type:pl-16 last-of-type:pr-16 lg:px-16">
        <div className="flex items-center justify-end truncate">{bet.multiplier}x </div>
      </td>
      <td valign="middle" className="whitespace-nowrap px-8 first-of-type:pl-16 last-of-type:pr-16 font-bold lg:px-16">
        <div className="flex items-center justify-end">
          {bet.payout !== null ? (
            <span className={`inline-flex items-center justify-center gap-4 tabular-nums ${payoutColorClass}`}>
              <div className="flex size-16 shrink-0 items-center justify-center">{currencyIcon}</div>
              <span>{formatCurrency(bet.payout)}</span>
            </span>
          ) : (
            <span>-</span>
          )}
        </div>
      </td>
      <td valign="middle" className="w-1/12 whitespace-nowrap px-8 text-light-000 first-of-type:pl-16 last-of-type:pr-16 md:w-2/12 lg:px-16">
        <div className="flex items-center justify-end">{bet.id}</div>
      </td>
    </tr>
  );
}

export function LiveBetsFeed() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isLive, setIsLive] = useState(true);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBets = useCallback(async () => {
    try {
      const url = activeTab === 'high-rollers' ? '/api/bets?type=high-rollers' : '/api/bets';
      const response = await fetch(url);
      const data = await response.json();
      setBets(data.bets);
    } catch (error) {
      console.error('Failed to fetch bets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      fetchBets();
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, fetchBets]);

  const tabWidth = activeTab === 'all' ? 75 : 105;
  const tabOffset = activeTab === 'all' ? 4 : 81;

  return (
    <div className="mx-auto w-[94%] max-w-[1260px] pb-32">
      <div className="w-full transition-all duration-150 [overflow-anchor:none]">
        <div>
          <section className="overflow-hidden pt-16 md:pt-32">
            <div className="relative w-full">
              <div className="relative flex flex-col gap-16 md:gap-16">
                <div className="relative flex flex-wrap-reverse items-center justify-between gap-8">
                  {/* Tab List */}
                  <div
                    role="tablist"
                    aria-orientation="horizontal"
                    className="relative inline-flex h-[48px] gap-4 rounded-12 bg-dark-600 p-4"
                  >
                    <div
                      className="absolute left-0 top-[4px] z-10 h-[calc(100%-8px)] transform rounded-8 bg-dark-400 transition-all duration-200"
                      style={{ width: `${tabWidth}px`, transform: `translateX(${tabOffset}px)`, willChange: 'transform, width' }}
                    />
                    <button
                      role="tab"
                      type="button"
                      aria-selected={activeTab === 'all'}
                      onClick={() => setActiveTab('all')}
                      className={`z-20 flex size-full cursor-pointer items-center justify-center gap-8 text-nowrap rounded-8 px-[12px] py-8 text-b-md font-semibold outline-none transition-all duration-100 focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-30 ${
                        activeTab === 'all' ? 'text-light-000 brightness-200' : 'text-dark-200 brightness-100 hover:text-light-000'
                      }`}
                    >
                      All Bets
                    </button>
                    <button
                      role="tab"
                      type="button"
                      aria-selected={activeTab === 'high-rollers'}
                      onClick={() => setActiveTab('high-rollers')}
                      className={`z-20 flex size-full cursor-pointer items-center justify-center gap-8 text-nowrap rounded-8 px-[12px] py-8 text-b-md font-semibold outline-none transition-all duration-100 focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-30 ${
                        activeTab === 'high-rollers' ? 'text-light-000 brightness-200' : 'text-dark-200 brightness-100 hover:text-light-000'
                      }`}
                    >
                      High Rollers
                    </button>
                  </div>

                  {/* Live Bets Toggle */}
                  <div className="flex items-center gap-12">
                    <div className="flex items-center gap-8">
                      <span className={`inline-block h-[8px] w-[8px] rounded-full transition-all duration-200 ${isLive ? 'bg-green-600' : 'bg-dark-200'}`} />
                      <span className="whitespace-nowrap text-[12px] font-semibold text-light-000">Live Bets</span>
                    </div>
                    <input
                      className="relative ml-8 h-[22px] w-[36px] cursor-pointer appearance-none rounded-[11px] bg-dark-700 p-[2px] text-dark-200 before:absolute before:left-[2px] before:top-1/2 before:size-[18px] before:translate-x-0 before:translate-y-[-50%] before:rounded-full before:bg-current before:transition-all before:duration-150 checked:bg-blue-600 checked:text-light-000 checked:before:left-[16px] disabled:cursor-not-allowed"
                      type="checkbox"
                      role="switch"
                      checked={isLive}
                      onChange={(e) => setIsLive(e.target.checked)}
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden">
                  <div className="mt-16 max-h-[552px] overflow-y-hidden rounded-12 scrollbar-none md:mt-32">
                    <table className="live-bet-feed-table w-full overflow-hidden rounded-12 border-separate text-dark-200 !text-b-md" style={{ borderSpacing: '0px 2px' }}>
                      <thead className="relative z-[2] [transform:translateZ(0)]">
                        <tr className="relative h-[48px] bg-dark-600 !bg-dark-700 first-of-type:font-semibold">
                          <td valign="middle" className="min-w-[160px] whitespace-nowrap px-8 first-of-type:pl-16 last-of-type:pr-16 max-sm:min-w-[44vw] md:w-2/12 lg:px-16">
                            <div className="flex items-center justify-start">Game</div>
                          </td>
                          <td valign="middle" className="w-5/12 whitespace-nowrap px-8 first-of-type:pl-16 last-of-type:pr-16 md:w-2/12 lg:px-16">
                            <div className="flex items-center justify-start">Player</div>
                          </td>
                          <td valign="middle" className="min-w-[140px] whitespace-nowrap px-8 first-of-type:pl-16 last-of-type:pr-16 md:w-2/12 lg:px-16">
                            <div className="flex items-center justify-end">Wager</div>
                          </td>
                          <td valign="middle" className="min-w-[68px] whitespace-nowrap px-8 first-of-type:pl-16 last-of-type:pr-16 md:w-1/12 lg:px-16">
                            <div className="flex items-center justify-end">Multi</div>
                          </td>
                          <td valign="middle" className="w-5/12 min-w-[140px] whitespace-nowrap px-8 first-of-type:pl-16 last-of-type:pr-16 md:w-2/12 lg:px-16">
                            <div className="flex items-center justify-end">Payout</div>
                          </td>
                          <td valign="middle" className="min-w-[80px] whitespace-nowrap px-8 first-of-type:pl-16 last-of-type:pr-16 md:w-1/12 lg:px-16">
                            <div className="flex items-center justify-end">Bet ID</div>
                          </td>
                        </tr>
                      </thead>
                      <tbody className="animation-properties relative z-[1]">
                        {isLoading ? (
                          <tr>
                            <td colSpan={6} className="py-16 text-center text-dark-200">Loading...</td>
                          </tr>
                        ) : bets.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-16 text-center text-dark-200">No bets found</td>
                          </tr>
                        ) : (
                          bets.map((bet) => <BetRow key={bet.id} bet={bet} />)
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
