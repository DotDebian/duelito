export interface Game {
  id: string;
  name: string;
  slug: string;
  category: 'originals' | 'casino';
  rtp: number;
  isLive?: boolean;
  image: string;
  provider?: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: number;
  replyTo?: {
    username: string;
    message: string;
  };
  isMod?: boolean;
  isSystem?: boolean;
}

export interface OnlineStats {
  count: number;
  announcement: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export type CurrencyType = 'usdc' | 'usdt' | 'sol' | 'eth' | 'ltc' | 'xrp' | 'duel';

export interface Bet {
  id: string;
  game: string;
  gameIcon: 'dice' | 'blackjack' | 'casino' | 'plinko' | 'crash' | 'mines' | 'keno';
  player: string;
  wager: number;
  currency: CurrencyType;
  multiplier: number;
  payout: number | null;
  timestamp: number;
}

// Plinko types
export type PlinkoRiskLevel = 'low' | 'medium' | 'high';

export interface PlinkoMultiplierConfig {
  multiplier: number;
  probability: number; // percentage
}

export interface PlinkoRowConfig {
  multipliers: PlinkoMultiplierConfig[];
}

export interface PlinkoRiskConfig {
  low: Record<number, PlinkoRowConfig>;
  medium: Record<number, PlinkoRowConfig>;
  high: Record<number, PlinkoRowConfig>;
}

export interface PlinkoConfigResponse {
  config: PlinkoRiskConfig;
  bucketColors: Record<number, string[]>;
}
