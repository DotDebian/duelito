'use client';

import { memo } from 'react';
import type { Tile, MinesPhase } from '../types';
import { MinesTile } from './MinesTile';

interface MinesGridProps {
  tiles: Tile[];
  phase: MinesPhase;
  onTileClick: (index: number) => void;
  disabled: boolean;
}

export const MinesGrid = memo(function MinesGrid({
  tiles,
  phase,
  onTileClick,
  disabled,
}: MinesGridProps) {
  return (
    <div className="w-[512px] h-[512px] shrink-0">
      <div className="grid grid-cols-5 gap-[6px] h-full">
        {tiles.map((tile) => (
          <MinesTile
            key={tile.index}
            tile={tile}
            phase={phase}
            onClick={() => onTileClick(tile.index)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
});
