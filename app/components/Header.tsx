'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useBalance } from '@/app/contexts/BalanceContext';

const originalsGames = [
  {
    name: 'Dice',
    href: '/dice',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="h-full w-full">
        <path fillRule="evenodd" d="M3.143 1.143a2 2 0 0 0-2 2v9.714a2 2 0 0 0 2 2h9.714a2 2 0 0 0 2-2V3.143a2 2 0 0 0-2-2zM8 9.37A1.371 1.371 0 1 0 8 6.63 1.371 1.371 0 0 0 8 9.37M12.572 4.8a1.371 1.371 0 1 1-2.743 0 1.371 1.371 0 0 1 2.743 0M11.2 12.571a1.371 1.371 0 1 0 0-2.742 1.371 1.371 0 0 0 0 2.742M6.172 4.8a1.371 1.371 0 1 1-2.743 0 1.371 1.371 0 0 1 2.743 0M4.8 12.571a1.371 1.371 0 1 0 0-2.742 1.371 1.371 0 0 0 0 2.742" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Blackjack',
    href: '/blackjack',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
        <g clipPath="url(#icon-duel-blackjack_svg__a)">
          <path d="M3.433 9.052a1.73 1.73 0 0 0 .616 1.82c.18.14.386.24.606.3l4.39 1.175-.023.007-6.084 1.63a.48.48 0 0 1-.587-.34L.016 4.937a.48.48 0 0 1 .172-.506.5.5 0 0 1 .168-.082L5.029 3.1zM7.56.33zl6.084 1.629a.48.48 0 0 1 .34.588l-2.335 8.707a.48.48 0 0 1-.587.34L4.98 9.964a.48.48 0 0 1-.34-.587L6.973.669a.48.48 0 0 1 .587-.34m2.89 3.65a.727.727 0 0 0-.957-.257l-1.773.94c-.575.308-.734.974-.555 1.508.09.268.265.509.521.659.218.128.49.188.808.147l-.44.883a.09.09 0 0 0-.002.074c.01.024.032.041.057.048l1.408.377a.09.09 0 0 0 .072-.014.09.09 0 0 0 .036-.064l.061-.985c.254.193.52.277.772.275.297-.002.57-.123.782-.31.42-.373.617-1.028.274-1.582z" />
        </g>
        <defs>
          <clipPath id="icon-duel-blackjack_svg__a">
            <path d="M0 0h14v14H0z" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    name: 'Plinko',
    href: '/plinko',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="h-full w-full">
        <path fill="currentColor" d="M13.405 9.205a4.088 4.088 0 1 1-8.176 0 4.088 4.088 0 0 1 8.176 0" />
        <path stroke="currentColor" strokeLinecap="round" d="M8.223 3.168 5.683.708M3.312 8.912l-2.54-2.46m3.885-1.696L.595.707m12.81 8.498a4.088 4.088 0 1 1-8.176 0 4.088 4.088 0 0 1 8.176 0Z" />
      </svg>
    ),
  },
  {
    name: 'Crash',
    href: '/crash',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 182.74 182.74" className="h-full w-full">
        <path d="M170.006 58.37h-55.649l.013-29.764c0-8.608-4.652-13.881-13.813-15.778C99.107 5.612 96.164 0 91.541 0c-4.653 0-7.605 5.686-9.045 12.971-8.71 2.014-13.126 7.242-13.126 15.635V58.37H12.734c-4.061 0-7.364 3.469-7.364 7.733v13.883c0 3.872 2.931 7.64 6.679 8.58l18.663 4.637c2.909.73 7.602 1.167 10.458 1.167h30.395c.849 8.911 1.623 18.373 1.623 23.288 0 4.185 1.318 9.516 1.374 9.74l6.189 20.412-19.643 5.618c-2.657.735-4.738 3.463-4.738 6.21v5.63c0 2.909 2.376 5.103 5.527 5.103H84.32c1.649 8.539 3.884 12.37 7.221 12.37s5.572-3.831 7.221-12.37h22.686c2.911 0 5.923-1.909 5.923-5.103v-5.63c0-2.722-2.211-5.553-4.924-6.311l-20.206-5.682 6.516-22.229c.299-.755 1.432-3.905 1.432-8.232 0-4.811.835-14.062 1.756-22.814h29.087c2.801 0 7.403-.4 10.405-1.139l19.245-4.622c3.751-.924 6.689-4.711 6.689-8.623V66.103c-.001-4.264-3.305-7.733-7.365-7.733" />
      </svg>
    ),
  },
  {
    name: 'Mines',
    href: '/mines',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
        <path d="M12.785 8.827a.2.2 0 0 0-.165-.314H10.8a.2.2 0 0 1-.19-.262l2.126-6.528c.063-.196-.174-.348-.325-.21l-4.3 3.939a.2.2 0 0 1-.3-.033l-2.42-3.47a.2.2 0 0 0-.364.114v4.134a.2.2 0 0 1-.263.19L1.524 5.302a.2.2 0 0 0-.234.295l1.92 3.109a.2.2 0 0 1-.171.305H1.571a.2.2 0 0 0-.153.328l2.184 2.607a.2.2 0 0 1 .047.129v.724c0 .11.09.2.2.2H5.92a.2.2 0 0 0 .158-.323L5.03 11.33a.2.2 0 0 1 .158-.323h.559a.2.2 0 0 0 .195-.246l-.3-1.263a.2.2 0 0 1 .303-.214l.867.561a.2.2 0 0 0 .242-.019l1.124-1.009a.2.2 0 0 1 .334.151l-.013 1.338a.2.2 0 0 0 .2.202h.678a.2.2 0 0 1 .164.315l-1.303 1.863a.2.2 0 0 0 .164.315H10.4a.2.2 0 0 0 .2-.2v-.735a.2.2 0 0 1 .035-.113z" />
      </svg>
    ),
  },
  {
    name: 'Beef',
    href: '/beef',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="h-full w-full">
        <path fill="currentColor" d="M13.963 4.936c-.254-.874-1.485-.484-2.13-.412-.457.052-.902.265-.964-.185-.152-1.099-.162-2.06-1.065-3.05-.608-.668-1.309-.033-1.065.462.508 1.387.339 2.517-1.739 2.517S4.753 3.138 5.26 1.75c.245-.495-.456-1.13-1.064-.463-.904.991-.913 1.952-1.065 3.051-.063.45-.507.237-.964.185-.645-.072-1.876-.462-2.13.412-.238.82.66 2.208 2.739 2.516C3.08 7.658 2.928 13 7 13s3.92-5.342 4.224-5.548c2.08-.308 2.977-1.696 2.739-2.516" />
      </svg>
    ),
  }
];

export function Header() {
  const pathname = usePathname();
  const { balance } = useBalance();
  const [isOriginalsOpen, setIsOriginalsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openAuthModal = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const authTabWidths = {
    login: 182,
    register: 182,
  };

  const getAuthTabOffset = () => {
    return authTab === 'login' ? 4 : 190;
  };

  // Check if we're on an originals game page
  const isOnGamePage = originalsGames.some(game => pathname.startsWith(game.href));

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOriginalsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOriginalsOpen(false);
    }, 150);
  };

  const handleClick = () => {
    setIsOriginalsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOriginalsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 w-full bg-dark-900 text-light-000" style={{ zIndex: 100 }}>
      <div className="flex h-20 items-center justify-between px-16 md:px-32">
        <div className="flex items-center gap-x-64">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="68" height="26" fill="none">
              <path fill="#fff" d="M67.545 24.17h-5.718V.5h5.718zM60.08 16.258v.864H47.582c.266 2.36 1.463 3.524 3.59 3.524 1.463 0 2.46-.599 2.992-1.829l5.486.366c-.599 1.795-1.63 3.192-3.092 4.156-1.463.997-3.225 1.462-5.352 1.462-2.892 0-5.153-.83-6.815-2.56-1.662-1.695-2.493-3.922-2.493-6.648q0-4.04 2.493-6.583c1.596-1.662 3.79-2.526 6.516-2.526 2.858 0 5.086.93 6.748 2.76 1.596 1.828 2.427 4.155 2.427 7.014m-12.466-2.56h6.616c-.266-2.095-1.363-3.158-3.258-3.158-1.928 0-3.025 1.063-3.358 3.158M34.375 16.158V7.016h5.718V24.17h-5.386l-.166-2.294c-1.197 1.861-2.892 2.76-5.153 2.76-1.928 0-3.39-.533-4.454-1.63s-1.596-2.626-1.596-4.62V7.015h5.718v10.04c0 .864.2 1.562.598 2.027.4.466.964.699 1.729.699.864 0 1.596-.333 2.16-.998.533-.665.832-1.529.832-2.626M.024.5h9.974c3.656 0 6.482 1.03 8.41 3.058Q21.3 6.65 21.3 12.335c0 3.756-.93 6.682-2.759 8.743q-2.792 3.092-8.078 3.092H.024zm6.217 18.45h3.158c3.79 0 5.685-2.194 5.685-6.615 0-2.26-.499-3.956-1.463-5.053S11.128 5.62 9.067 5.62H6.24z" />
            </svg>
          </Link>

          {/* Navigation */}
          <div className="relative -ml-16 mr-8 hidden items-center lg:flex">
            {/* Active indicator pill */}
            {isOnGamePage && (
              <div
                className="absolute bottom-0 left-0 z-0 h-4 w-[10px] rounded-12 bg-blue-600 transition-all duration-150 ease-in-out"
                style={{ transform: 'translateX(56.5px)' }}
              />
            )}
            {/* Originals Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                ref={buttonRef}
                onClick={handleClick}
                className={`flex h-[40px] items-center gap-x-8 rounded-8 bg-transparent px-16 py-8 text-b-lg font-bold transition-all duration-150 md:h-[48px] md:px-16 ${
                  isOriginalsOpen || isOnGamePage ? 'text-light-000' : 'text-dark-200 hover:text-light-000'
                }`}
              >
                <div className="h-16 w-16">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14"
                       className="h-full w-full">
                    <path
                      d="M12.56 1a.376.376 0 0 1 .44.44l-.33 1.656c-.042.218-.15.417-.308.574l-7.116 7.032.527.527a.377.377 0 0 1 0 .53l-.375.375a.37.37 0 0 1-.417.078l-1.453-.646-1.317 1.318a.376.376 0 0 1-.53 0l-.562-.563a.376.376 0 0 1 0-.53l1.317-1.316-.644-1.454a.375.375 0 0 1 .077-.418l.375-.375a.377.377 0 0 1 .53 0l.56.562 6.999-7.152a1.13 1.13 0 0 1 .574-.308zm-1.802 7.714.484-.486a.377.377 0 0 1 .53 0l.375.375c.11.11.14.275.078.418l-.645 1.454 1.316 1.317a.376.376 0 0 1 0 .53l-.561.562a.377.377 0 0 1-.53 0l-1.317-1.318-1.453.646a.37.37 0 0 1-.417-.078l-.375-.375a.376.376 0 0 1 0-.53l.485-.485L8 10l2-2zM1.457 1l1.654.33c.218.042.418.15.575.308L6 4 4 6 1.653 3.67v-.002a1.13 1.13 0 0 1-.306-.575l-.333-1.65A.38.38 0 0 1 1.457 1"></path>
                  </svg>
                </div>
                <span>Originals</span>
              </button>

              <div
                className={`absolute left-0 top-full z-50 mt-1 flex min-w-[195px] flex-col gap-1 rounded-8 bg-dark-700 py-0 shadow-lg outline-none transition-all duration-200 ease-out ${
                  isOriginalsOpen
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-4 opacity-0'
                }`}
              >
                {originalsGames.map((game) => (
                  <Link
                    key={game.name}
                    href={game.href}
                    className="flex cursor-pointer items-center justify-between px-[12px] py-8 text-dark-200 transition-all duration-200 hover:bg-dark-500 hover:text-light-000"
                  >
                    <div className="flex items-center">
                      <div className="mr-8 h-16 w-16">
                        {game.icon}
                      </div>
                      <p className="text-b-md font-semibold">{game.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User Controls */}
        <div className="flex items-center gap-8">
          {/* Login Button */}
          <button
            onClick={() => openAuthModal('login')}
            className="flex h-[40px] flex-row items-center justify-center rounded-8 bg-dark-600 px-12 text-b-md font-semibold text-light-000 transition-all hover:bg-dark-500 md:h-[48px] md:px-16 md:text-b-lg md:font-bold"
          >
            Login
          </button>

          {/* Register Button */}
          <button
            onClick={() => openAuthModal('register')}
            className="flex h-[40px] flex-row items-center justify-center rounded-8 bg-blue-600 px-12 text-b-md font-semibold text-light-000 transition-all hover:bg-blue-500 md:h-[48px] md:px-16 md:text-b-lg md:font-bold"
          >
            Register
          </button>

          {/* Balance Button */}
          <button className="ml-8 flex h-[40px] items-center rounded-8 bg-dark-500 px-[12px] text-b-md font-semibold transition-all hover:bg-dark-400 disabled:opacity-50 disabled:hover:bg-dark-500 md:h-[48px] md:px-16">
            <div className="relative top-[1px] flex items-center justify-center overflow-hidden transition-all duration-300" style={{ minWidth: '57px' }}>
              <div className="text-nowrap break-keep leading-[1]">
                <span className="inline-flex items-center justify-center gap-4 tabular-nums">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 2000 2000" className="h-full w-full">
                      <path fill="#2775ca" d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000" />
                      <path fill="#fff" d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84" />
                      <path fill="#fff" d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5m441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67" />
                    </svg>
                  </div>
                  <span className="block max-w-[calc(100vw-270px)] truncate lg:max-w-[calc(100vw-895px)]">${balance.toFixed(2)}</span>
                </span>
              </div>
            </div>
            <div className="ml-4 h-16 w-16 text-dark-200 transition-all duration-200 md:ml-8">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
                <path fillRule="evenodd" d="M6.903 7.74c.053.055.14.055.194 0l3.428-3.494a.543.543 0 0 1 .775 0l.211.216a.543.543 0 0 1 0 .76L7.387 9.426a.543.543 0 0 1-.774 0L2.489 5.222a.543.543 0 0 1 0-.76l.211-.216a.543.543 0 0 1 .775 0z" clipRule="evenodd" />
              </svg>
            </div>
          </button>

          {/* Wallet Button */}
          <button className="relative flex h-[48px] flex-row items-center justify-center rounded-8 bg-blue-600 px-[24px] py-8 text-b-lg font-bold text-light-000 outline-none transition-all hover:bg-blue-500 hover:text-light-000 active:bg-blue-500 active:text-light-000 disabled:cursor-not-allowed disabled:bg-dark-400 disabled:text-light-000 disabled:opacity-50">
            <span className="flex w-full flex-row items-center justify-center gap-8">
              <div className="h-16 w-16">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
                  <path fillRule="evenodd" d="M.583 4.273c0-1.716 1.461-3.106 3.264-3.106h6.061c.257 0 .466.198.466.443v1.241H3.712a.57.57 0 0 0-.583.555c0 .306.261.555.583.555h7.072q.028 0 .055-.003h.2c.37 0 .726.14.988.39.263.25.41.588.41.941v.814h-2.75c-.769 0-1.632.554-1.632 1.503v1.579c0 .95.863 1.504 1.632 1.504h2.75v.813a1.3 1.3 0 0 1-.41.941c-.262.25-.618.39-.989.39H1.982c-.371 0-.727-.14-.989-.39a1.3 1.3 0 0 1-.41-.94zm9.104 2.939h3.264c.257 0 .466.177.466.394v1.579c0 .218-.21.395-.466.395H9.687c-.258 0-.466-.177-.466-.395V7.606c0-.217.208-.394.466-.394" clipRule="evenodd" />
                </svg>
              </div>
              Wallet
            </span>
          </button>

          {/* Profile Button */}
          <Link href="/account" className="flex-shrink-0">
            <button className="relative flex h-[48px] flex-row items-center justify-center rounded-8 bg-dark-600 px-[8px] py-8 text-b-lg font-bold text-dark-200 outline-none transition-all hover:bg-dark-500 hover:text-light-000 active:bg-dark-500 active:text-light-000 disabled:cursor-not-allowed disabled:bg-dark-600 disabled:text-light-000 disabled:opacity-50 md:px-[12px]">
              <span className="flex w-full flex-row items-center justify-center gap-8">
                <div className="relative h-[24px] w-[24px] overflow-hidden rounded-full">
                  <img
                    src="https://ui-avatars.com/api/?name=QW&background=5E6EFF&color=fff"
                    className="absolute inset-0 h-full w-full"
                    alt="Profile"
                  />
                </div>
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 m-auto flex items-center justify-center transition-all duration-300" style={{ zIndex: 103 }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeAuthModal}
          />

          {/* Modal */}
          <div
            className="relative z-10 flex w-[440px] max-w-[90vw] touch-none flex-col rounded-12 bg-dark-500"
            style={{ maxWidth: '480px' }}
          >

            <div className="flex h-full flex-col overflow-hidden rounded-12">
              <div className="pt-[80px] md:pt-32" />

              <div className="scrollbar flex flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden px-16 pb-16 pt-0 sm:px-32 sm:pb-32">
                {/* Tabs */}
                <div className="relative mb-16 inline-flex h-[48px] w-full gap-4 rounded-12 bg-dark-600 p-4 md:mb-32">
                  {/* Animated Background */}
                  <div
                    className="absolute left-0 top-[4px] z-10 h-[calc(100%-8px)] rounded-8 bg-dark-400 transition-all duration-200"
                    style={{
                      width: authTabWidths[authTab],
                      transform: `translateX(${getAuthTabOffset()}px)`,
                      willChange: 'transform, width',
                    }}
                  />

                  <button
                    onClick={() => setAuthTab('login')}
                    className={`z-20 flex h-full w-full cursor-pointer items-center justify-center rounded-8 py-8 text-b-md font-semibold transition-all duration-100 ${
                      authTab === 'login' ? 'text-light-000' : 'text-dark-200 hover:text-light-000'
                    }`}
                  >
                    Login
                  </button>

                  <button
                    onClick={() => setAuthTab('register')}
                    className={`z-20 flex h-full w-full cursor-pointer items-center justify-center rounded-8 py-8 text-b-md font-semibold transition-all duration-100 ${
                      authTab === 'register' ? 'text-light-000' : 'text-dark-200 hover:text-light-000'
                    }`}
                  >
                    Register
                  </button>
                </div>

                {/* Tab Content */}
                <div
                  className="w-full transition-all duration-150"
                >
                  {authTab === 'login' && <LoginForm />}
                  {authTab === 'register' && <RegisterForm />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="flex flex-col gap-16">
      {/* Email/Username */}
      <div>
        <label className="text-b-md font-semibold text-dark-200" htmlFor="login-email">
          Username or Email *
        </label>
        <div className="h-4" />
        <input
          id="login-email"
          type="text"
          className="h-[40px] w-full rounded-8 bg-dark-700 px-12 text-b-md font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 hover:outline-dark-400 focus:text-light-000 focus:outline-dark-400"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-b-md font-semibold text-dark-200" htmlFor="login-password">
          Password *
        </label>
        <div className="h-4" />
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            className="h-[40px] w-full rounded-8 bg-dark-700 px-12 pr-[40px] text-b-md font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 hover:outline-dark-400 focus:text-light-000 focus:outline-dark-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="group absolute inset-y-0 right-4 my-auto flex h-[32px] items-center justify-center rounded-8 px-[10px] text-dark-200 transition-all hover:bg-dark-600 hover:text-light-000"
          >
            <div className="h-16 w-16">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 17" className="h-full w-full">
                <path d="M15.903 8.095C14.397 5.155 11.415 3.167 8 3.167S1.602 5.157.097 8.095a.9.9 0 0 0 0 .81c1.506 2.94 4.488 4.928 7.903 4.928s6.398-1.99 7.903-4.928a.9.9 0 0 0 0-.81M8 12.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8m0-6.667a2.7 2.7 0 0 0-.703.106 1.33 1.33 0 0 1-1.858 1.858A2.66 2.66 0 1 0 8 5.833" />
              </svg>
            </div>
          </button>
        </div>
        <div className="flex justify-end">
          <p className="mt-4 cursor-pointer text-right text-b-sm text-dark-200 underline">Forgot password?</p>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="flex h-[48px] w-full items-center justify-center rounded-8 bg-blue-600 px-24 text-b-lg font-bold text-light-000 transition-all hover:bg-blue-500"
      >
        Log in
      </button>

      {/* Separator */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-16">
        <div className="h-[1px] w-full bg-dark-400" />
        <span className="text-b-md text-dark-200">or continue with</span>
        <div className="h-[1px] w-full bg-dark-400" />
      </div>

      {/* OAuth Buttons */}
      <div className="flex gap-16">
        <button
          type="button"
          className="flex h-[48px] w-full items-center justify-center gap-8 rounded-8 bg-dark-400 px-24 text-b-lg font-bold text-light-000 transition-all hover:bg-dark-300"
        >
          <div className="h-16 w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
              <path d="M13.602 5.739q.123.707.121 1.422c0 2.13-.76 3.93-2.086 5.15h.002C10.481 13.38 8.89 14 7 14A7 7 0 0 1 7 0a6.74 6.74 0 0 1 4.683 1.821L9.685 3.821A3.8 3.8 0 0 0 7 2.77c-1.826 0-3.377 1.232-3.93 2.89a4.2 4.2 0 0 0 0 2.68h.002c.556 1.657 2.105 2.89 3.93 2.89.944 0 1.754-.242 2.382-.67h-.002a3.24 3.24 0 0 0 1.399-2.126H7V5.74z" />
            </svg>
          </div>
          <span>Google</span>
        </button>
        <button
          type="button"
          className="flex h-[48px] w-full items-center justify-center gap-8 rounded-8 bg-dark-400 px-24 text-b-lg font-bold text-light-000 transition-all hover:bg-dark-300"
        >
          <div className="h-16 w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 15" className="h-full w-full">
              <path d="M7 0a7.07 7.07 0 0 0-4.777 1.863A6.93 6.93 0 0 0 0 6.44l3.783 1.553c.32-.226.701-.35 1.094-.357h.11l1.672-2.418v-.025c.005-.516.164-1.02.458-1.446a2.64 2.64 0 0 1 1.192-.952 2.67 2.67 0 0 1 2.873.583c.367.367.616.833.716 1.34.1.506.046 1.03-.155 1.507-.2.476-.54.883-.974 1.17a2.67 2.67 0 0 1-1.466.439H9.24l-2.38 1.711v.096c.01.493-.17.97-.5 1.34a1.997 1.997 0 0 1-2.675.264 1.96 1.96 0 0 1-.757-1.216L.238 8.91a6.93 6.93 0 0 0 2.907 3.954 7.07 7.07 0 0 0 4.822 1.072 7.03 7.03 0 0 0 4.338-2.343A6.9 6.9 0 0 0 14 7a6.96 6.96 0 0 0-2.046-4.923A7.12 7.12 0 0 0 7 0M4.426 10.62l-.862-.355c.149.322.409.582.734.731a1.52 1.52 0 0 0 1.61-.343 1.48 1.48 0 0 0 .32-1.598 1.47 1.47 0 0 0-.779-.796 1.5 1.5 0 0 0-1.12-.024l.889.369a1.1 1.1 0 0 1 .592.592c.111.267.11.566 0 .833a1.08 1.08 0 0 1-.572.572c-.257.11-.548.117-.812.02m6.64-5.427a1.73 1.73 0 0 0-.307-.964 1.76 1.76 0 0 0-.795-.634 1.78 1.78 0 0 0-1.914.39 1.726 1.726 0 0 0-.374 1.898c.134.318.36.59.65.78a1.78 1.78 0 0 0 2.229-.227 1.75 1.75 0 0 0 .51-1.243m-3.082 0c.003-.26.083-.512.23-.726s.356-.38.599-.477a1.34 1.34 0 0 1 1.44.295 1.31 1.31 0 0 1 .278 1.43 1.3 1.3 0 0 1-.491.584 1.336 1.336 0 0 1-1.673-.175 1.3 1.3 0 0 1-.383-.931" />
            </svg>
          </div>
          <span>Steam</span>
        </button>
      </div>
    </form>
  );
}

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTos, setAcceptTos] = useState(false);

  return (
    <form className="flex flex-col gap-16">
      {/* Username */}
      <div>
        <label className="text-b-md font-semibold text-dark-200" htmlFor="register-username">
          Username *
        </label>
        <div className="h-4" />
        <input
          id="register-username"
          type="text"
          maxLength={20}
          minLength={4}
          className="h-[40px] w-full rounded-8 bg-dark-700 px-12 text-b-md font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 hover:outline-dark-400 focus:text-light-000 focus:outline-dark-400"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-b-md font-semibold text-dark-200" htmlFor="register-password">
          Password *
        </label>
        <div className="h-4" />
        <div className="relative">
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            minLength={8}
            className="h-[40px] w-full rounded-8 bg-dark-700 px-12 pr-[40px] text-b-md font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 hover:outline-dark-400 focus:text-light-000 focus:outline-dark-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="group absolute inset-y-0 right-4 my-auto flex h-[32px] items-center justify-center rounded-8 px-[10px] text-dark-200 transition-all hover:bg-dark-600 hover:text-light-000"
          >
            <div className="h-16 w-16">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 17" className="h-full w-full">
                <path d="M15.903 8.095C14.397 5.155 11.415 3.167 8 3.167S1.602 5.157.097 8.095a.9.9 0 0 0 0 .81c1.506 2.94 4.488 4.928 7.903 4.928s6.398-1.99 7.903-4.928a.9.9 0 0 0 0-.81M8 12.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8m0-6.667a2.7 2.7 0 0 0-.703.106 1.33 1.33 0 0 1-1.858 1.858A2.66 2.66 0 1 0 8 5.833" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Email Checkbox */}
      <div>
        <div className="mb-4 flex items-center gap-8">
          <div className="relative flex h-[20px] w-[20px] shrink-0 items-center justify-center">
            <input
              id="register-email"
              type="checkbox"
              className="peer h-full w-full cursor-pointer appearance-none rounded-4 bg-dark-400 transition-colors duration-100 checked:bg-blue-600"
            />
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex">
              <div className="w-[12px] text-light-000">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 12" className="h-full w-full">
                  <path fillRule="evenodd" d="M10.302 3.465a.901.901 0 1 0-1.407-1.127l-4.253 5.32L2.94 6.382a.9.9 0 0 0-1.08 1.44l2.4 1.8a.9.9 0 0 0 1.243-.158z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <label className="text-b-md font-semibold text-dark-200" htmlFor="register-email">
            Email (optional)
          </label>
        </div>
      </div>

      {/* Referral Code Checkbox */}
      <div>
        <div className="mb-4 flex items-center gap-8">
          <div className="relative flex h-[20px] w-[20px] shrink-0 items-center justify-center">
            <input
              id="register-referral-code"
              type="checkbox"
              className="peer h-full w-full cursor-pointer appearance-none rounded-4 bg-dark-400 transition-colors duration-100 checked:bg-blue-600"
            />
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex">
              <div className="w-[12px] text-light-000">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 12" className="h-full w-full">
                  <path fillRule="evenodd" d="M10.302 3.465a.901.901 0 1 0-1.407-1.127l-4.253 5.32L2.94 6.382a.9.9 0 0 0-1.08 1.44l2.4 1.8a.9.9 0 0 0 1.243-.158z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <label className="text-b-md font-semibold text-dark-200" htmlFor="register-referral-code">
            Referral code (optional)
          </label>
        </div>
      </div>

      {/* Terms Checkbox */}
      <div>
        <div className="flex items-center gap-8">
          <div className="relative flex h-[20px] w-[20px] shrink-0 items-center justify-center">
            <input
              id="register-tos"
              type="checkbox"
              checked={acceptTos}
              onChange={(e) => setAcceptTos(e.target.checked)}
              className="peer h-full w-full cursor-pointer appearance-none rounded-4 bg-dark-400 transition-colors duration-100 checked:bg-blue-600"
              required
            />
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex">
              <div className="w-[12px] text-light-000">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 12" className="h-full w-full">
                  <path fillRule="evenodd" d="M10.302 3.465a.901.901 0 1 0-1.407-1.127l-4.253 5.32L2.94 6.382a.9.9 0 0 0-1.08 1.44l2.4 1.8a.9.9 0 0 0 1.243-.158z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <label className="text-b-md font-semibold text-dark-200" htmlFor="register-tos">
            I agree to the{' '}
            <a href="/policies/tos" className="underline" target="_blank">
              Terms & Conditions
            </a>{' '}
            *
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!acceptTos}
        className="flex h-[48px] w-full items-center justify-center rounded-8 bg-blue-600 px-24 text-b-lg font-bold text-light-000 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-dark-400 disabled:opacity-50"
      >
        Create Account
      </button>

      {/* Separator */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-16">
        <div className="h-[1px] w-full bg-dark-400" />
        <span className="text-b-md text-dark-200">or continue with</span>
        <div className="h-[1px] w-full bg-dark-400" />
      </div>

      {/* OAuth Buttons */}
      <div className="flex gap-16">
        <button
          type="button"
          className="flex h-[48px] w-full items-center justify-center gap-8 rounded-8 bg-dark-400 px-24 text-b-lg font-bold text-light-000 transition-all hover:bg-dark-300"
        >
          <div className="h-16 w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
              <path d="M13.602 5.739q.123.707.121 1.422c0 2.13-.76 3.93-2.086 5.15h.002C10.481 13.38 8.89 14 7 14A7 7 0 0 1 7 0a6.74 6.74 0 0 1 4.683 1.821L9.685 3.821A3.8 3.8 0 0 0 7 2.77c-1.826 0-3.377 1.232-3.93 2.89a4.2 4.2 0 0 0 0 2.68h.002c.556 1.657 2.105 2.89 3.93 2.89.944 0 1.754-.242 2.382-.67h-.002a3.24 3.24 0 0 0 1.399-2.126H7V5.74z" />
            </svg>
          </div>
          <span>Google</span>
        </button>
        <button
          type="button"
          className="flex h-[48px] w-full items-center justify-center gap-8 rounded-8 bg-dark-400 px-24 text-b-lg font-bold text-light-000 transition-all hover:bg-dark-300"
        >
          <div className="h-16 w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 15" className="h-full w-full">
              <path d="M7 0a7.07 7.07 0 0 0-4.777 1.863A6.93 6.93 0 0 0 0 6.44l3.783 1.553c.32-.226.701-.35 1.094-.357h.11l1.672-2.418v-.025c.005-.516.164-1.02.458-1.446a2.64 2.64 0 0 1 1.192-.952 2.67 2.67 0 0 1 2.873.583c.367.367.616.833.716 1.34.1.506.046 1.03-.155 1.507-.2.476-.54.883-.974 1.17a2.67 2.67 0 0 1-1.466.439H9.24l-2.38 1.711v.096c.01.493-.17.97-.5 1.34a1.997 1.997 0 0 1-2.675.264 1.96 1.96 0 0 1-.757-1.216L.238 8.91a6.93 6.93 0 0 0 2.907 3.954 7.07 7.07 0 0 0 4.822 1.072 7.03 7.03 0 0 0 4.338-2.343A6.9 6.9 0 0 0 14 7a6.96 6.96 0 0 0-2.046-4.923A7.12 7.12 0 0 0 7 0M4.426 10.62l-.862-.355c.149.322.409.582.734.731a1.52 1.52 0 0 0 1.61-.343 1.48 1.48 0 0 0 .32-1.598 1.47 1.47 0 0 0-.779-.796 1.5 1.5 0 0 0-1.12-.024l.889.369a1.1 1.1 0 0 1 .592.592c.111.267.11.566 0 .833a1.08 1.08 0 0 1-.572.572c-.257.11-.548.117-.812.02m6.64-5.427a1.73 1.73 0 0 0-.307-.964 1.76 1.76 0 0 0-.795-.634 1.78 1.78 0 0 0-1.914.39 1.726 1.726 0 0 0-.374 1.898c.134.318.36.59.65.78a1.78 1.78 0 0 0 2.229-.227 1.75 1.75 0 0 0 .51-1.243m-3.082 0c.003-.26.083-.512.23-.726s.356-.38.599-.477a1.34 1.34 0 0 1 1.44.295 1.31 1.31 0 0 1 .278 1.43 1.3 1.3 0 0 1-.491.584 1.336 1.336 0 0 1-1.673-.175 1.3 1.3 0 0 1-.383-.931" />
            </svg>
          </div>
          <span>Steam</span>
        </button>
      </div>
    </form>
  );
}
