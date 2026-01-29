export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export interface Hand {
  cards: Card[];
  bet: number;
  isDoubled: boolean;
  isSplit: boolean;
  isStood: boolean;
  isBusted: boolean;
  hasBlackjack: boolean;
}

export type GamePhase = 'betting' | 'dealing' | 'player_turn' | 'insurance_offer' | 'dealer_turn' | 'settled';
export type HandResult = 'win' | 'lose' | 'push' | 'blackjack' | null;

export interface BlackjackGameState {
  gameId: string | null;
  phase: GamePhase;
  dealerHand: Hand | null;
  playerHands: Hand[];
  activeHandIndex: number;
  balance: number;
  currentBet: number;
  insuranceBet: number | null;
  result: HandResult;
  payout: number;
}
