import { NextResponse } from 'next/server';
import { isBlackjack } from '@/lib/blackjack-utils';
import type { Card, Hand, HandResult } from '@/app/blackjack/types';

export async function POST(request: Request) {
  const { dealerHand, playerHands, acceptInsurance, currentBet } = await request.json();

  const insuranceBet = acceptInsurance ? currentBet / 2 : 0;

  // Reveal dealer's hole card
  const updatedDealerHand: Hand = {
    ...dealerHand,
    cards: dealerHand.cards.map((c: Card) => ({ ...c, faceUp: true })),
    hasBlackjack: isBlackjack(dealerHand.cards.map((c: Card) => ({ ...c, faceUp: true }))),
  };

  // Check if dealer has blackjack
  if (updatedDealerHand.hasBlackjack) {
    // Game ends immediately
    let totalPayout = 0;
    const resultsPerHand: HandResult[] = [];

    for (const hand of playerHands) {
      if (hand.hasBlackjack) {
        resultsPerHand.push('push');
        totalPayout += hand.bet; // Push on blackjack vs blackjack
      } else {
        resultsPerHand.push('lose');
      }
    }

    // Insurance pays 2:1 if dealer has blackjack
    if (acceptInsurance) {
      totalPayout += insuranceBet * 3; // Original bet + 2:1 payout
    }

    return NextResponse.json({
      dealerHand: updatedDealerHand,
      playerHands,
      phase: 'settled',
      result: resultsPerHand[0],
      payout: totalPayout,
      insuranceBet,
      insuranceWon: acceptInsurance,
    });
  }

  // Dealer doesn't have blackjack, insurance lost, continue game
  // Re-hide the hole card for normal play
  const dealerHandForPlay: Hand = {
    ...dealerHand,
    cards: dealerHand.cards.map((c: Card, i: number) => ({
      ...c,
      faceUp: i === 0, // Only first card face up
    })),
  };

  return NextResponse.json({
    dealerHand: dealerHandForPlay,
    playerHands,
    phase: 'player_turn',
    insuranceBet,
    insuranceLost: acceptInsurance,
  });
}
