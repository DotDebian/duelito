'use client';

import { memo } from 'react';
import { BeefControls } from './BeefControls';
import { BeefBoard } from './BeefBoard';
import { useBeefGame } from '../hooks/useBeefGame';

export const BeefGame = memo(function BeefGame() {
  const {
    gameState,
    nextMultiplier,
    canJump,
    canCashout,
    setBetAmount,
    setBetMode,
    setDifficulty,
    updateAutoConfig,
    startGame,
    jump,
    cashout,
    toggleAutoPlay,
  } = useBeefGame();

  return (
    <div className="mx-auto flex h-[85dvh] max-w-[1260px] flex-row rounded-[12px] bg-dark-900 transition-all duration-200 max-h-[750px]">
      {/* Left panel - Controls */}
      <BeefControls
        phase={gameState.phase}
        betMode={gameState.betMode}
        onBetModeChange={setBetMode}
        betAmount={gameState.betAmount}
        onBetAmountChange={setBetAmount}
        difficulty={gameState.difficulty}
        onDifficultyChange={setDifficulty}
        position={gameState.position}
        currentMultiplier={gameState.currentMultiplier}
        potentialPayout={gameState.potentialPayout}
        nextMultiplier={nextMultiplier}
        autoConfig={gameState.autoConfig}
        onAutoConfigChange={updateAutoConfig}
        isAutoPlaying={gameState.isAutoPlaying}
        onStartGame={startGame}
        onJump={jump}
        onCashout={cashout}
        onToggleAutoPlay={toggleAutoPlay}
        canJump={canJump}
        canCashout={canCashout}
      />

      {/* Right panel - Game board */}
      <BeefBoard
        phase={gameState.phase}
        position={gameState.position}
        multipliers={gameState.multipliers}
        hitCarType={gameState.hitCarType}
        currentMultiplier={gameState.currentMultiplier}
        potentialPayout={gameState.potentialPayout}
        resultHistory={gameState.resultHistory}
        betAmount={parseFloat(gameState.betAmount) || 0}
        onJump={jump}
      />
    </div>
  );
});
