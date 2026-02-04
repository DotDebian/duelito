'use client';

import { useState, useRef, useEffect } from 'react';
import {
  BitcoinIcon,
  EthereumIcon,
  USDCIcon,
  USDTIcon,
  SolanaIcon,
  LitecoinIcon,
  DollarIcon,
} from '../icons/CryptoIcons';

export function WalletBuyCryptoTab() {
  const [spendAmount, setSpendAmount] = useState('');
  const [selectedFiat, setSelectedFiat] = useState('usd');
  const [selectedCrypto, setSelectedCrypto] = useState('usdc');
  const [isFiatOpen, setIsFiatOpen] = useState(false);
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);
  const fiatRef = useRef<HTMLDivElement>(null);
  const cryptoRef = useRef<HTMLDivElement>(null);

  const fiatCurrencies = [
    { id: 'usd', name: 'USD', icon: <DollarIcon /> },
    { id: 'eur', name: 'EUR', icon: <DollarIcon /> },
    { id: 'gbp', name: 'GBP', icon: <DollarIcon /> },
  ];

  const cryptoCurrencies = [
    { id: 'btc', name: 'BTC', icon: <BitcoinIcon /> },
    { id: 'eth', name: 'ETH', icon: <EthereumIcon /> },
    { id: 'usdc', name: 'USDC', icon: <USDCIcon /> },
    { id: 'usdt', name: 'USDT', icon: <USDTIcon /> },
    { id: 'sol', name: 'SOL', icon: <SolanaIcon /> },
    { id: 'ltc', name: 'LTC', icon: <LitecoinIcon /> },
  ];

  const currentFiat = fiatCurrencies.find(c => c.id === selectedFiat) || fiatCurrencies[0];
  const currentCrypto = cryptoCurrencies.find(c => c.id === selectedCrypto) || cryptoCurrencies[2];

  // Mock conversion rate (1:1 for USDC, different for others)
  const getReceiveAmount = () => {
    const spend = parseFloat(spendAmount) || 0;
    const rates: Record<string, number> = {
      btc: 0.000024,
      eth: 0.00042,
      usdc: 1.0,
      usdt: 1.0,
      sol: 0.047,
      ltc: 0.012,
    };
    return (spend * (rates[selectedCrypto] || 1)).toFixed(6);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fiatRef.current && !fiatRef.current.contains(event.target as Node)) {
        setIsFiatOpen(false);
      }
      if (cryptoRef.current && !cryptoRef.current.contains(event.target as Node)) {
        setIsCryptoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFormValid = spendAmount.trim() !== '' && parseFloat(spendAmount) > 0;

  return (
    <div className="flex flex-col gap-16">
      <form noValidate className="group/form">
        {/* Spend Row */}
        <div className="flex gap-16">
          {/* Spend Amount Input */}
          <div className="w-2/3">
            <label className="text-b-md font-semibold text-dark-200">Spend</label>
            <div className="h-4"/>
            <div
              className="group flex h-[40px] items-center gap-4 rounded-8 bg-dark-700 px-[12px] py-8 text-b-md font-semibold text-dark-300 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:outline-dark-400 focus-within:outline-dark-400">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center">
                <DollarIcon/>
              </div>
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={spendAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setSpendAmount(value);
                  }
                }}
                className="w-full bg-transparent text-light-000 outline-none placeholder:text-dark-300"
                placeholder="0.00"
                data-testid="currency-input"
              />
            </div>
          </div>

          {/* Fiat Currency Select */}
          <div className="w-1/3" ref={fiatRef}>
            <label className="text-b-md font-semibold text-dark-200">&nbsp;</label>
            <div className="h-4"/>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFiatOpen(!isFiatOpen)}
                className="flex h-[40px] w-full items-center justify-between rounded-8 bg-dark-700 px-[12px] py-8 font-bold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:bg-dark-400 hover:outline-dark-400"
              >
                <div className="flex items-center gap-4 text-b-md font-semibold">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center">
                    {currentFiat.icon}
                  </div>
                  {currentFiat.name}
                </div>
                <div className="ml-4 flex h-14 w-14 flex-shrink-0 items-center justify-center text-dark-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="">
                    <path fillRule="evenodd"
                          d="M7 8.47 2.566 4.037a.8.8 0 1 0-1.132 1.132l4.647 4.646a1.3 1.3 0 0 0 1.838 0l4.647-4.646a.8.8 0 1 0-1.132-1.132z"
                          clipRule="evenodd"/>
                  </svg>
                </div>
              </button>

              {/* Fiat Dropdown */}
              <div
                className={`absolute left-0 top-full z-50 mt-1 w-full rounded-8 bg-dark-600 py-4 shadow-lg transition-all duration-200 ${
                  isFiatOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                {fiatCurrencies.map((fiat) => (
                  <button
                    key={fiat.id}
                    type="button"
                    onClick={() => {
                      setSelectedFiat(fiat.id);
                      setIsFiatOpen(false);
                    }}
                    className="flex w-full items-center gap-4 px-[12px] py-8 text-b-md font-semibold text-light-000 transition-all hover:bg-dark-400"
                  >
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center">
                      {fiat.icon}
                    </div>
                    {fiat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Receive Row */}
        <div className="mt-16">
          <label className="text-b-md font-semibold text-dark-200">Receive</label>
          <div className="h-4"/>
          <div className="flex gap-16">
            {/* Receive Amount (Read-only) */}
            <div
              className="group flex h-[40px] w-2/3 items-center gap-4 rounded-8 bg-dark-700 px-[12px] py-8 text-b-md font-semibold text-dark-300 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:outline-dark-400 focus-within:outline-dark-400">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center">
                {currentCrypto.icon}
              </div>
              <input
                type="text"
                readOnly
                value={getReceiveAmount()}
                className="w-full bg-transparent text-light-000 outline-none"
                data-testid="currency-input"
              />
            </div>

            {/* Crypto Currency Select */}
            <div className="w-1/3" ref={cryptoRef}>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCryptoOpen(!isCryptoOpen)}
                  className="flex h-[40px] w-full items-center justify-between rounded-8 bg-dark-700 px-[12px] py-8 font-bold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:bg-dark-400 hover:outline-dark-400"
                >
                  <div className="flex items-center">
                    <div className="mr-4 flex h-16 w-16 flex-shrink-0 items-center justify-center">
                      {currentCrypto.icon}
                    </div>
                    <span className="text-b-md font-semibold text-light-000">{currentCrypto.name}</span>
                  </div>
                  <div className="ml-4 flex h-14 w-14 flex-shrink-0 items-center justify-center text-dark-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="">
                      <path fillRule="evenodd"
                            d="M7 8.47 2.566 4.037a.8.8 0 1 0-1.132 1.132l4.647 4.646a1.3 1.3 0 0 0 1.838 0l4.647-4.646a.8.8 0 1 0-1.132-1.132z"
                            clipRule="evenodd"/>
                    </svg>
                  </div>
                </button>

                {/* Crypto Dropdown */}
                <div
                  className={`absolute left-0 top-full z-50 mt-1 w-full rounded-8 bg-dark-600 py-4 shadow-lg transition-all duration-200 ${
                    isCryptoOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                >
                  {cryptoCurrencies.map((crypto) => (
                    <button
                      key={crypto.id}
                      type="button"
                      onClick={() => {
                        setSelectedCrypto(crypto.id);
                        setIsCryptoOpen(false);
                      }}
                      className="flex w-full items-center gap-4 px-[12px] py-8 text-b-md font-semibold text-light-000 transition-all hover:bg-dark-400"
                    >
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center">
                        {crypto.icon}
                      </div>
                      {crypto.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Warning Message */}
      <div className="text-b-sm flex items-baseline gap-8 rounded-6 text-dark-200 bg-transparent text-b-sm">
        <div
          className="ms-flex ms-flex-shrink-0 ms-items-center ms-justify-center size-[14px] relative text-light-000">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14"
               className="h-full w-full">
            <path fillRule="evenodd"
                  d="M6.283.788a1.376 1.376 0 0 1 1.941.547l.002.004 5.043 10.086a1.377 1.377 0 0 1-1.224 1.994H1.955A1.376 1.376 0 0 1 .73 11.426v-.001L5.774 1.339l.002-.004c.115-.226.29-.415.507-.547M7 4.364c.38 0 .688.308.688.687v2.98a.688.688 0 0 1-1.376 0v-2.98c0-.38.308-.687.688-.687m.917 6.19a.917.917 0 1 1-1.834 0 .917.917 0 0 1 1.834 0"
                  clipRule="evenodd"></path>
          </svg>
        </div>
        <p>External payments may carry a processing fee.</p></div>

      {/* Buy Button */}
      <button
        type="button"
        disabled={!isFormValid}
        className="mt-16 flex h-[40px] w-full touch-manipulation items-center justify-center rounded-8 bg-blue-600 px-[12px] py-8 text-b-md font-semibold text-light-000 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-dark-400 disabled:opacity-50"
      >
        Buy Crypto
      </button>
    </div>
  );
}
