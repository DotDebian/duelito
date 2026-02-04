import React from 'react';

interface CurrencyRowProps {
  name: string;
  ticker: string;
  balance: string;
  icon: React.ReactNode;
}

export function CurrencyRow({ name, ticker, balance, icon }: CurrencyRowProps) {
  return (
    <div className="flex h-[40px] flex-shrink-0 cursor-pointer items-center justify-between rounded-none p-16 tabular-nums transition-all duration-200 hover:bg-dark-400">
      <div className="flex items-center text-light-000">
        <div className="mr-8 h-16 w-16">{icon}</div>
        <p className="text-b-md font-semibold">
          <span className="hidden lg:inline">{name}</span>
          <span className="ml-4 text-light-000 lg:text-dark-100">{ticker}</span>
        </p>
      </div>
      <div className="text-b-md text-dark-200">
        <p className="ml-8 font-semibold">${balance}</p>
      </div>
    </div>
  );
}
