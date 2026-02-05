'use client';

import { memo, useMemo } from 'react';
import { DiceControls } from './DiceControls';
import { DiceSlider } from './DiceSlider';
import { DiceConfigFields } from './DiceConfigFields';
import { ResultTooltip } from './ResultTooltip';
import { ResultHistory } from './ResultHistory';
import { useDiceGame } from '../hooks/useDiceGame';
import { ZeroEdgeBadge } from '@/app/components/ZeroEdgeModal';
import { ProvablyFairBadge } from '@/app/components/ProvablyFairModal';

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
    <div className="mx-auto flex h-[85dvh] w-[94%] max-w-[1260px] flex-row rounded-[12px] bg-dark-900 transition-all duration-200 max-h-[750px]">
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
          <ZeroEdgeBadge />
          <ProvablyFairBadge gameName="dice" />
        </div>
      </div>
    </div>
  );
});
