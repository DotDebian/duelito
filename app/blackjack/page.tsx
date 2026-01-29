'use client';

import { GameLayout } from '@/app/components';
import { BlackjackTable, BlackjackBottomControls } from './components';
import { useBlackjackGame } from './hooks';

export default function BlackjackPage() {
  const {
    gameState,
    betAmount,
    setBetAmount,
    isLoading,
    deal,
    hit,
    stand,
    double,
    split,
    acceptInsurance,
    declineInsurance,
    newGame,
    canHit,
    canStand,
    canDouble,
    canSplit,
  } = useBlackjackGame();

  const showResult = gameState.phase === 'settled';

  return (
    <GameLayout>
      {/* Main container matching duel.com structure */}
      <div className="relative -mx-16 w-[calc(100%+32px)] overflow-hidden sm:-mx-32 sm:w-[calc(100%+64px)] md:h-[calc(100vh-80px)]">
        {/* Table area */}
        <BlackjackTable
          dealerHand={gameState.dealerHand}
          playerHands={gameState.playerHands}
          activeHandIndex={gameState.activeHandIndex}
          result={gameState.result}
          showResult={showResult}
        />

        {/* Bottom controls */}
        <BlackjackBottomControls
          phase={gameState.phase}
          betAmount={betAmount}
          onBetAmountChange={setBetAmount}
          onDeal={deal}
          onNewGame={newGame}
          onHit={hit}
          onStand={stand}
          onDouble={double}
          onSplit={split}
          onAcceptInsurance={acceptInsurance}
          onDeclineInsurance={declineInsurance}
          canHit={canHit}
          canStand={canStand}
          canDouble={canDouble}
          canSplit={canSplit}
          isLoading={isLoading}
          result={gameState.result}
          payout={gameState.payout}
        />
      </div>
    </GameLayout>
  );
}
