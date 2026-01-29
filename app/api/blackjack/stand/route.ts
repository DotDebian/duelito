import { NextResponse } from 'next/server';
import { createDeck, shuffleDeck, isBusted, getBestHandValue, isBlackjack } from '@/lib/blackjack-utils';
import type { Card, Hand, HandResult } from '@/app/blackjack/types';

export async function POST(request: Request) {
  const { dealerHand, playerHands, activeHandIndex } = await request.json();

  // Mark current hand as stood
  const updatedPlayerHands: Hand[] = playerHands.map((hand: Hand, index: number) => {
    if (index === activeHandIndex) {
      return { ...hand, isStood: true };
    }
    return hand;
  });

  // Check if there are more hands to play
  const nextHandIndex = updatedPlayerHands.findIndex(
    (h, i) => i > activeHandIndex && !h.isStood && !h.isBusted
  );

  if (nextHandIndex !== -1) {
    return NextResponse.json({
      playerHands: updatedPlayerHands,
      activeHandIndex: nextHandIndex,
      phase: 'player_turn',
    });
  }

  // All hands done, dealer's turn
  // Reveal hole card
  let updatedDealerHand: Hand = {
    ...dealerHand,
    cards: dealerHand.cards.map((c: Card) => ({ ...c, faceUp: true })),
  };

  // Check for dealer blackjack
  if (isBlackjack(updatedDealerHand.cards)) {
    updatedDealerHand = { ...updatedDealerHand, hasBlackjack: true };
  } else {
    // Dealer draws to 17
    const deck = shuffleDeck(createDeck());
    let cardIndex = 0;

    while (getBestHandValue(updatedDealerHand.cards) < 17) {
      const newCard: Card = {
        ...deck[cardIndex],
        id: `dealer-card-${Date.now()}-${cardIndex}`,
        faceUp: true,
      };
      updatedDealerHand = {
        ...updatedDealerHand,
        cards: [...updatedDealerHand.cards, newCard],
      };
      cardIndex++;
    }

    if (isBusted(updatedDealerHand.cards)) {
      updatedDealerHand = { ...updatedDealerHand, isBusted: true };
    }
  }

  // Calculate results
  const dealerValue = getBestHandValue(updatedDealerHand.cards);
  const dealerBusted = updatedDealerHand.isBusted;

  let totalPayout = 0;
  const resultsPerHand: HandResult[] = [];

  for (const hand of updatedPlayerHands) {
    if (hand.isBusted) {
      resultsPerHand.push('lose');
      continue;
    }

    const playerValue = getBestHandValue(hand.cards);

    if (hand.hasBlackjack && updatedDealerHand.hasBlackjack) {
      resultsPerHand.push('push');
      totalPayout += hand.bet;
    } else if (hand.hasBlackjack) {
      resultsPerHand.push('blackjack');
      totalPayout += hand.bet * 2.5; // 3:2 payout
    } else if (updatedDealerHand.hasBlackjack) {
      resultsPerHand.push('lose');
    } else if (dealerBusted) {
      resultsPerHand.push('win');
      totalPayout += hand.bet * 2;
    } else if (playerValue > dealerValue) {
      resultsPerHand.push('win');
      totalPayout += hand.bet * 2;
    } else if (playerValue < dealerValue) {
      resultsPerHand.push('lose');
    } else {
      resultsPerHand.push('push');
      totalPayout += hand.bet;
    }
  }

  // Determine overall result (simplified: use first hand result)
  const overallResult = resultsPerHand[0];

  return NextResponse.json({
    dealerHand: updatedDealerHand,
    playerHands: updatedPlayerHands,
    phase: 'settled',
    result: overallResult,
    payout: totalPayout,
    resultsPerHand,
  });
}
