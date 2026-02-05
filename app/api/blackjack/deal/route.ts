import { NextResponse } from 'next/server';
import { createDeck, shuffleDeck, isBlackjack } from '@/lib/blackjack-utils';
import type { Card, Hand } from '@/app/blackjack/types';

export async function POST(request: Request) {
  const { betAmount } = await request.json();
  const bet = parseFloat(betAmount) || 0;

  const deck = shuffleDeck(createDeck());

  // TEMP: Force player to get a pair for Double testing
  // Find two cards with the same rank for the player
  const usedIndices = new Set<number>();
  const targetRank = deck[0].rank;
  const firstCardIndex = 0;
  usedIndices.add(firstCardIndex);

  // Find another card with the same rank
  let secondCardIndex = deck.findIndex((c, i) => i !== firstCardIndex && c.rank === targetRank);
  if (secondCardIndex === -1) secondCardIndex = 1; // Fallback
  usedIndices.add(secondCardIndex);

  // Find cards for dealer that aren't used
  let dealerCard1Index = deck.findIndex((_, i) => !usedIndices.has(i));
  usedIndices.add(dealerCard1Index);
  let dealerCard2Index = deck.findIndex((_, i) => !usedIndices.has(i));

  const playerCards: Card[] = [
    { ...deck[firstCardIndex], faceUp: true },
    { ...deck[secondCardIndex], faceUp: true },
  ];

  const dealerCards: Card[] = [
    { ...deck[dealerCard1Index], faceUp: true },
    { ...deck[dealerCard2Index], faceUp: false },
  ];

  const playerHasBlackjack = isBlackjack(playerCards);
  const dealerShowsAce = dealerCards[0].rank === 'A';

  console.log('=== DEAL ===');
  console.log('Player cards:', playerCards.map(c => `${c.rank}${c.suit}`).join(', '));
  console.log('Dealer cards:', dealerCards.map(c => c.faceUp ? `${c.rank}${c.suit}` : '??').join(', '));
  console.log('Player has blackjack:', playerHasBlackjack);
  console.log('Dealer shows Ace:', dealerShowsAce);

  const dealerHand: Hand = {
    cards: dealerCards,
    bet: 0,
    isDoubled: false,
    isSplit: false,
    isStood: false,
    isBusted: false,
    hasBlackjack: false, // Will be revealed later
  };

  const playerHand: Hand = {
    cards: playerCards,
    bet,
    isDoubled: false,
    isSplit: false,
    isStood: playerHasBlackjack,
    isBusted: false,
    hasBlackjack: playerHasBlackjack,
  };

  // Determine phase
  let phase: string;
  if (playerHasBlackjack) {
    phase = 'dealer_turn';
  } else if (dealerShowsAce) {
    phase = 'insurance_offer';
  } else {
    phase = 'player_turn';
  }

  console.log('Initial phase:', phase);
  console.log('================\n');

  return NextResponse.json({
    gameId: crypto.randomUUID(),
    dealerHand,
    playerHands: [playerHand],
    phase,
    activeHandIndex: 0,
    remainingDeck: deck.slice(4).map(c => c.id),
  });
}
