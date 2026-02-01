'use client';

import { memo, useMemo } from 'react';
import { DiceControls } from './DiceControls';
import { DiceSlider } from './DiceSlider';
import { DiceConfigFields } from './DiceConfigFields';
import { ResultTooltip } from './ResultTooltip';
import { ResultHistory } from './ResultHistory';
import { useDiceGame } from '../hooks/useDiceGame';

export const DiceGame = memo(function DiceGame() {
  const {
    gameState,
    winChance,
    multiplier,
    profitOnWin,
    setBetAmount,
    setBetMode,
    setRollOver,
    toggleRollMode,
    setMultiplier,
    setWinChance,
    updateAutoConfig,
    clearCurrentResult,
    roll,
    toggleAutoPlay,
  } = useDiceGame();

  const isRolling = gameState.phase === 'rolling';
  const controlsDisabled = isRolling;

  // Determine if last result was a win
  const lastResultIsWin = useMemo(() => {
    if (gameState.currentResult === null) return false;
    return gameState.rollMode === 'over'
      ? gameState.currentResult > gameState.rollOver
      : gameState.currentResult < gameState.rollOver;
  }, [gameState.currentResult, gameState.rollOver, gameState.rollMode]);

  const handleActionClick = () => {
    if (gameState.betMode === 'auto') {
      toggleAutoPlay();
    } else {
      roll();
    }
  };

  return (
    <div className="mx-auto flex h-[85dvh] max-w-[1260px] flex-row rounded-[12px] bg-dark-900 transition-all duration-200 max-h-[750px]">
      {/* Left panel - Controls */}
      <DiceControls
        betMode={gameState.betMode}
        onBetModeChange={setBetMode}
        betAmount={gameState.betAmount}
        onBetAmountChange={setBetAmount}
        profitOnWin={profitOnWin}
        autoConfig={gameState.autoConfig}
        onAutoConfigChange={updateAutoConfig}
        isAutoPlaying={gameState.isAutoPlaying}
        isRolling={isRolling}
        onActionClick={handleActionClick}
        disabled={controlsDisabled && gameState.betMode === 'manual'}
      />

      {/* Right panel - Game area */}
      <div className="flex flex-1 flex-col rounded-r-12 bg-dark-900 p-32">
        {/* Result history */}
        <div className="mb-auto">
          <ResultHistory results={gameState.resultHistory} />
        </div>

        {/* Slider area */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="relative w-full max-w-[800px]">
            {/* Slider */}
            <div className="m-auto w-[calc(100%-32px)] max-w-[700px] rounded-full border-2 border-dark-600 bg-dark-900 p-8">
              {/* Result tooltip */}
              <ResultTooltip
                result={gameState.currentResult}
                isWin={lastResultIsWin}
                resultCount={gameState.resultHistory.length}
              />

              <DiceSlider
                rollOver={gameState.rollOver}
                rollMode={gameState.rollMode}
                onChange={setRollOver}
                onInteractionStart={clearCurrentResult}
                disabled={controlsDisabled}
              />
            </div>
          </div>
        </div>

        {/* Config fields and badges */}
        <div className="mt-auto mx-32 max-w-[700px]">
          <DiceConfigFields
            multiplier={multiplier}
            rollOver={gameState.rollOver}
            winChance={winChance}
            rollMode={gameState.rollMode}
            onMultiplierChange={setMultiplier}
            onRollOverChange={setRollOver}
            onWinChanceChange={setWinChance}
            onToggleRollMode={toggleRollMode}
            disabled={controlsDisabled}
          />
        </div>

        {/* Badges */}
        <div className="mt-24 flex items-center justify-between mt-[52px]">
          <div className="flex items-center gap-4 text-b-md text-dark-200 font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14"
                 className="ms-h-full ms-w-full size-16">
              <g clipPath="url(#icon-duel-house-edge_svg__a)">
                <path
                  d="M6.663.082a.73.73 0 0 1 .775.064l6.27 4.702a.73.73 0 1 1-.878 1.169l-.277-.208v5.37a2.82 2.82 0 0 1-2.821 2.82H4.267a2.82 2.82 0 0 1-2.821-2.82v-5.37l-.277.208a.731.731 0 1 1-.877-1.17L6.56.148zm.336 4.828q-1.245 0-1.928.818t-.684 2.316q0 1.495.684 2.317.683.819 1.928.818 1.245 0 1.93-.818.683-.822.683-2.317 0-1.497-.683-2.316-.684-.818-1.93-.818m1.02 3.3q-.022.824-.265 1.287-.263.505-.755.505-.49 0-.758-.505a2 2 0 0 1-.123-.31zm-1.02-2.123q.492 0 .755.505.074.14.126.312l-1.901.986q.02-.834.262-1.298.268-.504.758-.505"></path>
              </g>
              <defs>
                <clipPath id="icon-duel-house-edge_svg__a">
                  <path d="M0 0h14v14H0z"></path>
                </clipPath>
              </defs>
            </svg>
            <span>Zero Edge</span>
          </div>
          <div className="flex items-center gap-4 text-b-md text-dark-200 font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" className="ms-h-full ms-w-full size-16">
              <path fill="currentColor" fillRule="evenodd"
                    d="m1.176 3.27.237 5.245c.115 2.557 1.66 4.852 4.036 5.997l1.324.638a2.84 2.84 0 0 0 2.454 0l1.324-.638c2.376-1.145 3.92-3.44 4.036-5.997l.237-5.245c.017-.375-.33-.68-.705-.677a6 6 0 0 1-2.005-.33c-.746-.256-1.593-.726-2.324-1.184a3.41 3.41 0 0 0-3.58 0c-.73.458-1.578.928-2.324 1.184a6 6 0 0 1-2.005.33c-.375-.004-.722.302-.705.677m10.4 3.193a.952.952 0 0 0-1.497-1.177L7.025 9.172 5.782 8.136A.952.952 0 1 0 4.562 9.6l1.997 1.663a.95.95 0 0 0 1.358-.143z"
                    clipRule="evenodd" />
            </svg>
            <span>Provably Fair</span>
          </div>
        </div>
      </div>
    </div>
  );
});
