import { NextResponse } from 'next/server';
import { createDeck, shuffleDeck, isBlackjack } from '@/lib/blackjack-utils';
import type { Card, Hand } from '@/app/blackjack/types';

export async function POST(request: Request) {
  const { betAmount } = await request.json();
  const bet = parseFloat(betAmount) || 0;

  const deck = shuffleDeck(createDeck());

  // Deal: player gets 1st and 3rd, dealer gets 2nd (up) and 4th (down)
  const playerCards: Card[] = [
    { ...deck[0], faceUp: true },
    { ...deck[2], faceUp: true },
  ];

  const dealerCards: Card[] = [
    { ...deck[1], faceUp: true },
    { ...deck[3], faceUp: false },
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
