'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const DEFAULT_BALANCE = 100;

interface BalanceContextType {
  balance: number;
  addBalance: (amount: number) => void;
  subtractBalance: (amount: number) => boolean;
  setBalance: (amount: number) => void;
  resetBalance: () => void;
}

const BalanceContext = createContext<BalanceContextType | null>(null);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalanceState] = useState<number>(DEFAULT_BALANCE);

  const addBalance = useCallback((amount: number) => {
    setBalanceState(prev => {
      const newBalance = Math.round((prev + amount) * 100) / 100;
      return newBalance;
    });
  }, []);

  const subtractBalance = useCallback((amount: number): boolean => {
    let success = false;
    setBalanceState(prev => {
      if (prev >= amount) {
        success = true;
        return Math.round((prev - amount) * 100) / 100;
      }
      success = false;
      return prev;
    });
    return success;
  }, []);

  const setBalance = useCallback((amount: number) => {
    setBalanceState(Math.round(amount * 100) / 100);
  }, []);

  const resetBalance = useCallback(() => {
    setBalanceState(DEFAULT_BALANCE);
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, addBalance, subtractBalance, setBalance, resetBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}
