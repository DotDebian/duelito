import { NextResponse } from 'next/server';
import { createDeck, shuffleDeck, isBusted } from '@/lib/blackjack-utils';
import type { Card, Hand } from '@/app/blackjack/types';

export async function POST(request: Request) {
  const { playerHands, activeHandIndex } = await request.json();

  // Get a random card
  const deck = shuffleDeck(createDeck());
  const newCard: Card = { ...deck[0], id: `card-${Date.now()}`, faceUp: true };

  // Double the bet and add exactly one card, then stand
  const updatedHands: Hand[] = playerHands.map((hand: Hand, index: number) => {
    if (index === activeHandIndex) {
      const newCards = [...hand.cards, newCard];
      const busted = isBusted(newCards);
      return {
        ...hand,
        cards: newCards,
        bet: hand.bet * 2,
        isDoubled: true,
        isBusted: busted,
        isStood: true, // Always stand after double
      };
    }
    return hand;
  });

  // Check if there are more hands to play
  const nextHandIndex = updatedHands.findIndex(
    (h, i) => i > activeHandIndex && !h.isStood && !h.isBusted
  );

  let phase = 'dealer_turn';
  let newActiveIndex = activeHandIndex;

  if (nextHandIndex !== -1) {
    phase = 'player_turn';
    newActiveIndex = nextHandIndex;
  }

  return NextResponse.json({
    playerHands: updatedHands,
    activeHandIndex: newActiveIndex,
    phase,
    newCard,
  });
}
