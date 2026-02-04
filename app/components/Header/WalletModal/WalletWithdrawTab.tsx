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

export function WalletWithdrawTab() {
  const [selectedCurrency, setSelectedCurrency] = useState('usdc');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [amount, setAmount] = useState('');
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

  const isFormValid = withdrawAddress.trim() !== '' && amount.trim() !== '' && parseFloat(amount) > 0;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle withdrawal logic here
  };

  return (
    <div data-testid="withdraw-panel">
      <form noValidate className="group/form flex flex-col gap-16" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-16">
          {/* Currency Select */}
          <div className="flex w-full gap-8">
            <div className="w-full" ref={currencyRef}>
              <label className="text-b-md font-semibold text-dark-200">Currency</label>
              <div className="h-4" />
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex h-[40px] w-full items-center justify-between rounded-8 bg-dark-700 px-[12px] text-b-md font-bold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:bg-dark-400 hover:outline-dark-400"
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

          {/* Network Select */}
          <div className="flex w-full gap-8">
            <div className="w-full" ref={networkRef}>
              <label className="text-b-md font-semibold text-dark-200">Network</label>
              <div className="h-4" />
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsNetworkOpen(!isNetworkOpen)}
                  className="flex h-[40px] w-full items-center justify-between rounded-8 bg-dark-700 px-[12px] text-b-md font-bold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:bg-dark-400 hover:outline-dark-400"
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
                      className="flex w-full items-center px-[12px] py-8 text-b-md font-semibold text-light-000 transition-all hover:bg-dark-400"
                    >
                      {network.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Address */}
          <div className="w-full">
            <label className="text-b-md font-semibold text-dark-200">
              Withdrawal address*
            </label>
            <div className="h-4" />
            <input
              type="text"
              autoComplete="off"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              className="h-[40px] w-full rounded-8 bg-dark-700 px-[12px] text-b-md font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 hover:outline-dark-400 focus:text-light-000 focus:outline-dark-400"
              placeholder={`Enter your ${currentCurrency.ticker} address`}
              data-testid="withdraw-address-input"
              required
            />
          </div>

          {/* Amount */}
          <div className="flex">
            <div className="w-full">
              <div className="flex w-full justify-between">
                <label className="text-b-md font-semibold text-dark-200">Amount*</label>
                <p className="text-b-md font-semibold text-dark-200">0 {currentCurrency.ticker}</p>
              </div>
              <div className="h-4" />
              <div className="group flex h-[40px] w-full items-center gap-4 rounded-8 bg-dark-700 px-[12px] py-8 text-b-md font-semibold text-dark-200 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:outline-dark-400 focus-within:outline-dark-400">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="h-full w-full">
                    <path fill="#2B63F4" d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0" />
                    <path fill="#fff" d="M6.927 11.705a.2.2 0 0 1-.2-.2V2.45c0-.11.09-.2.2-.2h.206c.11 0 .2.09.2.2v9.055a.2.2 0 0 1-.2.2zm1.727-6.43c-.103 0-.186-.078-.212-.177a1 1 0 0 0-.404-.577q-.381-.27-.99-.27-.428 0-.735.13-.306.13-.469.35a.85.85 0 0 0-.059.917 1 1 0 0 0 .3.295q.188.118.417.2t.461.136l.71.178q.428.099.823.27.398.168.713.428.317.258.502.624.185.365.185.857 0 .665-.34 1.17-.34.502-.982.787-.639.28-1.548.28-.883 0-1.533-.273a2.3 2.3 0 0 1-1.012-.797 2.3 2.3 0 0 1-.376-1.07.19.19 0 0 1 .193-.208h.954c.105 0 .19.08.211.184q.056.274.219.473.214.262.557.392.348.129.776.129.447 0 .783-.133a1.27 1.27 0 0 0 .532-.377.9.9 0 0 0 .196-.569.72.72 0 0 0-.174-.487 1.3 1.3 0 0 0-.476-.325 4.6 4.6 0 0 0-.71-.236l-.86-.222q-.934-.24-1.477-.728-.54-.491-.54-1.303 0-.669.362-1.171.366-.502.994-.78.627-.28 1.422-.28.805 0 1.41.28a2.3 2.3 0 0 1 .957.773q.291.411.346.927a.187.187 0 0 1-.191.203z" />
                  </svg>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setAmount(value);
                    }
                  }}
                  className="w-full bg-transparent text-light-000 outline-none placeholder:text-dark-300"
                  placeholder="Enter amount"
                  data-testid="currency-input"
                />
                <button
                  type="button"
                  onClick={() => setAmount(currentCurrency.balance)}
                  className="-mr-8 flex h-[32px] touch-manipulation items-center justify-center whitespace-nowrap rounded-8 bg-dark-400 px-[10px] text-b-sm font-semibold uppercase text-light-000 transition-all hover:bg-dark-300"
                >
                  Max
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Fee */}
          <div
            className="mt-16 text-b-sm flex items-baseline gap-8 rounded-6 text-dark-200 bg-transparent mt-16 text-b-sm">
            <div
              className="ms-flex ms-flex-shrink-0 ms-items-center ms-justify-center size-[14px] relative text-light-000">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14"
                   className="h-full w-full">
                <path fillRule="evenodd"
                      d="M6.283.788a1.376 1.376 0 0 1 1.941.547l.002.004 5.043 10.086a1.377 1.377 0 0 1-1.224 1.994H1.955A1.376 1.376 0 0 1 .73 11.426v-.001L5.774 1.339l.002-.004c.115-.226.29-.415.507-.547M7 4.364c.38 0 .688.308.688.687v2.98a.688.688 0 0 1-1.376 0v-2.98c0-.38.308-.687.688-.687m.917 6.19a.917.917 0 1 1-1.834 0 .917.917 0 0 1 1.834 0"
                      clipRule="evenodd"></path>
              </svg>
            </div>
            <p>Your deposit must be sent on the Ethereum Network (ERC-20).</p></div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="mt-16 flex h-[40px] w-full touch-manipulation items-center justify-center rounded-8 bg-blue-600 px-[12px] py-8 text-b-md font-semibold text-light-000 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-dark-400 disabled:opacity-50"
            data-testid="withdraw-submit-btn"
          >
            Withdraw
          </button>
        </div>
      </form>
    </div>
  );
}
