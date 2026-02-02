'use client';

import { memo, useRef, useEffect, useState, useMemo } from 'react';
import type { CrashPhase, CrashPlayer } from '../types';

interface CrashChartProps {
  multiplier: number;
  phase: CrashPhase;
  timeUntilStart: number;
  isConnected: boolean;
  players: CrashPlayer[];
}

// Quadratic formula: m(t) = 1 + (t/10)²
const calculateMultiplier = (t: number): number => {
  return 1 + Math.pow(t / 10, 2);
};

// Inverse: t = 10 * sqrt(m - 1)
const calculateTime = (m: number): number => {
  return 10 * Math.sqrt(Math.max(0, m - 1));
};

// Calculate Y axis labels based on current multiplier
function getYAxisLabels(maxMultiplier: number): number[] {
  const range = maxMultiplier - 1;
  const labels: number[] = [];

  for (let i = 0; i <= 4; i++) {
    const value = 1 + (range * i) / 4;
    labels.push(value);
  }

  return labels;
}

export const CrashChart = memo(function CrashChart({
  multiplier,
  phase,
  timeUntilStart,
  isConnected,
  players,
}: CrashChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number | null>(null);

  // Track elapsed time and smooth multiplier
  const startTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const smoothMultiplierRef = useRef<number>(1);
  const multiplierDisplayRef = useRef<HTMLSpanElement>(null);
  const avatarsContainerRef = useRef<HTMLDivElement>(null);

  // Get cashed out players
  const cashedOutPlayers = useMemo(() => {
    return players.filter((p) => p.cashedOutAt && p.cashedOutMultiplier);
  }, [players]);

  // Reset time tracking on phase change
  useEffect(() => {
    if (phase === 'ascending' && startTimeRef.current === 0) {
      startTimeRef.current = performance.now();
    } else if (phase === 'waiting') {
      startTimeRef.current = 0;
      elapsedTimeRef.current = 0;
      smoothMultiplierRef.current = 1;
    }
  }, [phase]);

  // Handle resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    const paddingLeft = 70;
    const chartWidth = width - paddingLeft;
    const chartHeight = height;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw baseline
      ctx.beginPath();
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      ctx.moveTo(paddingLeft, chartHeight);
      ctx.lineTo(width, chartHeight);
      ctx.stroke();

      if (phase === 'waiting') {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      // Update elapsed time from local clock
      if (startTimeRef.current > 0) {
        elapsedTimeRef.current = (performance.now() - startTimeRef.current) / 1000;
      }
      const elapsed = Math.max(0.001, elapsedTimeRef.current);

      // Calculate smooth multiplier from local time (not server value)
      const smoothMultiplier = calculateMultiplier(elapsed);
      smoothMultiplierRef.current = smoothMultiplier;

      // Update multiplier display directly (avoids React re-renders at 60fps)
      if (multiplierDisplayRef.current && phase === 'ascending') {
        multiplierDisplayRef.current.textContent = `${smoothMultiplier.toFixed(2)}x`;
      }

      // Dynamic scales using smooth local multiplier (not server value that jumps)
      // Y padding: multiplier is at ~66% of height (1.5x padding)
      const maxMult = Math.max(1.5, smoothMultiplier * 1.5);
      // X padding: elapsed time is at ~77% of width (1.3x padding)
      const maxTime = Math.max(5, elapsed * 1.3);

      // Update avatar positions directly (avoids React re-renders at 60fps)
      if (avatarsContainerRef.current) {
        const avatars = avatarsContainerRef.current.querySelectorAll<HTMLElement>('[data-cashout-multiplier]');
        avatars.forEach((avatar) => {
          const cashoutMult = parseFloat(avatar.dataset.cashoutMultiplier || '1');
          const cashoutTime = calculateTime(cashoutMult);
          const x = paddingLeft + (cashoutTime / maxTime) * chartWidth;
          const y = chartHeight - ((cashoutMult - 1) / (maxMult - 1)) * chartHeight;
          avatar.style.transform = `translate(${x - 8}px, ${y - 8}px)`;
        });
      }

      const curveColor = phase === 'crashed' ? '#ef4444' : '#3b82f6';

      // Conversion functions
      const multToY = (m: number) => {
        return chartHeight - ((m - 1) / (maxMult - 1)) * chartHeight;
      };
      const timeToX = (t: number) => {
        return paddingLeft + (t / maxTime) * chartWidth;
      };

      // Draw curve using quadratic formula m(t) = 1 + (t/10)²
      ctx.beginPath();
      ctx.strokeStyle = curveColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const numPoints = Math.max(100, Math.floor(elapsed * 20));
      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * elapsed;
        const m = calculateMultiplier(t);

        const x = timeToX(t);
        const y = multToY(m);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw the ball at the current position (uses smoothMultiplier calculated above)
      const ballX = timeToX(elapsed);
      const ballY = multToY(smoothMultiplier);
      ctx.beginPath();
      ctx.fillStyle = curveColor;
      ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
      ctx.fill();

      if (phase === 'ascending') {
        animationFrameRef.current = requestAnimationFrame(draw);
      }
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, multiplier, dimensions]);

  // Y axis labels - use smooth multiplier ref for consistency with canvas
  // (falls back to server multiplier on initial render)
  const currentSmooth = phase === 'ascending' ? smoothMultiplierRef.current : multiplier;
  const maxMult = Math.max(1.5, (currentSmooth || multiplier) * 1.5);
  const yLabels = getYAxisLabels(maxMult);

  // Calculate avatar positions on the curve
  const getAvatarPosition = (cashoutMultiplier: number) => {
    const paddingLeft = 70;
    const chartWidth = dimensions.width - paddingLeft;
    const chartHeight = dimensions.height;

    const elapsed = Math.max(0.001, elapsedTimeRef.current);
    const maxTime = Math.max(5, elapsed * 1.3);
    // Use smooth multiplier for consistent scale with canvas
    const avatarMaxMult = Math.max(1.5, (smoothMultiplierRef.current || multiplier) * 1.5);

    // Find the time when this multiplier was reached using inverse formula
    const cashoutTime = calculateTime(cashoutMultiplier);

    const x = paddingLeft + (cashoutTime / maxTime) * chartWidth;
    const y = chartHeight - ((cashoutMultiplier - 1) / (avatarMaxMult - 1)) * chartHeight;

    return { x, y };
  };

  const getMultiplierColor = () => {
    if (phase === 'crashed') return 'text-red-500';
    return 'text-light-000';
  };

  const getCenterContent = () => {
    if (phase === 'waiting' && timeUntilStart > 0) {
      return (
        <div className="flex flex-col items-center">
          <div className="text-h-lg text-dark-300">Starting in</div>
          <div className="text-h-xxl tabular-nums text-light-000">
            {(timeUntilStart / 1000).toFixed(1)}s
          </div>
        </div>
      );
    }

    if (phase === 'crashed') {
      return (
        <div className="flex flex-col items-center">
          <div className={`text-h-xxl tabular-nums ${getMultiplierColor()}`}>
            <span className="tabular-nums">{multiplier.toFixed(2)}x</span>
          </div>
          <div className="text-h-md text-red-500">CRASHED</div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <div className={`text-h-xxl tabular-nums ${getMultiplierColor()}`}>
          <span ref={multiplierDisplayRef} className="tabular-nums">{multiplier.toFixed(2)}x</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-full w-full">
      {/* Blue glow effect */}
      <div className="absolute bottom-[-5%] left-[-8%] h-1/2 w-1/2 rounded-full bg-blue-500/30 blur-[512px] transition-colors duration-200" />

      {/* Chart container */}
      <div
        ref={containerRef}
        className="relative z-[5] h-full w-full pl-[72px]"
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0 h-full w-full"
          style={{ width: dimensions.width, height: dimensions.height }}
        />

        {/* Cashed out player avatars on curve - positioned same as canvas with inset-0 */}
        <div ref={avatarsContainerRef} className="absolute inset-0">
          {phase !== 'waiting' && cashedOutPlayers.map((player, index) => {
            const cashoutMultiplier = player.cashedOutMultiplier || 1;
            const pos = getAvatarPosition(cashoutMultiplier);
            const isLastCashout = index === cashedOutPlayers.length - 1;
            const winAmount = player.betAmount * cashoutMultiplier;

            return (
              <div
                key={player.id}
                data-cashout-multiplier={cashoutMultiplier}
                className="absolute z-10"
                style={{
                  transform: `translate(${pos.x - 8}px, ${pos.y - 8}px)`,
                }}
              >
                {/* Win amount label - only on last cashout */}
                {isLastCashout && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 whitespace-nowrap text-b-sm text-green-500">
                    <span className="inline-flex items-center justify-center gap-4 tabular-nums">
                      <span>${winAmount.toFixed(2)}</span>
                    </span>
                  </div>
                )}
                {/* Avatar */}
                <div
                  className="flex size-16 items-center justify-center overflow-hidden rounded-full border-2 border-green-500 bg-dark-400"
                  title={`${player.username} @ ${cashoutMultiplier.toFixed(2)}x`}
                >
                  {player.avatarUrl ? (
                    <img
                      src={player.avatarUrl}
                      alt={player.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-[8px] font-bold text-light-000">
                      {player.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Y-axis labels */}
        <div className="absolute bottom-0 left-0 top-0 flex w-[70px] flex-col justify-between">
          {/* Tick marks */}
          <div className="absolute bottom-0 left-0 top-0 w-16">
            {[0, 1, 2, 3].map((section) => (
              <div key={section} className="flex h-[25%] flex-col justify-between">
                <div className="h-[2px] w-4 rounded-full bg-transparent md:w-8" />
                <div className="h-[2px] w-4 rounded-full bg-dark-400 md:w-8" />
                <div className="h-[2px] w-4 rounded-full bg-dark-400 md:w-8" />
                <div className="h-[2px] w-4 rounded-full bg-dark-400 md:w-8" />
                <div className="h-[2px] w-4 rounded-full bg-dark-400 md:w-8" />
                <div className="h-[2px] w-4 rounded-full bg-dark-400 md:w-8" />
                <div className="h-[2px] w-4 rounded-full bg-transparent md:w-8" />
              </div>
            ))}
          </div>

          {/* Labels */}
          {yLabels.reverse().map((label, i) => (
            <div
              key={label}
              className="absolute left-0 flex h-[1px] w-[70px] items-center justify-center"
              style={{ top: `${(i / (yLabels.length - 1)) * 100}%` }}
            >
              <div className="absolute left-0 mr-8 h-[2px] w-8 rounded-full bg-dark-400 pl-8 md:w-16" />
              <div className="relative z-[5] text-b-sm font-bold tabular-nums md:text-h-xs">
                {label.toFixed(1)}x
              </div>
            </div>
          ))}
        </div>

        {/* X-axis line */}
        <div className="absolute bottom-0 left-[72px] right-0 flex h-16 flex-col justify-between border-b border-dark-400" />
      </div>

      {/* Center multiplier display */}
      <div className="pointer-events-none absolute bottom-1/4 left-0 right-0 top-0 flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center justify-center">
          {getCenterContent()}
        </div>
      </div>

      {/* Network status */}
      <div className="absolute bottom-[10px] right-0 z-10 flex flex-col items-end gap-x-16 gap-y-4 md:flex-row md:items-center lg:bottom-[20px] lg:right-0">
        <div className="flex items-center gap-x-8">
          <div className="size-8 min-w-8">
            <div
              className={`absolute size-8 min-w-8 rounded-full opacity-75 ${
                isConnected ? 'bg-green-500 animate-ping' : 'bg-red-500'
              }`}
              style={{ animationDuration: '2s' }}
            />
            <div
              className={`size-8 min-w-8 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          </div>
          <p className="text-b-sm text-light-000 md:text-b-md">Network status</p>
        </div>
      </div>
    </div>
  );
});
