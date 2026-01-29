'use client';

import { useState, useEffect, useMemo } from 'react';
import type { PlinkoConfigResponse, PlinkoMultiplierConfig, RiskLevel } from '@/types';

export function usePlinkoConfig(risk: RiskLevel, rows: number) {
  const [plinkoConfig, setPlinkoConfig] = useState<PlinkoConfigResponse | null>(null);

  useEffect(() => {
    fetch('/api/plinko/config')
      .then((res) => res.json())
      .then((data: PlinkoConfigResponse) => setPlinkoConfig(data))
      .catch(console.error);
  }, []);

  const currentMultipliers = useMemo<PlinkoMultiplierConfig[]>(() => {
    if (!plinkoConfig) return [];
    return plinkoConfig.config[risk][rows]?.multipliers ?? [];
  }, [plinkoConfig, risk, rows]);

  const currentBucketColors = useMemo<string[]>(() => {
    if (!plinkoConfig) return [];
    return plinkoConfig.bucketColors[rows] ?? [];
  }, [plinkoConfig, rows]);

  return {
    plinkoConfig,
    currentMultipliers,
    currentBucketColors,
  };
}
