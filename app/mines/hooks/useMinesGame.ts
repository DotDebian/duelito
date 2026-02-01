'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { BetMode } from '@/types';
import type { MinesGameState, AutoBetConfig, Tile } from '../types';
import { GRID_SIZE, calculateMultiplier } from '../types';

const AUTO_TILE_DELAY = 400; // ms entre chaque révélation de tile

const createInitialTiles = (): Tile[] => {
  return Array.from({ length: GRID_SIZE }, (_, index) => ({
    index,
    isMine: false,
    state: 'hidden',
    isClickedByPlayer: false,
  }));
};

const initialAutoConfig: AutoBetConfig = {
  numberOfBets: '10',
  onWin: 'reset',
  onWinPercent: '0',
  onLoss: 'reset',
  onLossPercent: '0',
  stopOnProfit: '',
  stopOnLoss: '',
};

const initialGameState: MinesGameState = {
  phase: 'idle',
  balance: 1000,
  betAmount: '0.00',
  betMode: 'manual',
  numberOfMines: 3,
  tiles: createInitialTiles(),
  minePositions: [],
  revealedDiamonds: 0,
  currentMultiplier: 1,
  autoConfig: initialAutoConfig,
  isAutoPlaying: false,
  autoBetsRemaining: null,
  autoProfit: 0,
  preselectedTiles: [],
  resultHistory: [],
  lastPayout: 0,
};

function generateMinePositions(mineCount: number): number[] {
  const positions: number[] = [];
  while (positions.length < mineCount) {
    const pos = Math.floor(Math.random() * GRID_SIZE);
    if (!positions.includes(pos)) {
      positions.push(pos);
    }
  }
  return positions;
}

export function useMinesGame() {
  const [gameState, setGameState] = useState<MinesGameState>(initialGameState);
  const autoPlayRef = useRef<{ isRunning: boolean; tilesToReveal: number[]; currentIndex: number }>({
    isRunning: false,
    tilesToReveal: [],
    currentIndex: 0,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setBetMode = useCallback((mode: BetMode) => {
    setGameState((prev) => ({
      ...prev,
      betMode: mode,
      phase: mode === 'auto' ? 'selecting' : 'idle',
      tiles: createInitialTiles(),
      preselectedTiles: [],
    }));
  }, []);

  const setBetAmount = useCallback((value: string) => {
    setGameState((prev) => ({ ...prev, betAmount: value }));
  }, []);

  const setNumberOfMines = useCallback((value: number) => {
    setGameState((prev) => ({ ...prev, numberOfMines: value }));
  }, []);

  const updateAutoConfig = useCallback((updates: Partial<AutoBetConfig>) => {
    setGameState((prev) => ({
      ...prev,
      autoConfig: { ...prev.autoConfig, ...updates },
    }));
  }, []);

  const toggleTilePreselection = useCallback((index: number) => {
    setGameState((prev) => {
      if (prev.phase !== 'selecting') return prev;

      const isPreselected = prev.preselectedTiles.includes(index);
      const newPreselected = isPreselected
        ? prev.preselectedTiles.filter((i) => i !== index)
        : [...prev.preselectedTiles, index];

      const newTiles = prev.tiles.map((tile) => ({
        ...tile,
        state: newPreselected.includes(tile.index) ? 'preselected' : 'hidden',
      })) as Tile[];

      return {
        ...prev,
        preselectedTiles: newPreselected,
        tiles: newTiles,
      };
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState((prev) => {
      const minePositions = generateMinePositions(prev.numberOfMines);
      const newTiles = prev.tiles.map((tile) => ({
        ...tile,
        isMine: minePositions.includes(tile.index),
        state: 'hidden' as const,
        isClickedByPlayer: false,
      }));

      return {
        ...prev,
        phase: 'playing',
        minePositions,
        tiles: newTiles,
        revealedDiamonds: 0,
        currentMultiplier: 1,
        lastPayout: 0,
      };
    });
  }, []);

  const revealTile = useCallback((index: number) => {
    setGameState((prev) => {
      if (prev.phase !== 'playing') return prev;

      const tile = prev.tiles[index];
      if (tile.state !== 'hidden') return prev;

      const newTiles = [...prev.tiles];
      const isMine = prev.minePositions.includes(index);

      if (isMine) {
        // Game over - reveal all tiles
        newTiles[index] = {
          ...tile,
          state: 'mine-exploded',
          isClickedByPlayer: true,
        };

        // Reveal remaining tiles
        for (let i = 0; i < newTiles.length; i++) {
          if (i !== index && newTiles[i].state === 'hidden') {
            const isTileMine = prev.minePositions.includes(i);
            newTiles[i] = {
              ...newTiles[i],
              state: isTileMine ? 'mine' : 'diamond',
            };
          }
        }

        const result = {
          id: crypto.randomUUID(),
          isWin: false,
          minesCount: prev.numberOfMines,
          revealedCount: prev.revealedDiamonds,
          betAmount: parseFloat(prev.betAmount) || 0,
          payout: 0,
          multiplier: 0,
        };

        return {
          ...prev,
          phase: 'lost',
          tiles: newTiles,
          resultHistory: [...prev.resultHistory, result],
        };
      } else {
        // Diamond found
        newTiles[index] = {
          ...tile,
          state: 'diamond-clicked',
          isClickedByPlayer: true,
        };

        const newRevealedCount = prev.revealedDiamonds + 1;
        const newMultiplier = calculateMultiplier(
          GRID_SIZE,
          prev.numberOfMines,
          newRevealedCount
        );

        return {
          ...prev,
          tiles: newTiles,
          revealedDiamonds: newRevealedCount,
          currentMultiplier: newMultiplier,
        };
      }
    });
  }, []);

  const cashout = useCallback(() => {
    setGameState((prev) => {
      if (prev.phase !== 'playing' || prev.revealedDiamonds === 0) return prev;

      const betAmount = parseFloat(prev.betAmount) || 0;
      const payout = betAmount * prev.currentMultiplier;

      // Reveal all remaining tiles
      const newTiles = prev.tiles.map((tile) => {
        if (tile.state === 'hidden') {
          const isMine = prev.minePositions.includes(tile.index);
          return {
            ...tile,
            state: isMine ? 'mine' : 'diamond',
          } as Tile;
        }
        return tile;
      });

      const result = {
        id: crypto.randomUUID(),
        isWin: true,
        minesCount: prev.numberOfMines,
        revealedCount: prev.revealedDiamonds,
        betAmount,
        payout,
        multiplier: prev.currentMultiplier,
      };

      return {
        ...prev,
        phase: 'won',
        tiles: newTiles,
        lastPayout: payout - betAmount,
        balance: prev.balance + payout,
        resultHistory: [...prev.resultHistory, result],
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: prev.betMode === 'auto' ? 'selecting' : 'idle',
      tiles: createInitialTiles(),
      minePositions: [],
      revealedDiamonds: 0,
      currentMultiplier: 1,
      preselectedTiles: [],
      lastPayout: 0,
    }));
  }, []);

  // Start a new game directly (reset + start in one action)
  const restartGame = useCallback(() => {
    setGameState((prev) => {
      const minePositions = generateMinePositions(prev.numberOfMines);
      const newTiles = createInitialTiles().map((tile) => ({
        ...tile,
        isMine: minePositions.includes(tile.index),
      }));

      return {
        ...prev,
        phase: 'playing',
        minePositions,
        tiles: newTiles,
        revealedDiamonds: 0,
        currentMultiplier: 1,
        preselectedTiles: [],
        lastPayout: 0,
      };
    });
  }, []);

  // Pick a random unrevealed tile
  const pickRandomTile = useCallback(() => {
    setGameState((prev) => {
      if (prev.phase !== 'playing') return prev;

      // Find all hidden tiles that are not mines
      const hiddenTiles = prev.tiles
        .filter((tile) => tile.state === 'hidden')
        .map((tile) => tile.index);

      if (hiddenTiles.length === 0) return prev;

      // Pick a random one
      const randomIndex = hiddenTiles[Math.floor(Math.random() * hiddenTiles.length)];

      // Reveal it (reuse the reveal logic)
      const tile = prev.tiles[randomIndex];
      const newTiles = [...prev.tiles];
      const isMine = prev.minePositions.includes(randomIndex);

      if (isMine) {
        newTiles[randomIndex] = {
          ...tile,
          state: 'mine-exploded',
          isClickedByPlayer: true,
        };

        for (let i = 0; i < newTiles.length; i++) {
          if (i !== randomIndex && newTiles[i].state === 'hidden') {
            const isTileMine = prev.minePositions.includes(i);
            newTiles[i] = {
              ...newTiles[i],
              state: isTileMine ? 'mine' : 'diamond',
            };
          }
        }

        const result = {
          id: crypto.randomUUID(),
          isWin: false,
          minesCount: prev.numberOfMines,
          revealedCount: prev.revealedDiamonds,
          betAmount: parseFloat(prev.betAmount) || 0,
          payout: 0,
          multiplier: 0,
        };

        return {
          ...prev,
          phase: 'lost',
          tiles: newTiles,
          resultHistory: [...prev.resultHistory, result],
        };
      } else {
        newTiles[randomIndex] = {
          ...tile,
          state: 'diamond-clicked',
          isClickedByPlayer: true,
        };

        const newRevealedCount = prev.revealedDiamonds + 1;
        const newMultiplier = calculateMultiplier(
          GRID_SIZE,
          prev.numberOfMines,
          newRevealedCount
        );

        return {
          ...prev,
          tiles: newTiles,
          revealedDiamonds: newRevealedCount,
          currentMultiplier: newMultiplier,
        };
      }
    });
  }, []);

  const handleTileClick = useCallback((index: number) => {
    setGameState((prev) => {
      if (prev.phase === 'selecting') {
        // Mode auto - toggle preselection
        const isPreselected = prev.preselectedTiles.includes(index);
        const newPreselected = isPreselected
          ? prev.preselectedTiles.filter((i) => i !== index)
          : [...prev.preselectedTiles, index];

        const newTiles = prev.tiles.map((tile) => ({
          ...tile,
          state: newPreselected.includes(tile.index) ? 'preselected' : 'hidden',
        })) as Tile[];

        return {
          ...prev,
          preselectedTiles: newPreselected,
          tiles: newTiles,
        };
      }
      return prev;
    });

    // If playing, reveal the tile (handled separately to avoid state issues)
    if (gameState.phase === 'playing') {
      revealTile(index);
    }
  }, [gameState.phase, revealTile]);

  // Start auto-bet mode
  const startAutoBet = useCallback(() => {
    setGameState((prev) => {
      if (prev.preselectedTiles.length === 0) return prev;

      const numberOfBets = parseInt(prev.autoConfig.numberOfBets) || Infinity;
      const minePositions = generateMinePositions(prev.numberOfMines);
      const newTiles = createInitialTiles().map((tile) => ({
        ...tile,
        isMine: minePositions.includes(tile.index),
      }));

      // Set up auto-play ref
      autoPlayRef.current = {
        isRunning: true,
        tilesToReveal: [...prev.preselectedTiles],
        currentIndex: 0,
      };

      return {
        ...prev,
        phase: 'playing',
        isAutoPlaying: true,
        autoBetsRemaining: numberOfBets,
        minePositions,
        tiles: newTiles,
        revealedDiamonds: 0,
        currentMultiplier: 1,
        lastPayout: 0,
      };
    });
  }, []);

  // Stop auto-bet mode
  const stopAutoBet = useCallback(() => {
    autoPlayRef.current.isRunning = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setGameState((prev) => ({
      ...prev,
      isAutoPlaying: false,
      autoBetsRemaining: null,
    }));
  }, []);

  // Auto-reveal next tile in sequence
  const autoRevealNextTile = useCallback(() => {
    if (!autoPlayRef.current.isRunning) return;

    const { tilesToReveal, currentIndex } = autoPlayRef.current;
    if (currentIndex >= tilesToReveal.length) return;

    const tileIndex = tilesToReveal[currentIndex];
    autoPlayRef.current.currentIndex++;

    revealTile(tileIndex);
  }, [revealTile]);

  // Effect to handle auto-play tile revealing
  useEffect(() => {
    if (!gameState.isAutoPlaying || gameState.phase !== 'playing') return;
    if (!autoPlayRef.current.isRunning) return;

    const { tilesToReveal, currentIndex } = autoPlayRef.current;

    // If we've revealed all tiles without hitting a mine, cashout
    if (currentIndex >= tilesToReveal.length) {
      timeoutRef.current = setTimeout(() => {
        // Auto cashout
        setGameState((prev) => {
          if (prev.phase !== 'playing') return prev;

          const betAmount = parseFloat(prev.betAmount) || 0;
          const payout = betAmount * prev.currentMultiplier;

          const newTiles = prev.tiles.map((tile) => {
            if (tile.state === 'hidden') {
              const isMine = prev.minePositions.includes(tile.index);
              return { ...tile, state: isMine ? 'mine' : 'diamond' } as Tile;
            }
            return tile;
          });

          const result = {
            id: crypto.randomUUID(),
            isWin: true,
            minesCount: prev.numberOfMines,
            revealedCount: prev.revealedDiamonds,
            betAmount,
            payout,
            multiplier: prev.currentMultiplier,
          };

          return {
            ...prev,
            phase: 'won',
            tiles: newTiles,
            lastPayout: payout - betAmount,
            balance: prev.balance + payout,
            resultHistory: [...prev.resultHistory, result],
          };
        });
      }, AUTO_TILE_DELAY);
      return;
    }

    // Reveal next tile with delay
    timeoutRef.current = setTimeout(() => {
      autoRevealNextTile();
    }, AUTO_TILE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [gameState.isAutoPlaying, gameState.phase, gameState.revealedDiamonds, autoRevealNextTile]);

  // Effect to handle auto-bet continuation after game ends
  useEffect(() => {
    if (!gameState.isAutoPlaying) return;
    if (gameState.phase !== 'won' && gameState.phase !== 'lost') return;

    const remaining = gameState.autoBetsRemaining;
    if (remaining !== null && remaining <= 1) {
      // No more bets, stop autobet
      stopAutoBet();
      return;
    }

    // Check stop conditions
    const stopOnProfit = parseFloat(gameState.autoConfig.stopOnProfit) || Infinity;
    const stopOnLoss = parseFloat(gameState.autoConfig.stopOnLoss) || Infinity;

    if (gameState.autoProfit >= stopOnProfit || -gameState.autoProfit >= stopOnLoss) {
      stopAutoBet();
      return;
    }

    // Start next round after delay
    timeoutRef.current = setTimeout(() => {
      if (!autoPlayRef.current.isRunning) return;

      setGameState((prev) => {
        const minePositions = generateMinePositions(prev.numberOfMines);
        const newTiles = createInitialTiles().map((tile) => ({
          ...tile,
          isMine: minePositions.includes(tile.index),
        }));

        // Reset auto-play ref for next round
        autoPlayRef.current = {
          isRunning: true,
          tilesToReveal: [...prev.preselectedTiles],
          currentIndex: 0,
        };

        return {
          ...prev,
          phase: 'playing',
          minePositions,
          tiles: newTiles,
          revealedDiamonds: 0,
          currentMultiplier: 1,
          lastPayout: 0,
          autoBetsRemaining: prev.autoBetsRemaining !== null ? prev.autoBetsRemaining - 1 : null,
        };
      });
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [gameState.isAutoPlaying, gameState.phase, gameState.autoBetsRemaining, gameState.autoProfit, gameState.autoConfig.stopOnProfit, gameState.autoConfig.stopOnLoss, stopAutoBet]);

  // Calculated values
  const nextTileMultiplier = useMemo(() => {
    return calculateMultiplier(
      GRID_SIZE,
      gameState.numberOfMines,
      gameState.revealedDiamonds + 1
    );
  }, [gameState.numberOfMines, gameState.revealedDiamonds]);

  const nextTilePayout = useMemo(() => {
    const bet = parseFloat(gameState.betAmount) || 0;
    return bet * nextTileMultiplier;
  }, [gameState.betAmount, nextTileMultiplier]);

  const currentPayout = useMemo(() => {
    const bet = parseFloat(gameState.betAmount) || 0;
    return bet * gameState.currentMultiplier;
  }, [gameState.betAmount, gameState.currentMultiplier]);

  return {
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
    resetGame,
    restartGame,
    pickRandomTile,
    handleTileClick,
    startAutoBet,
    stopAutoBet,
  };
}
