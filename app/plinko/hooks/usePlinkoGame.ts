'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { BetMode, RiskLevel } from '@/types';
import type { DropResult } from '../types';

export function usePlinkoGame() {
  const [betMode, setBetMode] = useState<BetMode>('manual');
  const [betAmount, setBetAmount] = useState('0.00');
  const [risk, setRisk] = useState<RiskLevel>('high');
  const [rows, setRows] = useState(11);
  const [numberOfBets, setNumberOfBets] = useState('');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [resultHistory, setResultHistory] = useState<DropResult[]>([]);

  const resultIdRef = useRef(0);

  useEffect(() => {
    const hasExiting = resultHistory.some((item) => item.exiting);
    if (!hasExiting) return;

    const timer = setTimeout(() => {
      setResultHistory((prev) => prev.filter((item) => !item.exiting));
    }, 400);

    return () => clearTimeout(timer);
  }, [resultHistory]);

  const addResult = useCallback((multiplier: number, color: string) => {
    resultIdRef.current++;
    const newId = resultIdRef.current;
    setResultHistory((prev) => {
      const newResult = { id: newId, multiplier, color };
      const newHistory = [newResult, ...prev];

      return newHistory.map((item, idx) => ({
        ...item,
        exiting: idx >= 10,
      }));
    });
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  return {
    betMode,
    setBetMode,
    betAmount,
    setBetAmount,
    risk,
    setRisk,
    rows,
    setRows,
    numberOfBets,
    setNumberOfBets,
    isAutoPlaying,
    setIsAutoPlaying,
    toggleAutoPlay,
    resultHistory,
    addResult,
  };
}
