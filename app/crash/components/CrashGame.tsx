'use client';

import { memo, useCallback } from 'react';
import { CrashControls } from './CrashControls';
import { CrashChart } from './CrashChart';
import { CrashHistory } from './CrashHistory';
import { useCrashGame } from '../hooks/useCrashGame';
import { ZeroEdgeBadge } from '@/app/components/ZeroEdgeModal';
import { ProvablyFairBadge } from '@/app/components/ProvablyFairModal';

export const CrashGame = memo(function CrashGame() {
  const {
    gameState,
    setBetMode,
    setBetAmount,
    setAutoCashoutAt,
    setAutoConfig,
    joinRound,
    cancelQueuedBet,
    cashout,
    totalBets,
    profitOnWin,
    isInRound,
    hasCashedOut,
    hasQueuedBet,
    canBet,
    canCashout,
    canCancelBet,
  } = useCrashGame();

  const handleBetClick = useCallback(() => {
    joinRound();
  }, [joinRound]);

  const handleCashoutClick = useCallback(() => {
    cashout();
  }, [cashout]);

  const handleCancelBetClick = useCallback(() => {
    cancelQueuedBet();
  }, [cancelQueuedBet]);

  return (
    <div className="mx-auto flex h-[85dvh] max-h-[1000px] w-full max-w-[1260px] flex-row rounded-[12px] bg-dark-900 transition-all duration-200">
      {/* Left panel - Controls */}
      <CrashControls
        betMode={gameState.betMode}
        onBetModeChange={setBetMode}
        betAmount={gameState.betAmount}
        onBetAmountChange={setBetAmount}
        autoCashoutAt={gameState.autoCashoutAt}
        onAutoCashoutChange={setAutoCashoutAt}
        profitOnWin={profitOnWin}
        phase={gameState.phase}
        players={gameState.players}
        totalBets={totalBets}
        isInRound={isInRound}
        hasCashedOut={hasCashedOut}
        hasQueuedBet={hasQueuedBet}
        canBet={canBet}
        canCashout={canCashout}
        canCancelBet={canCancelBet}
        multiplier={gameState.multiplier}
        autoConfig={gameState.autoConfig}
        onAutoConfigChange={setAutoConfig}
        isAutoPlaying={gameState.isAutoPlaying}
        onBetClick={handleBetClick}
        onCashoutClick={handleCashoutClick}
        onCancelBetClick={handleCancelBetClick}
      />

      {/* Right panel - Game area */}
      <div className="relative flex grow flex-col items-center justify-between overflow-hidden px-32 py-16 pl-16 pr-32">
        {/* Bottom gradient */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[50px] rounded-r-12 bg-gradient-to-t from-dark-900 to-transparent" />

        {/* Left gradient */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[30px] bg-gradient-to-r from-dark-900 to-transparent" />

        {/* History at top */}
        <div className="flex w-full items-center justify-end">
          <CrashHistory results={gameState.history} />
        </div>

        {/* Chart area */}
        <div className="mb-8 mt-16 h-full w-full">
          <div className="h-full w-full max-w-full pt-16">
            <CrashChart
              multiplier={gameState.multiplier}
              phase={gameState.phase}
              timeUntilStart={gameState.timeUntilStart}
              isConnected={gameState.isConnected}
              players={gameState.players}
            />
          </div>
        </div>

        {/* Bottom badges */}
        <div className="flex w-full justify-between">
          <ZeroEdgeBadge />
          <ProvablyFairBadge gameName="crash" />
        </div>
      </div>
    </div>
  );
});
