import type { BetMode } from '@/types';

export type DicePhase = 'idle' | 'rolling' | 'settled';
export type RollMode = 'over' | 'under';

export interface DiceResult {
  id: string;
  value: number;
  isWin: boolean;
  rollOver: number;
  rollMode: RollMode;
  multiplier: number;
  betAmount: number;
  payout: number;
}

export interface AutoBetConfig {
  numberOfBets: string;
  onWin: 'reset' | 'increase';
  onWinPercent: string;
  onLoss: 'reset' | 'increase';
  onLossPercent: string;
  stopOnProfit: string;
  stopOnLoss: string;
}

export interface DiceGameState {
  phase: DicePhase;
  balance: number;
  betAmount: string;
  betMode: BetMode;

  // Game config
  rollOver: number;
  rollMode: RollMode;

  // Current result
  currentResult: number | null;
  resultHistory: DiceResult[];

  // Auto mode
  autoConfig: AutoBetConfig;
  isAutoPlaying: boolean;
  autoBetsRemaining: number | null;
  autoProfit: number;
}
