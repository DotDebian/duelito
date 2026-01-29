'use client';

import { useMemo } from 'react';
import type { PegConfig } from '../types';

interface CanvasSize {
  width: number;
  height: number;
}

export function usePegConfig(rows: number, canvasSize: CanvasSize): PegConfig {
  return useMemo(() => {
    const { width, height } = canvasSize;
    const topPegs = 3;
    const bottomPegs = rows + 2;
    const totalRows = bottomPegs - topPegs + 1;

    const minPegRadius = 4;
    const maxPegRadius = 7;
    const pegRadius = minPegRadius + ((16 - rows) / (16 - 8)) * (maxPegRadius - minPegRadius);
    const ballRadius = pegRadius + 2;
    const paddingX = pegRadius * 2;
    const paddingTop = 30;
    const paddingBottom = 20;

    const availableHeight = height - paddingTop - paddingBottom;
    const rowSpacing = availableHeight / (totalRows - 1 || 1);
    const bottomRowWidth = width - paddingX * 2;
    const pegSpacing = bottomRowWidth / (bottomPegs - 1);

    const pegs: { x: number; y: number }[][] = [];
    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const pegsInRow = topPegs + rowIndex;
      const y = paddingTop + rowIndex * rowSpacing;
      const rowWidth = (pegsInRow - 1) * pegSpacing;
      const startX = (width - rowWidth) / 2;

      pegs[rowIndex] = [];
      for (let pegIndex = 0; pegIndex < pegsInRow; pegIndex++) {
        pegs[rowIndex][pegIndex] = {
          x: startX + pegIndex * pegSpacing,
          y,
        };
      }
    }

    return { pegs, pegRadius, ballRadius, totalRows, pegSpacing, rowSpacing, paddingTop, paddingX, width };
  }, [rows, canvasSize]);
}
