'use client';

import { useRef, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { GameLayout } from '@/app/components';
import {
  PlinkoCanvas,
  PlinkoBuckets,
  PlinkoResultHistory,
  PlinkoBottomControls,
  PlinkoBettingSidebar,
} from './components';
import {
  usePlinkoGame,
  usePlinkoConfig,
  usePegConfig,
  usePlinkoAnimation,
} from './hooks';

export default function PlinkoPage() {
  const {
    betMode,
    setBetMode,
    betAmount,
    setBetAmount,
    numberOfBets,
    setNumberOfBets,
    risk,
    setRisk,
    rows,
    setRows,
    isAutoPlaying,
    toggleAutoPlay,
    resultHistory,
    addResult,
    deductBet,
    canBet,
  } = usePlinkoGame();

  const { currentMultipliers, currentBucketColors } = usePlinkoConfig(risk, rows);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 450 });

  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.min(rect.width, 600);
        const height = Math.min(rect.height - 50, 450);
        setCanvasSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const pegConfig = usePegConfig(rows, canvasSize);

  const handleBallLanded = useCallback(
    (_bucketIndex: number, multiplier: number, color: string) => {
      addResult(multiplier, color);
    },
    [addResult]
  );

  const {
    dropBall,
    isBallDropping,
    activeBuckets,
    updateMultipliers,
    updateBucketColors,
  } = usePlinkoAnimation({
    canvasRef,
    pegConfig,
    canvasSize,
    onBallLanded: handleBallLanded,
  });

  useEffect(() => {
    updateMultipliers(currentMultipliers);
  }, [currentMultipliers, updateMultipliers]);

  useEffect(() => {
    updateBucketColors(currentBucketColors);
  }, [currentBucketColors, updateBucketColors]);

  const controlsDisabled = isAutoPlaying || isBallDropping;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const dropRandomBall = () => {
      // Check if we can bet before dropping
      if (!canBet()) {
        toggleAutoPlay();
        return;
      }

      // Deduct bet
      deductBet();

      const path: ('L' | 'R')[] = [];
      for (let i = 0; i < rows; i++) {
        path.push(Math.random() < 0.5 ? 'L' : 'R');
      }
      dropBall(path);
    };

    dropRandomBall();
    const interval = setInterval(dropRandomBall, 330);

    return () => clearInterval(interval);
  }, [isAutoPlaying, rows, dropBall, canBet, deductBet, toggleAutoPlay]);

  const handleActionClick = useCallback(() => {
    if (betMode === 'auto') {
      toggleAutoPlay();
    } else {
      // Check if we can bet before dropping
      if (!canBet()) return;

      // Deduct bet
      deductBet();

      const path: ('L' | 'R')[] = [];
      for (let i = 0; i < rows; i++) {
        path.push(Math.random() < 0.5 ? 'L' : 'R');
      }
      dropBall(path);
    }
  }, [betMode, rows, dropBall, toggleAutoPlay, canBet, deductBet]);

  return (
    <GameLayout>
      <div className="mx-auto flex h-[85dvh] max-h-[750px] w-full max-w-[1260px] flex-row rounded-12 bg-dark-900 transition-all duration-200">
        <PlinkoBettingSidebar
          betMode={betMode}
          onBetModeChange={setBetMode}
          betAmount={betAmount}
          onBetAmountChange={setBetAmount}
          numberOfBets={numberOfBets}
          onNumberOfBetsChange={setNumberOfBets}
          risk={risk}
          onRiskChange={setRisk}
          rows={rows}
          onRowsChange={setRows}
          isAutoPlaying={isAutoPlaying}
          controlsDisabled={controlsDisabled}
          onActionClick={handleActionClick}
        />

        <div className="relative grow overflow-hidden px-32 py-16">
          <div className="flex h-full flex-col items-center justify-between">
            <PlinkoResultHistory results={resultHistory} />

            <div ref={containerRef} className="w-full max-w-[600px] flex-1">
              <div className="relative flex h-full w-full flex-col items-center justify-center">
                <PlinkoCanvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                />

                <PlinkoBuckets
                  multipliers={currentMultipliers}
                  bucketColors={currentBucketColors}
                  activeBuckets={activeBuckets}
                />
              </div>
            </div>

            <PlinkoBottomControls />
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
