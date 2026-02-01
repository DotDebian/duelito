'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

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
  const [isOriginalsOpen, setIsOriginalsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

        {/* Auth Buttons */}
        <div className="flex items-center gap-8">
          <button className="flex h-[40px] items-center justify-center rounded-8 border border-dark-500 bg-transparent px-12 text-b-lg font-bold text-light-000 transition-colors hover:bg-dark-600 md:h-[48px] md:px-16">
            Login
          </button>
          <button className="flex h-[48px] items-center justify-center rounded-8 bg-blue-600 px-24 text-b-lg font-bold text-light-000 transition-colors hover:bg-blue-500">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
