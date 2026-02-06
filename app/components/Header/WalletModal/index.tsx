'use client';

import { useEffect } from 'react';
import { WalletDepositTab } from './WalletDepositTab';
import { WalletWithdrawTab } from './WalletWithdrawTab';
import { WalletBuyCryptoTab } from './WalletBuyCryptoTab';
import { WalletTipTab } from './WalletTipTab';

type WalletTab = 'deposit' | 'withdraw' | 'buy' | 'tip';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: WalletTab;
  onTabChange: (tab: WalletTab) => void;
}

const walletTabs: WalletTab[] = ['deposit', 'withdraw', 'buy', 'tip'];

const walletTabLabels: Record<WalletTab, string> = {
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  buy: 'Buy Crypto',
  tip: 'Tip',
};

const getWalletTabWidth = () => {
  return 104;
};

const getWalletTabOffset = (tab: WalletTab) => {
  const index = walletTabs.indexOf(tab);
  return 4 + index * 108;
};

export function WalletModal({ isOpen, onClose, activeTab, onTabChange }: WalletModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="pointer-events-none fixed inset-0 bg-dark-900/90"
        style={{ zIndex: 102 }}
      />
      <div
        className="fixed inset-0 m-auto flex items-center justify-center transition-all duration-300"
        style={{ zIndex: 103 }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative z-10 flex w-[500px] max-w-[500px] touch-none flex-col rounded-12 bg-dark-500"
          style={{ maxWidth: '500px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col overflow-hidden rounded-12">
            {/* Header */}
            <div>
              <div className="flex flex-col gap-8 px-16 py-32 sm:px-32">
                <h2 className="flex items-center gap-8 text-h-md text-light-000">Wallet</h2>
              </div>
            </div>

            {/* Content */}
            <div className="scrollbar flex flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden px-16 pb-16 pt-0 sm:px-32 sm:pb-32">
              <div className="flex flex-col gap-16">
                {/* Tabs */}
                <div
                  role="tablist"
                  aria-orientation="horizontal"
                  className="relative inline-flex h-[48px] w-full gap-4 rounded-12 bg-dark-600 p-4"
                >
                  {/* Animated Background */}
                  <div
                    className="absolute left-0 top-[4px] z-10 h-[calc(100%-8px)] rounded-8 bg-dark-400 transition-all duration-200"
                    style={{
                      width: getWalletTabWidth(),
                      transform: `translateX(${getWalletTabOffset(activeTab)}px)`,
                      willChange: 'transform, width',
                    }}
                  />

                  {walletTabs.map((tab) => (
                    <button
                      key={tab}
                      role="tab"
                      type="button"
                      aria-selected={activeTab === tab}
                      onClick={() => onTabChange(tab)}
                      className={`z-20 flex h-full w-full cursor-pointer items-center justify-center text-nowrap rounded-8 px-[12px] py-8 text-b-md font-semibold outline-none transition-all duration-100 ${
                        activeTab === tab
                          ? 'text-light-000'
                          : 'text-dark-200 hover:text-light-000'
                      }`}
                    >
                      {walletTabLabels[tab]}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="w-full transition-all duration-150">
                  <div>
                    {activeTab === 'deposit' && <WalletDepositTab />}
                    {activeTab === 'withdraw' && <WalletWithdrawTab />}
                    {activeTab === 'buy' && <WalletBuyCryptoTab />}
                    {activeTab === 'tip' && <WalletTipTab />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-[14px] top-[14px] z-10 flex h-[48px] flex-row items-center justify-center rounded-8 px-16 text-dark-100 transition-all hover:bg-dark-600 hover:text-light-000"
          >
            <div className="h-16 w-16">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
                <path d="m8.285 7 4.363-4.362c.12-.12.186-.28.186-.452a.63.63 0 0 0-.186-.45l-.383-.383a.63.63 0 0 0-.451-.186.63.63 0 0 0-.451.186L7 5.715 2.638 1.353a.63.63 0 0 0-.451-.186.63.63 0 0 0-.451.186l-.383.382a.64.64 0 0 0 0 .903L5.716 7l-4.363 4.362a.63.63 0 0 0-.186.452c0 .17.066.33.186.45l.383.383c.12.12.28.186.45.186.172 0 .332-.066.452-.186L7 8.285l4.363 4.362c.12.12.28.186.45.186.172 0 .332-.066.452-.186l.383-.382c.12-.12.186-.28.186-.451a.63.63 0 0 0-.186-.452z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
