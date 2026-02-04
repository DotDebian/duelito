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

export function WalletTipTab() {
  const [selectedCurrency, setSelectedCurrency] = useState('usdc');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const currencyRef = useRef<HTMLDivElement>(null);

  const currencies = [
    { id: 'btc', name: 'Bitcoin', ticker: 'BTC', balance: '0.00', icon: <BitcoinIcon /> },
    { id: 'eth', name: 'Ethereum', ticker: 'ETH', balance: '0.00', icon: <EthereumIcon /> },
    { id: 'usdc', name: 'USD Coin', ticker: 'USDC', balance: '0.00', icon: <USDCIcon /> },
    { id: 'usdt', name: 'Tether', ticker: 'USDT', balance: '0.00', icon: <USDTIcon /> },
    { id: 'sol', name: 'Solana', ticker: 'SOL', balance: '0.00', icon: <SolanaIcon /> },
    { id: 'ltc', name: 'Litecoin', ticker: 'LTC', balance: '0.00', icon: <LitecoinIcon /> },
  ];

  const currentCurrency = currencies.find(c => c.id === selectedCurrency) || currencies[2];

  const isFormValid = username.trim().length >= 4 && tipAmount.trim() !== '' && parseFloat(tipAmount) > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle tip logic here
  };

  return (
    <div className="flex flex-col gap-16">
      <form noValidate className="group/form" onSubmit={handleSubmit}>
        {/* Currency Select */}
        <div className="mb-16 flex w-full gap-8">
          <div className="w-full" ref={currencyRef}>
            <label className="text-b-md font-semibold text-dark-200">Currency</label>
            <div className="h-4" />
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex h-[40px] w-full items-center justify-between rounded-8 bg-dark-700 px-[12px] text-b-md font-bold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:bg-dark-400 hover:outline-dark-400"
                data-testid="wallet-currency-select-button"
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor">
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
                      setIsCurrencyOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-[12px] py-8 text-b-md font-semibold text-light-000 transition-all hover:bg-dark-400"
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

        {/* Username Input */}
        <div className="mb-16">
          <label className="text-b-md font-semibold text-dark-200">
            Username *
          </label>
          <div className="h-4" />
          <input
            type="text"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-[40px] w-full rounded-8 bg-dark-700 px-[12px] text-b-md font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 hover:outline-dark-400 focus:text-light-000 focus:outline-dark-400"
            minLength={4}
            pattern="[\w\-]+"
            required
          />
        </div>

        {/* Tip Amount */}
        <div className="mb-16 mt-[44px]">
          <div className="mt-[-22px] flex flex-col gap-4">
            <div className="flex justify-between gap-4 whitespace-nowrap text-b-md font-semibold text-dark-200">
              <span>Tip amount</span>
              <span className="ml-auto max-w-[50%] truncate">
                <span data-testid="money-input-amount">{tipAmount || '0'}</span> {currentCurrency.ticker}
              </span>
            </div>
            <div className="group flex h-[40px] items-center gap-4 rounded-8 bg-dark-700 px-[12px] py-8 text-b-md font-semibold text-dark-300 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:outline-dark-400 focus-within:outline-dark-400">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path fill="#2B63F4" d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0" />
                  <path fill="#fff" d="M6.927 11.705a.2.2 0 0 1-.2-.2V2.45c0-.11.09-.2.2-.2h.206c.11 0 .2.09.2.2v9.055a.2.2 0 0 1-.2.2zm1.727-6.43c-.103 0-.186-.078-.212-.177a1 1 0 0 0-.404-.577q-.381-.27-.99-.27-.428 0-.735.13-.306.13-.469.35a.85.85 0 0 0-.059.917 1 1 0 0 0 .3.295q.188.118.417.2t.461.136l.71.178q.428.099.823.27.398.168.713.428.317.258.502.624.185.365.185.857 0 .665-.34 1.17-.34.502-.982.787-.639.28-1.548.28-.883 0-1.533-.273a2.3 2.3 0 0 1-1.012-.797 2.3 2.3 0 0 1-.376-1.07.19.19 0 0 1 .193-.208h.954c.105 0 .19.08.211.184q.056.274.219.473.214.262.557.392.348.129.776.129.447 0 .783-.133a1.27 1.27 0 0 0 .532-.377.9.9 0 0 0 .196-.569.72.72 0 0 0-.174-.487 1.3 1.3 0 0 0-.476-.325 4.6 4.6 0 0 0-.71-.236l-.86-.222q-.934-.24-1.477-.728-.54-.491-.54-1.303 0-.669.362-1.171.366-.502.994-.78.627-.28 1.422-.28.805 0 1.41.28a2.3 2.3 0 0 1 .957.773q.291.411.346.927a.187.187 0 0 1-.191.203z" />
                </svg>
              </div>
              <input
                id="tip-amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={tipAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setTipAmount(value);
                  }
                }}
                className="w-full bg-transparent text-light-000 outline-none placeholder:text-dark-300"
                placeholder="0.00"
                data-testid="currency-input"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="mt-32 flex h-[48px] w-full touch-manipulation items-center justify-center rounded-8 bg-blue-600 px-[24px] py-8 text-b-lg font-bold text-light-000 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-dark-400 disabled:opacity-50"
        >
          Tip
        </button>
      </form>
    </div>
  );
}
