'use client';

import { memo, useCallback } from 'react';
import { MinesControls } from './MinesControls';
import { MinesGrid } from './MinesGrid';
import { ResultHistory } from './ResultHistory';
import { WinPopup } from './WinPopup';
import { useMinesGame } from '../hooks/useMinesGame';
import { ZeroEdgeBadge } from '@/app/components/ZeroEdgeModal';
import { ProvablyFairBadge } from '@/app/components/ProvablyFairModal';

export const MinesGame = memo(function MinesGame() {
  const {
    gameState,
    nextTileMultiplier,
    nextTilePayout,
    currentPayout,
    setBetMode,
    setBetAmount,
    setNumberOfMines,
    updateAutoConfig,
    startGame,
    revealTile,
    cashout,
    restartGame,
    pickRandomTile,
    handleTileClick,
    startAutoBet,
    stopAutoBet,
  } = useMinesGame();

  const handleBetClick = useCallback(() => {
    if (gameState.betMode === 'auto') {
      if (gameState.isAutoPlaying) {
        stopAutoBet();
      } else {
        startAutoBet();
      }
    } else {
      if (gameState.phase === 'won' || gameState.phase === 'lost') {
        restartGame();
      } else {
        startGame();
      }
    }
  }, [gameState.betMode, gameState.isAutoPlaying, gameState.phase, stopAutoBet, startAutoBet, restartGame, startGame]);

  const handleGridTileClick = useCallback((index: number) => {
    if (gameState.phase === 'selecting') {
      handleTileClick(index);
    } else if (gameState.phase === 'playing') {
      revealTile(index);
    }
  }, [gameState.phase, handleTileClick, revealTile]);

  const isGridDisabled = gameState.phase === 'idle' || gameState.phase === 'won' || gameState.phase === 'lost' || gameState.isAutoPlaying;

  return (
    <div className="mx-auto flex w-full h-[85dvh] max-w-[1260px] flex-row rounded-[12px] bg-dark-900 max-h-[750px]">
      {/* Left panel - Controls */}
      <MinesControls
        betMode={gameState.betMode}
        onBetModeChange={setBetMode}
        betAmount={gameState.betAmount}
        onBetAmountChange={setBetAmount}
        numberOfMines={gameState.numberOfMines}
        onNumberOfMinesChange={setNumberOfMines}
        nextTileMultiplier={nextTileMultiplier}
        nextTilePayout={nextTilePayout}
        currentMultiplier={gameState.currentMultiplier}
        currentPayout={currentPayout}
        phase={gameState.phase}
        autoConfig={gameState.autoConfig}
        onAutoConfigChange={updateAutoConfig}
        isAutoPlaying={gameState.isAutoPlaying}
        onBetClick={handleBetClick}
        onCashoutClick={cashout}
        onPickRandomClick={pickRandomTile}
      />

      {/* Right panel - Game area */}
      <div className="flex flex-1 min-w-0 flex-col rounded-r-12 bg-dark-900 p-32">
        {/* Result history */}
        <div className="mb-auto flex justify-end">
          <ResultHistory results={gameState.resultHistory} />
        </div>

        {/* Grid area */}
        <div className="flex flex-1 items-center justify-center relative">
          <MinesGrid
            tiles={gameState.tiles}
            phase={gameState.phase}
            onTileClick={handleGridTileClick}
            disabled={isGridDisabled}
          />

          {/* Win popup overlay */}
          <WinPopup
            multiplier={gameState.currentMultiplier}
            payout={gameState.lastPayout}
            visible={gameState.phase === 'won'}
          />
        </div>

        {/* Badges */}
        <div className="mt-auto flex items-center justify-between pt-24">
          <ZeroEdgeBadge />
          <ProvablyFairBadge gameName="mines" />
        </div>
      </div>
    </div>
  );
});
