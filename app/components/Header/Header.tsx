'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useBalance } from '@/app/contexts/BalanceContext';
import { originalsGames } from './data/originalsGames';
import { BalanceDropdown } from './BalanceDropdown';
import { AuthModal } from './AuthModal';
import { WalletModal } from './WalletModal';
import { USDCIcon } from './icons/CryptoIcons';

export function Header() {
  const pathname = usePathname();
  const { balance } = useBalance();
  const [isOriginalsOpen, setIsOriginalsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [isBalanceDropdownOpen, setIsBalanceDropdownOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletTab, setWalletTab] = useState<'deposit' | 'withdraw' | 'buy' | 'tip'>('deposit');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const balanceDropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openAuthModal = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
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
      if (balanceDropdownRef.current && !balanceDropdownRef.current.contains(event.target as Node)) {
        setIsBalanceDropdownOpen(false);
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
          <div ref={balanceDropdownRef} className="relative">
            <button
              onClick={() => setIsBalanceDropdownOpen(!isBalanceDropdownOpen)}
              className="ml-8 flex h-[40px] items-center rounded-8 bg-dark-500 px-[12px] text-b-md font-semibold transition-all hover:bg-dark-400 disabled:opacity-50 disabled:hover:bg-dark-500 md:h-[48px] md:px-16"
            >
              <div className="relative top-[1px] flex items-center justify-center overflow-hidden transition-all duration-300" style={{ minWidth: '57px' }}>
                <div className="text-nowrap break-keep leading-[1]">
                  <span className="inline-flex items-center justify-center gap-4 tabular-nums">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center">
                      <USDCIcon />
                    </div>
                    <span className="block max-w-[calc(100vw-270px)] truncate lg:max-w-[calc(100vw-895px)]">${balance.toFixed(2)}</span>
                  </span>
                </div>
              </div>
              <div className={`ml-4 h-16 w-16 text-dark-200 transition-all duration-200 md:ml-8 ${isBalanceDropdownOpen ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
                  <path fillRule="evenodd" d="M6.903 7.74c.053.055.14.055.194 0l3.428-3.494a.543.543 0 0 1 .775 0l.211.216a.543.543 0 0 1 0 .76L7.387 9.426a.543.543 0 0 1-.774 0L2.489 5.222a.543.543 0 0 1 0-.76l.211-.216a.543.543 0 0 1 .775 0z" clipRule="evenodd" />
                </svg>
              </div>
            </button>

            {/* Balance Dropdown */}
            <BalanceDropdown isOpen={isBalanceDropdownOpen} />
          </div>

          {/* Wallet Button */}
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="relative flex h-[48px] flex-row items-center justify-center rounded-8 bg-blue-600 px-[24px] py-8 text-b-lg font-bold text-light-000 outline-none transition-all hover:bg-blue-500 hover:text-light-000 active:bg-blue-500 active:text-light-000 disabled:cursor-not-allowed disabled:bg-dark-400 disabled:text-light-000 disabled:opacity-50"
          >
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        activeTab={authTab}
        onTabChange={setAuthTab}
      />

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        activeTab={walletTab}
        onTabChange={setWalletTab}
      />
    </div>
  );
}
