'use client';

import { memo, useCallback } from 'react';
import { CrashControls } from './CrashControls';
import { CrashChart } from './CrashChart';
import { CrashHistory } from './CrashHistory';
import { useCrashGame } from '../hooks/useCrashGame';

// Zero Edge icon
const ZeroEdgeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 14 14"
    className="h-full w-full"
  >
    <g clipPath="url(#icon-duel-house-edge_svg__a)">
      <path d="M6.663.082a.73.73 0 0 1 .775.064l6.27 4.702a.73.73 0 1 1-.878 1.169l-.277-.208v5.37a2.82 2.82 0 0 1-2.821 2.82H4.267a2.82 2.82 0 0 1-2.821-2.82v-5.37l-.277.208a.731.731 0 1 1-.877-1.17L6.56.148zm.336 4.828q-1.245 0-1.928.818t-.684 2.316q0 1.495.684 2.317.683.819 1.928.818 1.245 0 1.93-.818.683-.822.683-2.317 0-1.497-.683-2.316-.684-.818-1.93-.818m1.02 3.3q-.022.824-.265 1.287-.263.505-.755.505-.49 0-.758-.505a2 2 0 0 1-.123-.31zm-1.02-2.123q.492 0 .755.505.074.14.126.312l-1.901.986q.02-.834.262-1.298.268-.504.758-.505" />
    </g>
    <defs>
      <clipPath id="icon-duel-house-edge_svg__a">
        <path d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);

// Provably Fair icon
const ProvablyFairIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    className="h-full w-full"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m1.176 3.27.237 5.245c.115 2.557 1.66 4.852 4.036 5.997l1.324.638a2.84 2.84 0 0 0 2.454 0l1.324-.638c2.376-1.145 3.92-3.44 4.036-5.997l.237-5.245c.017-.375-.33-.68-.705-.677a6 6 0 0 1-2.005-.33c-.746-.256-1.593-.726-2.324-1.184a3.41 3.41 0 0 0-3.58 0c-.73.458-1.578.928-2.324 1.184a6 6 0 0 1-2.005.33c-.375-.004-.722.302-.705.677m10.4 3.193a.952.952 0 0 0-1.497-1.177L7.025 9.172 5.782 8.136A.952.952 0 1 0 4.562 9.6l1.997 1.663a.95.95 0 0 0 1.358-.143z"
      clipRule="evenodd"
    />
  </svg>
);

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
          <div className="flex select-none items-center">
            <button
              type="button"
              className="flex h-[40px] items-center gap-4 rounded-8 px-0 text-b-md font-semibold text-dark-200 transition-all hover:bg-transparent hover:text-light-000 lg:font-bold"
            >
              <div className="size-16">
                <ZeroEdgeIcon />
              </div>
              <div>Zero Edge</div>
            </button>
          </div>
          <div className="flex select-none items-center">
            <button
              type="button"
              className="flex h-[40px] items-center gap-4 rounded-8 px-0 text-b-md font-semibold text-dark-200 transition-all hover:bg-transparent hover:text-light-000 lg:font-bold"
            >
              <div className="size-16">
                <ProvablyFairIcon />
              </div>
              <span>Provably Fair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
