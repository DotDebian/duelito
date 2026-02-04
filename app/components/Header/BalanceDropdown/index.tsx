'use client';

import React from 'react';
import { CurrencyRow } from './CurrencyRow';
import {
  BitcoinIcon,
  EthereumIcon,
  USDCIcon,
  USDTIcon,
  SolanaIcon,
  LitecoinIcon,
  BNBIcon,
  XRPIcon,
  DogeIcon,
  TRXIcon,
} from '../icons/CryptoIcons';

interface BalanceDropdownProps {
  isOpen: boolean;
}

export function BalanceDropdown({ isOpen }: BalanceDropdownProps) {
  return (
    <div
      className={`absolute left-1/2 top-full z-50 mt-1 flex min-w-[180px] -translate-x-1/2 flex-col gap-2 rounded-8 bg-dark-500 p-0 shadow-[0_0_16px_#000000CC] lg:min-w-[300px] transition-all duration-200 ease-out ${
        isOpen
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      {/* Rakeback Section */}
      <div className="p-8">
        <div className="w-full rounded-8 bg-dark-500 p-8 pt-4">
          <div className="flex w-full flex-col items-start gap-8 text-b-sm font-semibold text-dark-200 md:flex-row">
            <div className="flex shrink-0 flex-col items-start gap-2">
              <div className="flex items-center gap-4">Rakeback available</div>
              <div className="flex">
                <span className="inline-flex items-center justify-center gap-4 tabular-nums">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center grayscale">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="h-full w-full">
                      <path fill="#2B63F4" d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0" />
                      <path fill="#fff" d="M6.927 11.705a.2.2 0 0 1-.2-.2V2.45c0-.11.09-.2.2-.2h.206c.11 0 .2.09.2.2v9.055a.2.2 0 0 1-.2.2zm1.727-6.43c-.103 0-.186-.078-.212-.177a1 1 0 0 0-.404-.577q-.381-.27-.99-.27-.428 0-.735.13-.306.13-.469.35a.85.85 0 0 0-.059.917 1 1 0 0 0 .3.295q.188.118.417.2t.461.136l.71.178q.428.099.823.27.398.168.713.428.317.258.502.624.185.365.185.857 0 .665-.34 1.17-.34.502-.982.787-.639.28-1.548.28-.883 0-1.533-.273a2.3 2.3 0 0 1-1.012-.797 2.3 2.3 0 0 1-.376-1.07.19.19 0 0 1 .193-.208h.954c.105 0 .19.08.211.184q.056.274.219.473.214.262.557.392.348.129.776.129.447 0 .783-.133a1.27 1.27 0 0 0 .532-.377.9.9 0 0 0 .196-.569.72.72 0 0 0-.174-.487 1.3 1.3 0 0 0-.476-.325 4.6 4.6 0 0 0-.71-.236l-.86-.222q-.934-.24-1.477-.728-.54-.491-.54-1.303 0-.669.362-1.171.366-.502.994-.78.627-.28 1.422-.28.805 0 1.41.28a2.3 2.3 0 0 1 .957.773q.291.411.346.927a.187.187 0 0 1-.191.203z" />
                    </svg>
                  </div>
                  <div className="text-b-md font-bold text-dark-200">0</div>
                </span>
              </div>
            </div>
            <div className="w-full md:ml-auto md:w-auto">
              <button
                disabled
                className="flex h-[40px] w-full items-center justify-center rounded-8 bg-dark-400 px-[12px] text-b-md font-semibold text-light-000 opacity-50 cursor-not-allowed"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-dark-300" />

      {/* Currency List */}
      <div className="flex max-h-[335px] flex-col gap-2 overflow-y-auto">
        <CurrencyRow name="Bitcoin" ticker="BTC" balance="0.00" icon={<BitcoinIcon />} />
        <CurrencyRow name="Ethereum" ticker="ETH" balance="0.00" icon={<EthereumIcon />} />
        <CurrencyRow name="USD Coin" ticker="USDC" balance="0.00" icon={<USDCIcon />} />
        <CurrencyRow name="Tether" ticker="USDT" balance="0.00" icon={<USDTIcon />} />
        <CurrencyRow name="Solana" ticker="SOL" balance="0.00" icon={<SolanaIcon />} />
        <CurrencyRow name="Litecoin" ticker="LTC" balance="0.00" icon={<LitecoinIcon />} />
        <CurrencyRow name="Binance Coin" ticker="BNB" balance="0.00" icon={<BNBIcon />} />
        <CurrencyRow name="Ripple" ticker="XRP" balance="0.00" icon={<XRPIcon />} />
        <CurrencyRow name="Doge" ticker="DOGE" balance="0.00" icon={<DogeIcon />} />
        <CurrencyRow name="TRON" ticker="TRX" balance="0.00" icon={<TRXIcon />} />
      </div>

      <hr className="border-dark-300" />

      {/* Wallet Settings */}
      <div className="p-16">
        <button className="flex h-[22px] w-full items-center justify-center gap-4 text-b-md font-semibold text-dark-100 transition-all hover:text-light-000">
          <div className="h-16 w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
              <path fillRule="evenodd" d="M.583 4.273c0-1.716 1.461-3.106 3.264-3.106h6.061c.257 0 .466.198.466.443v1.241H3.712a.57.57 0 0 0-.583.555c0 .306.261.555.583.555h7.072q.028 0 .055-.003h.2c.37 0 .726.14.988.39.263.25.41.588.41.941v.814h-2.75c-.769 0-1.632.554-1.632 1.503v1.579c0 .95.863 1.504 1.632 1.504h2.75v.813a1.3 1.3 0 0 1-.41.941c-.262.25-.618.39-.989.39H1.982c-.371 0-.727-.14-.989-.39a1.3 1.3 0 0 1-.41-.94zm9.104 2.939h3.264c.257 0 .466.177.466.394v1.579c0 .218-.21.395-.466.395H9.687c-.258 0-.466-.177-.466-.395V7.606c0-.217.208-.394.466-.394" clipRule="evenodd" />
            </svg>
          </div>
          Wallet Settings
        </button>
      </div>
    </div>
  );
}
