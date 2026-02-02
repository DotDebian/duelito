import type { BetMode } from '@/types';

export type MinesPhase = 'idle' | 'selecting' | 'playing' | 'won' | 'lost';

export type TileState =
  | 'hidden'        // Non révélée
  | 'preselected'   // Pré-sélectionnée en mode auto
  | 'diamond'       // Diamant révélé (non cliqué)
  | 'diamond-clicked' // Diamant cliqué par le joueur
  | 'mine'          // Mine révélée (après game over)
  | 'mine-exploded'; // Mine explosée (case perdante)

export interface Tile {
  index: number;
  isMine: boolean;
  state: TileState;
  isClickedByPlayer: boolean;
}

export interface MinesResult {
  id: string;
  isWin: boolean;
  minesCount: number;
  revealedCount: number;
  betAmount: number;
  payout: number;
  multiplier: number;
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

export interface MinesGameState {
  phase: MinesPhase;
  betAmount: string;
  betMode: BetMode;

  // Game config
  numberOfMines: number;

  // Grid state
  tiles: Tile[];
  minePositions: number[];
  revealedDiamonds: number;
  currentMultiplier: number;

  // Auto mode
  autoConfig: AutoBetConfig;
  isAutoPlaying: boolean;
  autoBetsRemaining: number | null;
  autoProfit: number;
  preselectedTiles: number[];

  // Results
  resultHistory: MinesResult[];
  lastPayout: number;
}

// Constants
export const GRID_SIZE = 25;
export const MINES_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] as const;

// Multiplier calculation
export function calculateMultiplier(
  totalTiles: number,
  mineCount: number,
  revealedCount: number,
  houseEdge: number = 0.01
): number {
  if (revealedCount === 0) return 1;

  const safeTiles = totalTiles - mineCount;
  let probability = 1;

  for (let i = 0; i < revealedCount; i++) {
    probability *= (safeTiles - i) / (totalTiles - i);
  }

  return (1 - houseEdge) / probability;
}
