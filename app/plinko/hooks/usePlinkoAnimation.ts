'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import type { Ball, ActivePeg, ActiveBucket, PegConfig } from '../types';
import type { PlinkoMultiplierConfig } from '@/types';

interface UsePlinkoAnimationOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  pegConfig: PegConfig;
  canvasSize: { width: number; height: number };
  onBallLanded: (bucketIndex: number, multiplier: number, color: string) => void;
}

export function usePlinkoAnimation({
  canvasRef,
  pegConfig,
  canvasSize,
  onBallLanded,
}: UsePlinkoAnimationOptions) {
  const pegsRef = useRef<{ x: number; y: number }[][]>([]);
  const ballsRef = useRef<Ball[]>([]);
  const activePegsRef = useRef<ActivePeg[]>([]);
  const activeBucketsRef = useRef<ActiveBucket[]>([]);
  const animationRef = useRef<number | null>(null);
  const multipliersRef = useRef<PlinkoMultiplierConfig[]>([]);
  const bucketColorsRef = useRef<string[]>([]);

  const [activeBuckets, setActiveBuckets] = useState<ActiveBucket[]>([]);
  const [isBallDropping, setIsBallDropping] = useState(false);

  useEffect(() => {
    pegsRef.current = pegConfig.pegs;
  }, [pegConfig]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const { pegs, pegRadius } = pegConfig;
    for (let rowIndex = 0; rowIndex < pegs.length; rowIndex++) {
      const row = pegs[rowIndex];
      for (let pegIndex = 0; pegIndex < row.length; pegIndex++) {
        const peg = row[pegIndex];

        const activePeg = activePegsRef.current.find(
          (ap) => ap.rowIndex === rowIndex && ap.pegIndex === pegIndex
        );

        let currentRadius = pegRadius;
        let currentColor = '#6b7280';

        if (activePeg) {
          const t = activePeg.progress;
          const scalePeak = 0.3;
          const scale = t < scalePeak
            ? 1 + 0.5 * (t / scalePeak)
            : 1 + 0.5 * (1 - (t - scalePeak) / (1 - scalePeak));
          currentRadius = pegRadius * scale;

          const colorProgress = t;
          const r = Math.round(255 - (255 - 107) * colorProgress);
          const g = Math.round(255 - (255 - 114) * colorProgress);
          const b = Math.round(255 - (255 - 128) * colorProgress);
          currentColor = `rgb(${r}, ${g}, ${b})`;
        }

        ctx.beginPath();
        ctx.arc(peg.x, peg.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.fill();
      }
    }

    for (const ball of ballsRef.current) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, pegConfig.ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#4558ff';
      ctx.fill();
    }
  }, [canvasSize, pegConfig, canvasRef]);

  const animate = useCallback(() => {
    const balls = ballsRef.current;
    let hasActiveBalls = false;

    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i];
      const distance = Math.abs(ball.targetY - ball.startY);
      const baseSpeed = 0.025;
      const speed = baseSpeed * (pegConfig.rowSpacing / Math.max(distance, 1));
      ball.progress += speed;

      if (ball.progress >= 1) {
        ball.x = ball.targetX;
        ball.y = ball.targetY;
        ball.pathIndex++;

        if (ball.pathIndex > ball.path.length) {
          const bucketIndex = ball.path.filter((dir) => dir === 'R').length;

          activeBucketsRef.current.push({
            index: bucketIndex,
            progress: 0,
          });

          const multiplierConfig = multipliersRef.current[bucketIndex];
          const color = bucketColorsRef.current[bucketIndex];
          if (multiplierConfig) {
            onBallLanded(bucketIndex, multiplierConfig.multiplier, color);
          }

          balls.splice(i, 1);
          continue;
        }

        ball.progress = 0;
        const pegs = pegsRef.current;
        const nextRowIndex = ball.pathIndex;

        if (nextRowIndex < pegs.length) {
          const direction = ball.path[ball.pathIndex - 1];
          const currentRowIndex = ball.pathIndex - 1;
          const currentRow = pegs[currentRowIndex];

          let currentPegIdx = 0;
          let minDist = Infinity;
          for (let j = 0; j < currentRow.length; j++) {
            const dist = Math.abs(currentRow[j].x - ball.x);
            if (dist < minDist) {
              minDist = dist;
              currentPegIdx = j;
            }
          }

          activePegsRef.current.push({
            rowIndex: currentRowIndex,
            pegIndex: currentPegIdx,
            progress: 0,
          });

          const nextPegIdx = direction === 'L' ? currentPegIdx : currentPegIdx + 1;
          const nextPeg = pegs[nextRowIndex][nextPegIdx];

          const { pegRadius, ballRadius } = pegConfig;
          const verticalOffset = pegRadius + ballRadius;

          ball.startX = ball.x;
          ball.startY = ball.y;
          ball.targetX = nextPeg.x;
          ball.targetY = nextPeg.y - verticalOffset;
          ball.direction = direction;
        } else {
          const direction = ball.path[ball.pathIndex - 1] || 'L';
          const { pegSpacing } = pegConfig;

          const lastRowIndex = pegs.length - 1;
          const lastRow = pegs[lastRowIndex];
          let lastPegIdx = 0;
          let minDist = Infinity;
          for (let j = 0; j < lastRow.length; j++) {
            const dist = Math.abs(lastRow[j].x - ball.x);
            if (dist < minDist) {
              minDist = dist;
              lastPegIdx = j;
            }
          }
          activePegsRef.current.push({
            rowIndex: lastRowIndex,
            pegIndex: lastPegIdx,
            progress: 0,
          });

          const horizontalOffset = (pegSpacing / 2) * (direction === 'L' ? -1 : 1);

          ball.startX = ball.x;
          ball.startY = ball.y;
          ball.targetX = ball.x + horizontalOffset;
          ball.targetY = ball.y + pegConfig.rowSpacing;
          ball.direction = direction;
        }
      } else {
        const t = ball.progress;

        ball.x = ball.startX + (ball.targetX - ball.startX) * t;

        if (ball.pathIndex === 0) {
          ball.y = ball.startY + (ball.targetY - ball.startY) * t;
        } else {
          const { rowSpacing } = pegConfig;
          const bounceHeight = rowSpacing * 0.2;

          const deltaY = ball.targetY - ball.startY;
          const a = 2 * deltaY + 4 * bounceHeight;
          const b = -4 * bounceHeight - deltaY;
          const c = ball.startY;

          ball.y = a * t * t + b * t + c;
        }
      }

      hasActiveBalls = true;
    }

    const activepegs = activePegsRef.current;
    for (let i = activepegs.length - 1; i >= 0; i--) {
      activepegs[i].progress += 0.025;
      if (activepegs[i].progress >= 1) {
        activepegs.splice(i, 1);
      }
    }

    const activebuckets = activeBucketsRef.current;
    let bucketsChanged = false;
    for (let i = activebuckets.length - 1; i >= 0; i--) {
      activebuckets[i].progress += 0.03;
      bucketsChanged = true;
      if (activebuckets[i].progress >= 1) {
        activebuckets.splice(i, 1);
      }
    }
    if (bucketsChanged) {
      setActiveBuckets([...activebuckets]);
    }

    draw();

    const hasActiveAnimation = hasActiveBalls || activepegs.length > 0 || activebuckets.length > 0;
    if (hasActiveAnimation) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      animationRef.current = null;
      setIsBallDropping(false);
    }
  }, [draw, pegConfig, onBallLanded]);

  const dropBall = useCallback((path: ('L' | 'R')[]) => {
    const pegs = pegsRef.current;
    if (pegs.length === 0 || path.length === 0) return;

    const firstRow = pegs[0];
    const centerPegIndex = Math.floor(firstRow.length / 2);
    const startX = firstRow[centerPegIndex].x;
    const startY = pegConfig.paddingTop - 30;

    const firstDirection = path[0];
    const { pegRadius, ballRadius } = pegConfig;
    const verticalOffset = pegRadius + ballRadius;

    const ball: Ball = {
      x: startX,
      y: startY,
      startX: startX,
      startY: startY,
      targetX: firstRow[centerPegIndex].x,
      targetY: firstRow[centerPegIndex].y - verticalOffset,
      progress: 0,
      path,
      pathIndex: 0,
      direction: firstDirection,
    };

    ballsRef.current.push(ball);
    setIsBallDropping(true);

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [animate, pegConfig]);

  const updateMultipliers = useCallback((multipliers: PlinkoMultiplierConfig[]) => {
    multipliersRef.current = multipliers;
  }, []);

  const updateBucketColors = useCallback((colors: string[]) => {
    bucketColorsRef.current = colors;
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    dropBall,
    isBallDropping,
    activeBuckets,
    updateMultipliers,
    updateBucketColors,
  };
}
