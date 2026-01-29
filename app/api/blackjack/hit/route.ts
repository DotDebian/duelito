import { NextResponse } from 'next/server';
import { createDeck, shuffleDeck, isBusted, getBestHandValue } from '@/lib/blackjack-utils';
import type { Card, Hand } from '@/app/blackjack/types';

export async function POST(request: Request) {
  const { playerHands, activeHandIndex } = await request.json();

  // Get a random card from a fresh shuffled deck (simplified for mock)
  const deck = shuffleDeck(createDeck());
  const newCard: Card = { ...deck[0], id: `card-${Date.now()}`, faceUp: true };

  // Add card to active hand
  const updatedHands: Hand[] = playerHands.map((hand: Hand, index: number) => {
    if (index === activeHandIndex) {
      const newCards = [...hand.cards, newCard];
      const busted = isBusted(newCards);
      return {
        ...hand,
        cards: newCards,
        isBusted: busted,
        isStood: busted, // Auto-stand if busted
      };
    }
    return hand;
  });

  const currentHand = updatedHands[activeHandIndex];
  const handValue = getBestHandValue(currentHand.cards);

  // Check if we should auto-stand (21 or busted)
  let phase = 'player_turn';
  let newActiveIndex = activeHandIndex;

  if (currentHand.isBusted || handValue === 21) {
    // Move to next hand or dealer turn
    const nextHandIndex = updatedHands.findIndex(
      (h, i) => i > activeHandIndex && !h.isStood && !h.isBusted
    );

    if (nextHandIndex !== -1) {
      newActiveIndex = nextHandIndex;
    } else {
      phase = 'dealer_turn';
    }
  }

  return NextResponse.json({
    playerHands: updatedHands,
    activeHandIndex: newActiveIndex,
    phase,
    newCard,
  });
}
