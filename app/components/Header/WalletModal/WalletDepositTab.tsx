'use client';

import { useState, useRef, useEffect } from 'react';
import {
  BitcoinIcon,
  EthereumIcon,
  USDCIcon,
  USDTIcon,
  SolanaIcon,
  LitecoinIcon,
} from '../icons/CryptoIcons';

export function WalletDepositTab() {
  const [selectedCurrency, setSelectedCurrency] = useState('usdc');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);

  const currencies = [
    { id: 'btc', name: 'Bitcoin', ticker: 'BTC', balance: '0.00', icon: <BitcoinIcon /> },
    { id: 'eth', name: 'Ethereum', ticker: 'ETH', balance: '0.00', icon: <EthereumIcon /> },
    { id: 'usdc', name: 'USD Coin', ticker: 'USDC', balance: '0.00', icon: <USDCIcon /> },
    { id: 'usdt', name: 'Tether', ticker: 'USDT', balance: '0.00', icon: <USDTIcon /> },
    { id: 'sol', name: 'Solana', ticker: 'SOL', balance: '0.00', icon: <SolanaIcon /> },
    { id: 'ltc', name: 'Litecoin', ticker: 'LTC', balance: '0.00', icon: <LitecoinIcon /> },
  ];

  const networks: Record<string, { id: string; name: string }[]> = {
    btc: [{ id: 'bitcoin', name: 'Bitcoin' }],
    eth: [{ id: 'ethereum', name: 'Ethereum (ERC20)' }],
    usdc: [
      { id: 'ethereum', name: 'Ethereum (ERC20)' },
      { id: 'solana', name: 'Solana' },
      { id: 'polygon', name: 'Polygon' },
    ],
    usdt: [
      { id: 'ethereum', name: 'Ethereum (ERC20)' },
      { id: 'tron', name: 'TRON (TRC20)' },
    ],
    sol: [{ id: 'solana', name: 'Solana' }],
    ltc: [{ id: 'litecoin', name: 'Litecoin' }],
  };

  const currentCurrency = currencies.find(c => c.id === selectedCurrency) || currencies[2];
  const currentNetworks = networks[selectedCurrency] || [];
  const currentNetwork = currentNetworks.find(n => n.id === selectedNetwork) || currentNetworks[0];

  // Mock deposit address
  const depositAddress = '0xfc0Db1ff668EA0Fd077B84Bdb8300Dd293605260';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
      if (networkRef.current && !networkRef.current.contains(event.target as Node)) {
        setIsNetworkOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div data-testid="deposit-panel">
      <div className="flex flex-col gap-16">
        {/* QR Code */}
        <div className="my-16 flex h-[140px] w-full items-center justify-center">
          <div className="flex h-[136px] w-[136px] items-center justify-center rounded-8 bg-light-000">
            <img
              src="data:image/png;base64,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"
              className="rounded-8"
              alt="QR code"
            />
          </div>
        </div>

        {/* Currency and Network Selects */}
        <div className="flex w-full gap-8">
          {/* Currency Select */}
          <div className="w-full" ref={currencyRef}>
            <label className="text-b-md font-semibold text-dark-200">Currency</label>
            <div className="h-4" />
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex h-[40px] w-full cursor-pointer items-center justify-between rounded-8 bg-dark-700 px-[12px] text-b-md font-bold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:bg-dark-400 hover:outline-dark-400"
              >
                <div className="flex w-full justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center">
                      {currentCurrency.icon}
                    </div>
                    <span>{currentCurrency.name}</span>
                    <span className="text-dark-100">{currentCurrency.ticker}</span>
                  </div>
                  <p className="text-dark-200">${currentCurrency.balance}</p>
                </div>
                <div className="ml-4 flex h-14 w-14 flex-shrink-0 items-center justify-center text-dark-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="">
                    <path fillRule="evenodd" d="M7 8.47 2.566 4.037a.8.8 0 1 0-1.132 1.132l4.647 4.646a1.3 1.3 0 0 0 1.838 0l4.647-4.646a.8.8 0 1 0-1.132-1.132z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>

              {/* Currency Dropdown */}
              <div
                className={`absolute left-0 top-full z-50 mt-1 w-full rounded-8 bg-dark-600 py-4 shadow-lg transition-all duration-200 ${
                  isCurrencyOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                {currencies.map((currency) => (
                  <button
                    key={currency.id}
                    type="button"
                    onClick={() => {
                      setSelectedCurrency(currency.id);
                      setSelectedNetwork(networks[currency.id]?.[0]?.id || 'ethereum');
                      setIsCurrencyOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center justify-between px-[12px] py-8 text-b-md font-semibold text-light-000 transition-all hover:bg-dark-400"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center">
                        {currency.icon}
                      </div>
                      <span>{currency.name}</span>
                      <span className="text-dark-100">{currency.ticker}</span>
                    </div>
                    <span className="text-dark-200">${currency.balance}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Network Select */}
        <div className="flex w-full gap-8">
          <div className="w-full" ref={networkRef}>
            <label className="text-b-md font-semibold text-dark-200">Network</label>
            <div className="h-4" />
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setIsNetworkOpen(!isNetworkOpen)}
                className="flex h-[40px] w-full cursor-pointer items-center justify-between rounded-8 bg-dark-700 px-[12px] text-b-md font-bold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:bg-dark-400 hover:outline-dark-400"
              >
                <div className="flex w-full justify-between">
                  <div className="flex items-center gap-4">
                    <p>{currentNetwork?.name || 'Select network'}</p>
                  </div>
                </div>
                <div className="ml-4 flex h-14 w-14 flex-shrink-0 items-center justify-center text-dark-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="">
                    <path fillRule="evenodd" d="M7 8.47 2.566 4.037a.8.8 0 1 0-1.132 1.132l4.647 4.646a1.3 1.3 0 0 0 1.838 0l4.647-4.646a.8.8 0 1 0-1.132-1.132z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>

              {/* Network Dropdown */}
              <div
                className={`absolute left-0 top-full z-50 mt-1 w-full rounded-8 bg-dark-600 py-4 shadow-lg transition-all duration-200 ${
                  isNetworkOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                {currentNetworks.map((network) => (
                  <button
                    key={network.id}
                    type="button"
                    onClick={() => {
                      setSelectedNetwork(network.id);
                      setIsNetworkOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center px-[12px] py-8 text-b-md font-semibold text-light-000 transition-all hover:bg-dark-400"
                  >
                    {network.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Address */}
        <div className="flex">
          <div className="w-full">
            <label className="text-b-md font-semibold text-dark-200">
              Your {currentCurrency.ticker} deposit address
            </label>
            <div className="h-4" />
            <div className="flex h-[44px] items-center justify-between gap-[6px] rounded-8 bg-dark-700 px-[12px] text-b-md w-full">
              <p className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-dark-300">
                {depositAddress}
              </p>
              <button
                type="button"
                onClick={copyToClipboard}
                className="cursor-pointer text-dark-200 transition-all hover:text-light-000"
              >
                <div className="h-16 w-16">
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="h-full w-full text-green-500">
                      <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="h-full w-full">
                      <g clipPath="url(#icon-duel-copy_svg__a)">
                        <path fillRule="evenodd" d="M2.667.667a2 2 0 0 0-2 2V10a2 2 0 0 0 2 2H10a2 2 0 0 0 2-2V2.667a2 2 0 0 0-2-2zm12.666 4.452a.785.785 0 1 0-1.571 0v5.643a3 3 0 0 1-3 3H5.12a.786.786 0 0 0 0 1.571h6.214a4 4 0 0 0 4-4z" clipRule="evenodd" />
                      </g>
                      <defs>
                        <clipPath id="icon-duel-copy_svg__a">
                          <path d="M0 0h16v16H0z" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div
          className="mt-16 text-b-sm flex items-baseline gap-8 rounded-6 text-dark-200 bg-transparent mt-16 text-b-sm">
          <div
            className="ms-flex ms-flex-shrink-0 ms-items-center ms-justify-center ms-size-[14px] relative text-light-000">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14"
                 className="size-[14px]">
              <path fillRule="evenodd"
                    d="M6.283.788a1.376 1.376 0 0 1 1.941.547l.002.004 5.043 10.086a1.377 1.377 0 0 1-1.224 1.994H1.955A1.376 1.376 0 0 1 .73 11.426v-.001L5.774 1.339l.002-.004c.115-.226.29-.415.507-.547M7 4.364c.38 0 .688.308.688.687v2.98a.688.688 0 0 1-1.376 0v-2.98c0-.38.308-.687.688-.687m.917 6.19a.917.917 0 1 1-1.834 0 .917.917 0 0 1 1.834 0"
                    clipRule="evenodd"></path>
            </svg>
          </div>
          <p>Your deposit must be sent on the Ethereum Network (ERC-20).</p></div>
      </div>
    </div>
  );
}
