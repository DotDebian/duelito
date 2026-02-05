import { NextResponse } from 'next/server';
import { createDeck, shuffleDeck, isBlackjack } from '@/lib/blackjack-utils';
import type { Card, Hand } from '@/app/blackjack/types';

export async function POST(request: Request) {
  const { playerHands, activeHandIndex } = await request.json();

  const currentHand: Hand = playerHands[activeHandIndex];
  const [card1, card2] = currentHand.cards;

  // Get two new cards
  const deck = shuffleDeck(createDeck());
  const newCard1: Card = { ...deck[0], id: `card-${Date.now()}-1`, faceUp: true };
  const newCard2: Card = { ...deck[1], id: `card-${Date.now()}-2`, faceUp: true };

  // Create two new hands from the split
  const hand1Cards = [card1, newCard1];
  const hand2Cards = [card2, newCard2];

  const hand1: Hand = {
    cards: hand1Cards,
    bet: currentHand.bet,
    isDoubled: false,
    isSplit: true,
    isStood: isBlackjack(hand1Cards),
    isBusted: false,
    hasBlackjack: isBlackjack(hand1Cards),
  };

  const hand2: Hand = {
    cards: hand2Cards,
    bet: currentHand.bet,
    isDoubled: false,
    isSplit: true,
    isStood: isBlackjack(hand2Cards),
    isBusted: false,
    hasBlackjack: isBlackjack(hand2Cards),
  };

  // Replace current hand with two new hands
  const updatedHands: Hand[] = [
    ...playerHands.slice(0, activeHandIndex),
    hand1,
    hand2,
    ...playerHands.slice(activeHandIndex + 1),
  ];

  // Start with the RIGHT hand (index 1 after split)
  // In blackjack, you play the rightmost hand first
  const rightHandIndex = activeHandIndex + 1;
  let newActiveIndex = rightHandIndex;

  // If right hand already stood (blackjack), move to left hand
  if (hand2.isStood) {
    if (!hand1.isStood && !hand1.isBusted) {
      newActiveIndex = activeHandIndex;
    }
  }

  // Check if all hands are done
  const allDone = updatedHands.every(h => h.isStood || h.isBusted);
  const phase = allDone ? 'dealer_turn' : 'player_turn';

  console.log('=== SPLIT ===');
  console.log('Created hands:', updatedHands.length);
  console.log('Active hand index (should be 1 for right hand):', newActiveIndex);
  console.log('=============');

  return NextResponse.json({
    playerHands: updatedHands,
    activeHandIndex: newActiveIndex,
    phase,
  });
}
