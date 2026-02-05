import { NextResponse } from 'next/server';
import { createDeck, shuffleDeck, isBusted, getBestHandValue, isBlackjack } from '@/lib/blackjack-utils';
import type { Card, Hand, HandResult } from '@/app/blackjack/types';

export async function POST(request: Request) {
  const { dealerHand, playerHands, activeHandIndex } = await request.json();

  console.log('=== STAND / DEALER TURN ===');
  console.log('Player hands:', playerHands.map((h: Hand) => ({
    cards: h.cards.map((c: Card) => `${c.rank}${c.suit}`).join(', '),
    value: getBestHandValue(h.cards),
    hasBlackjack: h.hasBlackjack,
    isBusted: h.isBusted,
  })));
  console.log('Dealer hand before reveal:', dealerHand.cards.map((c: Card) => c.faceUp ? `${c.rank}${c.suit}` : '??').join(', '));

  // Mark current hand as stood
  const updatedPlayerHands: Hand[] = playerHands.map((hand: Hand, index: number) => {
    if (index === activeHandIndex) {
      return { ...hand, isStood: true };
    }
    return hand;
  });

  // Check if there are more hands to play
  // For split: right to left (find any playable hand)
  const nextHandIndex = updatedPlayerHands.findIndex(
    (h, i) => i !== activeHandIndex && !h.isStood && !h.isBusted
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

  console.log('Dealer hand revealed:', updatedDealerHand.cards.map((c: Card) => `${c.rank}${c.suit}`).join(', '));
  console.log('Dealer initial value:', getBestHandValue(updatedDealerHand.cards));

  // Check if all player hands are busted - if so, dealer doesn't need to play
  const allPlayerHandsBusted = updatedPlayerHands.every((hand: Hand) => hand.isBusted);

  if (allPlayerHandsBusted) {
    console.log('>>> All player hands BUSTED, dealer does NOT draw');
  } else if (isBlackjack(updatedDealerHand.cards)) {
    // Check for dealer blackjack
    console.log('>>> Dealer has BLACKJACK!');
    updatedDealerHand = { ...updatedDealerHand, hasBlackjack: true };
  } else {
    // Check if any player hand has blackjack - if so, dealer doesn't draw
    const playerHasBlackjack = updatedPlayerHands.some((hand: Hand) => hand.hasBlackjack);
    console.log('Player has blackjack:', playerHasBlackjack);

    if (!playerHasBlackjack) {
      // Dealer draws to 17 only if player doesn't have blackjack
      console.log('Dealer draws to 17...');
      const deck = shuffleDeck(createDeck());
      let cardIndex = 0;

      while (getBestHandValue(updatedDealerHand.cards) < 17) {
        const newCard: Card = {
          ...deck[cardIndex],
          id: `dealer-card-${Date.now()}-${cardIndex}`,
          faceUp: true,
        };
        console.log(`  Dealer draws: ${newCard.rank}${newCard.suit}`);
        updatedDealerHand = {
          ...updatedDealerHand,
          cards: [...updatedDealerHand.cards, newCard],
        };
        cardIndex++;
      }

      console.log('Dealer final value:', getBestHandValue(updatedDealerHand.cards));

      if (isBusted(updatedDealerHand.cards)) {
        console.log('>>> Dealer BUSTED!');
        updatedDealerHand = { ...updatedDealerHand, isBusted: true };
      }
    } else {
      console.log('>>> Player has blackjack, dealer does NOT draw');
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

  console.log('--- RESULTS ---');
  console.log('Dealer final:', updatedDealerHand.cards.map((c: Card) => `${c.rank}${c.suit}`).join(', '), '=', dealerValue);
  console.log('Dealer blackjack:', updatedDealerHand.hasBlackjack);
  console.log('Dealer busted:', dealerBusted);
  console.log('Results per hand:', resultsPerHand);
  console.log('Total payout:', totalPayout);
  console.log('=========================\n');

  return NextResponse.json({
    dealerHand: updatedDealerHand,
    playerHands: updatedPlayerHands,
    phase: 'settled',
    result: overallResult,
    payout: totalPayout,
    resultsPerHand,
  });
}
