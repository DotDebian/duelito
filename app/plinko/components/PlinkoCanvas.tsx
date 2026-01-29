'use client';

import { forwardRef } from 'react';

interface PlinkoCanvasProps {
  width: number;
  height: number;
}

export const PlinkoCanvas = forwardRef<HTMLCanvasElement, PlinkoCanvasProps>(
  function PlinkoCanvas({ width, height }, ref) {
    return (
      <canvas
        ref={ref}
        className="rounded-8"
        style={{
          width,
          height,
          maxWidth: '100%',
        }}
      />
    );
  }
);
