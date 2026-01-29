import type { Card, Hand, Suit, Rank } from '@/app/blackjack/types';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  let id = 0;

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `card-${id++}`,
        suit,
        rank,
        faceUp: true,
      });
    }
  }

  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCardValue(card: Card): number[] {
  const { rank } = card;

  if (rank === 'A') {
    return [1, 11];
  }
  if (['K', 'Q', 'J'].includes(rank)) {
    return [10];
  }
  return [parseInt(rank, 10)];
}

export function calculateHandValue(cards: Card[]): number[] {
  const faceUpCards = cards.filter(c => c.faceUp);

  let values = [0];

  for (const card of faceUpCards) {
    const cardValues = getCardValue(card);
    const newValues: number[] = [];

    for (const currentValue of values) {
      for (const cardValue of cardValues) {
        newValues.push(currentValue + cardValue);
      }
    }

    values = [...new Set(newValues)];
  }

  // Filter out busted values if there's a valid one, keep unique
  const validValues = values.filter(v => v <= 21);
  if (validValues.length > 0) {
    return [...new Set(validValues)].sort((a, b) => b - a);
  }

  // All busted, return lowest
  return [Math.min(...values)];
}

export function getBestHandValue(cards: Card[]): number {
  const values = calculateHandValue(cards);
  // Return highest value that's <= 21, or lowest if all bust
  const validValues = values.filter(v => v <= 21);
  if (validValues.length > 0) {
    return Math.max(...validValues);
  }
  return Math.min(...values);
}

export function isBusted(cards: Card[]): boolean {
  return getBestHandValue(cards) > 21;
}

export function isBlackjack(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  const value = getBestHandValue(cards);
  return value === 21;
}

export function canSplitHand(hand: Hand | null): boolean {
  if (!hand || hand.cards.length !== 2) return false;
  const [card1, card2] = hand.cards;
  // Can split if both cards have the same rank or same value (10, J, Q, K all = 10)
  if (card1.rank === card2.rank) return true;
  const val1 = getCardValue(card1)[0];
  const val2 = getCardValue(card2)[0];
  return val1 === val2;
}

export function formatHandValue(cards: Card[]): string {
  const values = calculateHandValue(cards);
  if (values.length === 1) {
    return values[0].toString();
  }
  // Show soft hand (e.g., "5, 15" for A+4)
  return values.sort((a, b) => a - b).join(', ');
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

export function getSuitSymbol(suit: Suit): string {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
  }
}
