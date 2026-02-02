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

// Animation types
export type AnimationPhase = 'queued' | 'moving' | 'flipping' | 'settled';

export interface CardAnimationState {
  cardId: string;
  card: Card;
  phase: AnimationPhase;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  targetHand: 'player' | 'dealer';
  targetIndex: number;
  shouldFlip: boolean;
  isExit?: boolean;
}

export interface CardToAnimate {
  card: Card;
  targetHand: 'player' | 'dealer';
  targetIndex: number;
  shouldFlip: boolean;
  delay: number;
}

export interface BlackjackGameState {
  gameId: string | null;
  phase: GamePhase;
  dealerHand: Hand | null;
  playerHands: Hand[];
  activeHandIndex: number;
  currentBet: number;
  insuranceBet: number | null;
  result: HandResult;
  payout: number;
}
