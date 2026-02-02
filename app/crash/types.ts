export type CrashPhase = 'waiting' | 'ascending' | 'crashed';

export interface CrashAutoBetConfig {
  numberOfBets: string;
  onWin: 'reset' | 'increase';
  onWinPercent: string;
  onLoss: 'reset' | 'increase';
  onLossPercent: string;
  stopOnProfit: string;
  stopOnLoss: string;
}

export interface CrashPlayer {
  id: string;
  username: string;
  avatarUrl: string;
  betAmount: number;
  autoCashoutAt: number | null; // target multiplier for auto-cashout
  cashedOutAt: number | null;
  cashedOutMultiplier: number | null;
  payout: number | null;
}

export interface CrashRound {
  id: string;
  phase: CrashPhase;
  startTime: number; // timestamp when waiting phase started
  ascendStartTime: number | null; // timestamp when ascending phase started
  crashMultiplier: number; // predetermined crash point (only server knows during game)
  currentMultiplier: number; // current displayed multiplier
  players: CrashPlayer[];
  waitingDuration: number; // ms to wait before ascending (10 seconds)
}

export interface CrashRoundPublic {
  id: string;
  phase: CrashPhase;
  startTime: number;
  ascendStartTime: number | null;
  currentMultiplier: number;
  players: CrashPlayer[];
  waitingDuration: number;
  timeUntilStart: number; // ms remaining before ascending
  crashMultiplier?: number; // only sent after crash
}

export interface CrashResult {
  id: string;
  crashMultiplier: number;
  timestamp: number;
}

export interface JoinRoundRequest {
  betAmount: number;
  username: string;
  avatarUrl: string;
  autoCashoutAt?: number; // optional target multiplier for auto-cashout
}

export interface JoinRoundResponse {
  success: boolean;
  playerId?: string;
  error?: string;
}

export interface CashoutRequest {
  playerId: string;
}

export interface CashoutResponse {
  success: boolean;
  multiplier?: number;
  payout?: number;
  error?: string;
}

export type CrashEventType =
  | 'round_start'      // new round started (waiting phase)
  | 'round_ascending'  // betting closed, multiplier climbing
  | 'multiplier_update'// multiplier value changed
  | 'player_joined'    // player joined the round
  | 'player_cashout'   // player cashed out
  | 'round_crashed'    // round ended
  | 'history_update';  // past results updated

export interface MultiplierUpdate {
  roundId: string;
  multiplier: number;
  elapsed: number; // ms since ascending started
  timestamp: number;
}

export interface CrashEvent {
  type: CrashEventType;
  data: CrashRoundPublic | CrashPlayer | CrashResult[] | MultiplierUpdate;
  timestamp: number;
}
