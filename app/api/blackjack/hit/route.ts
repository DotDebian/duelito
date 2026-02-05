import { NextResponse } from 'next/server';
import { createDeck, shuffleDeck, isBusted, getBestHandValue } from '@/lib/blackjack-utils';
import type { Card, Hand } from '@/app/blackjack/types';

export async function POST(request: Request) {
  const { playerHands, activeHandIndex } = await request.json();

  // Get a random card from a fresh shuffled deck (simplified for mock)
  const deck = shuffleDeck(createDeck());
  const newCard: Card = { ...deck[0], id: `card-${Date.now()}`, faceUp: true };

  console.log('=== HIT ===');
  console.log('New card:', `${newCard.rank}${newCard.suit}`);

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

  console.log('Hand value after hit:', handValue);
  console.log('Is busted:', currentHand.isBusted);

  if (currentHand.isBusted || handValue === 21) {
    // For split hands: play right to left (index 1 -> 0)
    // Find any playable hand (not stood, not busted)
    const playableHandIndex = updatedHands.findIndex(
      (h, i) => i !== activeHandIndex && !h.isStood && !h.isBusted
    );

    if (playableHandIndex !== -1) {
      newActiveIndex = playableHandIndex;
    } else {
      phase = 'dealer_turn';
    }
  }

  console.log('Next phase:', phase);
  console.log('============\n');

  return NextResponse.json({
    playerHands: updatedHands,
    activeHandIndex: newActiveIndex,
    phase,
    newCard,
  });
}
