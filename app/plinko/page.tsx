'use client';

import { useState, useRef, useCallback, useEffect, useMemo, useLayoutEffect } from 'react';
import { GameLayout } from '@/app/components';
import type { PlinkoConfigResponse, PlinkoMultiplierConfig } from '@/types';

type BetMode = 'manual' | 'auto';
type RiskLevel = 'low' | 'medium' | 'high';

export default function PlinkoPage() {
  const [betMode, setBetMode] = useState<BetMode>('manual');
  const [betAmount, setBetAmount] = useState('0.00');
  const [risk, setRisk] = useState<RiskLevel>('high');
  const [rows, setRows] = useState(11);
  const [numberOfBets, setNumberOfBets] = useState('');

  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [plinkoConfig, setPlinkoConfig] = useState<PlinkoConfigResponse | null>(null);

  // Result history
  type DropResult = {
    id: number;
    multiplier: number;
    color: string;
    exiting?: boolean;
  };
  const [resultHistory, setResultHistory] = useState<DropResult[]>([]);
  const resultIdRef = useRef(0);

  // Clean up exiting items after animation
  useEffect(() => {
    const hasExiting = resultHistory.some((item) => item.exiting);
    if (!hasExiting) return;

    const timer = setTimeout(() => {
      setResultHistory((prev) => prev.filter((item) => !item.exiting));
    }, 400); // Match the longest transition duration

    return () => clearTimeout(timer);
  }, [resultHistory]);

  // Canvas refs and state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 450 });

  // Plinko game state
  type Ball = {
    x: number;
    y: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    progress: number;
    path: ('L' | 'R')[];
    pathIndex: number;
    direction?: 'L' | 'R';
  };
  type ActivePeg = {
    rowIndex: number;
    pegIndex: number;
    progress: number; // 0 to 1, animation progress
  };
  type ActiveBucket = {
    index: number;
    progress: number;
  };
  const pegsRef = useRef<{ x: number; y: number }[][]>([]); // [row][pegIndex] = {x, y}
  const ballsRef = useRef<Ball[]>([]);
  const activePegsRef = useRef<ActivePeg[]>([]);
  const activeBucketsRef = useRef<ActiveBucket[]>([]);
  const [activeBuckets, setActiveBuckets] = useState<ActiveBucket[]>([]);
  const animationRef = useRef<number | null>(null);
  const multipliersRef = useRef<PlinkoMultiplierConfig[]>([]);
  const bucketColorsRef = useRef<string[]>([]);

  useEffect(() => {
    fetch('/api/plinko/config')
      .then((res) => res.json())
      .then((data: PlinkoConfigResponse) => setPlinkoConfig(data))
      .catch(console.error);
  }, []);

  // Resize canvas to fit container
  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.min(rect.width, 600);
        const height = Math.min(rect.height - 50, 450); // Leave space for buckets
        setCanvasSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate peg positions
  const pegConfig = useMemo(() => {
    const { width, height } = canvasSize;
    const topPegs = 3;
    const bottomPegs = rows + 2;
    const totalRows = bottomPegs - topPegs + 1;

    // Peg radius scales with fewer rows: 4px at 16 rows, 7px at 8 rows
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

    // Build peg positions array
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

  // Update pegsRef when config changes
  useEffect(() => {
    pegsRef.current = pegConfig.pegs;
  }, [pegConfig]);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size with device pixel ratio for crisp rendering
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw pegs
    const { pegs, pegRadius } = pegConfig;
    for (let rowIndex = 0; rowIndex < pegs.length; rowIndex++) {
      const row = pegs[rowIndex];
      for (let pegIndex = 0; pegIndex < row.length; pegIndex++) {
        const peg = row[pegIndex];

        // Check if this peg is active (recently hit)
        const activePeg = activePegsRef.current.find(
          (ap) => ap.rowIndex === rowIndex && ap.pegIndex === pegIndex
        );

        let currentRadius = pegRadius;
        let currentColor = '#6b7280';

        if (activePeg) {
          // Animation: grow then shrink, white then back to gray
          const t = activePeg.progress;
          // Scale: 1 -> 1.5 -> 1 (peak at t=0.3)
          const scalePeak = 0.3;
          const scale = t < scalePeak
            ? 1 + 0.5 * (t / scalePeak)
            : 1 + 0.5 * (1 - (t - scalePeak) / (1 - scalePeak));
          currentRadius = pegRadius * scale;

          // Color: interpolate from white (#ffffff) back to gray (#6b7280)
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

    // Draw balls
    for (const ball of ballsRef.current) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, pegConfig.ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#4558ff';
      ctx.fill();
    }
  }, [canvasSize, pegConfig]);

  // Animation loop
  const animate = useCallback(() => {
    const balls = ballsRef.current;
    let hasActiveBalls = false;

    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i];
      // Speed based on distance - normalize to rowSpacing
      const distance = Math.abs(ball.targetY - ball.startY);
      const baseSpeed = 0.025;
      const speed = baseSpeed * (pegConfig.rowSpacing / Math.max(distance, 1));
      ball.progress += speed;

      if (ball.progress >= 1) {
        // Snap to target
        ball.x = ball.targetX;
        ball.y = ball.targetY;
        ball.pathIndex++;

        if (ball.pathIndex > ball.path.length) {
          // Calculate which bucket the ball landed in based on path
          // Bucket index = number of 'R' moves in the path
          const bucketIndex = ball.path.filter((dir) => dir === 'R').length;

          // Trigger bucket animation
          activeBucketsRef.current.push({
            index: bucketIndex,
            progress: 0,
          });

          // Add result to history
          const multiplierConfig = multipliersRef.current[bucketIndex];
          const color = bucketColorsRef.current[bucketIndex];
          if (multiplierConfig) {
            resultIdRef.current++;
            const newId = resultIdRef.current;
            setResultHistory((prev) => {
              const newResult = { id: newId, multiplier: multiplierConfig.multiplier, color };
              const newHistory = [newResult, ...prev];

              // Mark items beyond index 9 as exiting
              return newHistory.map((item, idx) => ({
                ...item,
                exiting: idx >= 10,
              }));
            });
          }

          // Ball finished, remove
          balls.splice(i, 1);
          continue;
        }

        // Calculate next target
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

          // Trigger peg hit animation
          activePegsRef.current.push({
            rowIndex: currentRowIndex,
            pegIndex: currentPegIdx,
            progress: 0,
          });

          const nextPegIdx = direction === 'L' ? currentPegIdx : currentPegIdx + 1;
          const nextPeg = pegs[nextRowIndex][nextPegIdx];

          // Vertical offset to touch the top of the peg, not its center
          const { pegRadius, ballRadius } = pegConfig;
          const verticalOffset = pegRadius + ballRadius;

          ball.startX = ball.x;
          ball.startY = ball.y;
          ball.targetX = nextPeg.x;
          ball.targetY = nextPeg.y - verticalOffset;
          ball.direction = direction;
        } else {
          // Going to bucket area (below last row)
          const direction = ball.path[ball.pathIndex - 1] || 'L';
          const { pegSpacing } = pegConfig;

          // Trigger last peg hit animation
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

          // Move half a peg spacing to the left or right based on last direction
          const horizontalOffset = (pegSpacing / 2) * (direction === 'L' ? -1 : 1);

          ball.startX = ball.x;
          ball.startY = ball.y;
          ball.targetX = ball.x + horizontalOffset;
          ball.targetY = ball.y + pegConfig.rowSpacing;
          ball.direction = direction;
        }
      } else {
        const t = ball.progress;

        // x moves linearly from start to target
        ball.x = ball.startX + (ball.targetX - ball.startX) * t;

        if (ball.pathIndex === 0) {
          // First segment: simple fall (no bounce)
          ball.y = ball.startY + (ball.targetY - ball.startY) * t;
        } else {
          // Parabolic trajectory: bounce up then down to next peg
          const { rowSpacing } = pegConfig;
          const bounceHeight = rowSpacing * 0.2;

          // y follows parabola: y = at² + bt + c
          // y(0) = startY
          // y(0.5) = startY - bounceHeight (peak)
          // y(1) = targetY
          const deltaY = ball.targetY - ball.startY;
          const a = 2 * deltaY + 4 * bounceHeight;
          const b = -4 * bounceHeight - deltaY;
          const c = ball.startY;

          ball.y = a * t * t + b * t + c;
        }
      }

      hasActiveBalls = true;
    }

    // Update active pegs animation
    const activepegs = activePegsRef.current;
    for (let i = activepegs.length - 1; i >= 0; i--) {
      activepegs[i].progress += 0.025; // Speed of peg animation
      if (activepegs[i].progress >= 1) {
        activepegs.splice(i, 1);
      }
    }

    // Update active buckets animation
    const activebuckets = activeBucketsRef.current;
    let bucketsChanged = false;
    for (let i = activebuckets.length - 1; i >= 0; i--) {
      activebuckets[i].progress += 0.03; // Speed of bucket animation
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
    }
  }, [draw, pegConfig]);

  // Drop a ball with a predetermined path
  const dropBall = useCallback((path: ('L' | 'R')[]) => {
    const pegs = pegsRef.current;
    if (pegs.length === 0 || path.length === 0) return;

    // Start position: above the first row, centered (falls from above)
    const firstRow = pegs[0];
    const centerPegIndex = Math.floor(firstRow.length / 2);
    const startX = firstRow[centerPegIndex].x;
    const startY = pegConfig.paddingTop - 30;

    // First target: touch the top of the first peg
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

    // Start animation if not already running
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [animate, pegConfig]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const currentMultipliers = useMemo<PlinkoMultiplierConfig[]>(() => {
    if (!plinkoConfig) return [];
    return plinkoConfig.config[risk][rows]?.multipliers ?? [];
  }, [plinkoConfig, risk, rows]);

  // Format multiplier for display
  const formatMultiplier = (value: number): string => {
    if (value >= 1000) {
      const k = value / 1000;
      return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
    }
    if (value >= 100) {
      return `${value}`;
    }
    return `${value}x`;
  };

  const currentBucketColors = useMemo<string[]>(() => {
    if (!plinkoConfig) return [];
    return plinkoConfig.bucketColors[rows] ?? [];
  }, [plinkoConfig, rows]);

  // Keep refs in sync for use in animation loop
  useEffect(() => {
    multipliersRef.current = currentMultipliers;
  }, [currentMultipliers]);

  useEffect(() => {
    bucketColorsRef.current = currentBucketColors;
  }, [currentBucketColors]);

  const minRows = 8;
  const maxRows = 16;
  const rowsProgress = ((rows - minRows) / (maxRows - minRows)) * 100;

  const updateRowsFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newRows = Math.round(minRows + (percentage / 100) * (maxRows - minRows));
    setRows(newRows);
  }, []);

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateRowsFromPosition(e.clientX);
  };

  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateRowsFromPosition(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updateRowsFromPosition]);

  const betModeTabWidth = betMode === 'manual' ? 152 : 152;
  const betModeTabOffset = betMode === 'manual' ? 4 : 160;

  const riskTabWidth = 100;
  const riskTabOffset = risk === 'low' ? 4 : risk === 'medium' ? 108 : 212;

  return (
    <GameLayout>
      <div className="mx-auto flex h-[85dvh] max-h-[750px] w-[94%] max-w-[1260px] flex-row rounded-12 bg-dark-900 transition-all duration-200 mt-32">
        {/* Left Sidebar - Betting Controls */}
        <div className="flex w-[380px] shrink-0 flex-col overflow-y-auto rounded-12 rounded-r-none bg-dark-700 p-32 scrollbar-none">
          {/* Manual/Auto Tabs */}
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="relative mb-16 inline-flex h-[48px] w-full gap-4 rounded-12 bg-dark-600 p-4"
          >
            <div
              className="absolute left-0 top-[4px] z-10 h-[calc(100%-8px)] transform rounded-8 bg-dark-400 transition-all duration-200"
              style={{ width: `${betModeTabWidth}px`, transform: `translateX(${betModeTabOffset}px)`, willChange: 'transform, width' }}
            />
            <button
              role="tab"
              type="button"
              aria-selected={betMode === 'manual'}
              onClick={() => setBetMode('manual')}
              className={`z-20 flex size-full cursor-pointer items-center justify-center gap-8 text-nowrap rounded-8 px-[12px] py-8 text-b-md font-semibold outline-none transition-all duration-100 focus-visible:outline-0 ${
                betMode === 'manual' ? 'text-light-000 brightness-200' : 'text-dark-200 brightness-100 hover:text-light-000'
              }`}
            >
              Manual
            </button>
            <button
              role="tab"
              type="button"
              aria-selected={betMode === 'auto'}
              onClick={() => setBetMode('auto')}
              className={`z-20 flex size-full cursor-pointer items-center justify-center gap-8 text-nowrap rounded-8 px-[12px] py-8 text-b-md font-semibold outline-none transition-all duration-100 focus-visible:outline-0 ${
                betMode === 'auto' ? 'text-light-000 brightness-200' : 'text-dark-200 brightness-100 hover:text-light-000'
              }`}
            >
              Auto
            </button>
          </div>

          {/* Bet Amount Input */}
          <div className="mt-[22px] flex flex-col gap-4 mb-16">
            <div className="mt-[-22px] flex justify-between gap-4 whitespace-nowrap text-b-md font-semibold text-dark-200">
              <span>Bet Amount</span>
              <span className="ml-auto max-w-[50%] truncate">{betAmount}</span> BTC
            </div>
            <div className="group flex h-[48px] items-center gap-4 rounded-8 bg-dark-600 px-[12px] py-8 text-b-md font-semibold text-dark-200 outline outline-2 outline-offset-[-2px] outline-transparent transition-all hover:outline-dark-400 focus-within:outline-dark-400">
              <div className="size-16 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="h-full w-full">
                  <path fill="#2B63F4" d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0" />
                  <path fill="#fff" d="M6.927 11.705a.2.2 0 0 1-.2-.2V2.45c0-.11.09-.2.2-.2h.206c.11 0 .2.09.2.2v9.055a.2.2 0 0 1-.2.2zm1.727-6.43c-.103 0-.186-.078-.212-.177a1 1 0 0 0-.404-.577q-.381-.27-.99-.27-.428 0-.735.13-.306.13-.469.35a.85.85 0 0 0-.059.917 1 1 0 0 0 .3.295q.188.118.417.2t.461.136l.71.178q.428.099.823.27.398.168.713.428.317.258.502.624.185.365.185.857 0 .665-.34 1.17-.34.502-.982.787-.639.28-1.548.28-.883 0-1.533-.273a2.3 2.3 0 0 1-1.012-.797 2.3 2.3 0 0 1-.376-1.07.19.19 0 0 1 .193-.208h.954c.105 0 .19.08.211.184q.056.274.219.473.214.262.557.392.348.129.776.129.447 0 .783-.133a1.27 1.27 0 0 0 .532-.377.9.9 0 0 0 .196-.569.72.72 0 0 0-.174-.487 1.3 1.3 0 0 0-.476-.325 4.6 4.6 0 0 0-.71-.236l-.86-.222q-.934-.24-1.477-.728-.54-.491-.54-1.303 0-.669.362-1.171.366-.502.994-.78.627-.28 1.422-.28.805 0 1.41.28a2.3 2.3 0 0 1 .957.773q.291.411.346.927a.187.187 0 0 1-.191.203z" />
                </svg>
              </div>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full bg-transparent text-h-sm font-semibold text-light-000 outline-none placeholder:text-dark-300"
              />
              <div className="-mr-4 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setBetAmount((parseFloat(betAmount) / 2).toFixed(2))}
                  className="flex h-[32px] min-w-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] text-b-sm font-semibold text-light-000 transition-all hover:bg-dark-300"
                >
                  ½
                </button>
                <button
                  type="button"
                  onClick={() => setBetAmount((parseFloat(betAmount) * 2).toFixed(2))}
                  className="flex h-[32px] min-w-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] text-b-sm font-semibold text-light-000 transition-all hover:bg-dark-300"
                >
                  2x
                </button>
                <button
                  type="button"
                  className="flex h-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] text-b-sm font-semibold uppercase text-light-000 transition-all hover:bg-dark-300"
                >
                  Max
                </button>
              </div>
            </div>
          </div>

          {/* Number of Bets (Auto mode only) */}
          {betMode === 'auto' && (
            <div className="mb-16">
              <div className="flex w-full flex-col">
                <label className="text-b-md font-semibold text-dark-200">
                  <span className="text-dark-200">Number of Bets</span>
                </label>
                <div className="h-4" />
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={numberOfBets}
                    onChange={(e) => setNumberOfBets(e.target.value)}
                    className="h-[48px] w-full rounded-8 bg-dark-600 px-[12px] py-8 text-h-sm font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 hover:outline-dark-400 focus:text-light-000 focus:outline-dark-400"
                  />
                  <button
                    type="button"
                    onClick={() => setNumberOfBets('∞')}
                    className="absolute right-8 top-8 flex h-[32px] items-center justify-center rounded-8 bg-dark-400 px-[10px] py-8 text-h-md font-semibold text-light-000 transition-all hover:bg-dark-300"
                  >
                    <span className="flex items-center justify-center gap-4">∞</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Risk Selection */}
          <div className="w-full mb-16">
            <label className="text-b-md font-semibold text-dark-200">Risk</label>
            <div className="h-4" />
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="relative inline-flex h-[48px] w-full gap-4 rounded-12 bg-dark-600 p-4"
            >
              <div
                className="absolute left-0 top-[4px] z-10 h-[calc(100%-8px)] transform rounded-8 bg-dark-400 transition-all duration-200"
                style={{ width: `${riskTabWidth}px`, transform: `translateX(${riskTabOffset}px)`, willChange: 'transform, width' }}
              />
              <button
                role="tab"
                type="button"
                aria-selected={risk === 'low'}
                onClick={() => setRisk('low')}
                className={`z-20 flex flex-1 cursor-pointer items-center justify-center gap-8 text-nowrap rounded-8 px-[12px] py-8 text-b-md font-semibold outline-none transition-all duration-100 focus-visible:outline-0 ${
                  risk === 'low' ? 'text-light-000 brightness-200' : 'text-dark-200 brightness-100 hover:text-light-000'
                }`}
              >
                Low
              </button>
              <button
                role="tab"
                type="button"
                aria-selected={risk === 'medium'}
                onClick={() => setRisk('medium')}
                className={`z-20 flex flex-1 cursor-pointer items-center justify-center gap-8 text-nowrap rounded-8 px-[12px] py-8 text-b-md font-semibold outline-none transition-all duration-100 focus-visible:outline-0 ${
                  risk === 'medium' ? 'text-light-000 brightness-200' : 'text-dark-200 brightness-100 hover:text-light-000'
                }`}
              >
                Medium
              </button>
              <button
                role="tab"
                type="button"
                aria-selected={risk === 'high'}
                onClick={() => setRisk('high')}
                className={`z-20 flex flex-1 cursor-pointer items-center justify-center gap-8 text-nowrap rounded-8 px-[12px] py-8 text-b-md font-semibold outline-none transition-all duration-100 focus-visible:outline-0 ${
                  risk === 'high' ? 'text-light-000 brightness-200' : 'text-dark-200 brightness-100 hover:text-light-000'
                }`}
              >
                High
              </button>
            </div>
          </div>

          {/* Number of Rows */}
          <div className="mb-8 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <label className="text-b-md font-semibold text-dark-200">Number of Rows</label>
              <div className="h-4" />
              <span className="text-14 text-white font-bold">{rows}</span>
            </div>
            <div className="gap-12 mx-4 flex flex-col">
              <div className="relative">
                <div
                  ref={sliderRef}
                  className="relative h-4 w-full rounded-full bg-dark-600 cursor-pointer"
                  onClick={handleSliderClick}
                >
                  <div
                    className="h-4 rounded-full bg-blue-600 transition-all duration-200"
                    style={{ width: `${rowsProgress}%` }}
                  />
                  <div
                    className="bg-white absolute top-1/2 flex h-[16px] w-[16px] -translate-y-1/2 items-center justify-center rounded-full shadow-xl transition-all duration-200 cursor-grab hover:scale-110 hover:shadow-2xl focus:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-600/50 active:scale-105 active:cursor-grabbing"
                    style={{ left: `${rowsProgress}%`, transform: 'translateX(-50%)' }}
                    tabIndex={0}
                    onMouseDown={handleThumbMouseDown}
                  >
                    <div className="bg-blue-600 absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Game / Start Autobet Button */}
          <div className="mt-auto flex flex-col gap-y-16">
            <button
              type="button"
              onClick={() => {
                // Generate random path for testing (will be replaced with server response)
                const pathLength = rows;
                const path: ('L' | 'R')[] = [];
                for (let i = 0; i < pathLength; i++) {
                  path.push(Math.random() < 0.5 ? 'L' : 'R');
                }
                dropBall(path);
              }}
              className="flex h-[48px] w-full items-center justify-center rounded-8 bg-blue-600 px-[24px] py-8 text-b-lg font-bold text-light-000 transition-transform duration-75 hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-dark-400 disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-8">
                <span className="truncate">{betMode === 'auto' ? 'Start Autobet' : 'Start Game'}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Right Side - Plinko Game */}
        <div className="relative grow overflow-hidden px-32 py-16">
          <div className="flex h-full flex-col items-center justify-between">
            {/* Top Right Controls - Result History */}
            <div className="flex w-full items-center justify-end">
              <div className="mr-2 mt-2 xxl:mr-4 xxl:mt-1">
                <div className="relative flex flex-row-reverse h-32 gap-[2px]">
                  {resultHistory.map((result) => (
                    <div
                      key={result.id}
                      className={`plinko-result-item rounded-[6px] px-4 text-b-md flex w-[48px] cursor-pointer items-center justify-center font-semibold hover:brightness-110 h-32 ${result.exiting ? 'plinko-result-exiting' : ''}`}
                      style={{
                        backgroundColor: result.color,
                        color: 'rgb(26, 26, 26)',
                      }}
                    >
                      {formatMultiplier(result.multiplier)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Canvas Area */}
            <div ref={containerRef} className="w-full max-w-[600px] flex-1">
              <div className="relative flex h-full w-full flex-col items-center justify-center">
                {/* Plinko Canvas */}
                <canvas
                  ref={canvasRef}
                  className="rounded-8"
                  style={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    maxWidth: '100%',
                  }}
                />

                {/* Buckets */}
                <div className="flex w-full max-w-[600px] justify-center gap-1" style={{ padding: '0px 14px' }}>
                  {currentMultipliers.map((config, index) => {
                    const activeBucket = activeBuckets.find((ab) => ab.index === index);
                    const scale = activeBucket
                      ? 1 + 0.3 * (1 - activeBucket.progress) // 1.25 -> 1
                      : 1;

                    return (
                      <div key={index} className="relative flex-1">
                        <div
                          className="plinko-bucket"
                          style={{
                            background: currentBucketColors[index] || 'rgb(255, 193, 0)',
                            borderRadius: '4px',
                            display: 'flex',
                            padding: '8px 2px 4px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            maxHeight: '30px',
                            width: '100%',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: 'rgb(31, 41, 55)',
                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px',
                            textAlign: 'center',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            transform: `scale(${scale})`,
                            transition: activeBucket ? 'none' : 'transform 0.25s ease-in-out',
                          }}
                        >
                          <div className="plinko-bucket-hole" />
                          <div className="plinko-bucket-content">
                            {formatMultiplier(config.multiplier)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex w-full justify-between">
              {/* Zero Edge */}
              <span>
                <div className="flex select-none items-center">
                  <button
                    type="button"
                    className="flex h-[40px] flex-shrink-0 items-center justify-center rounded-8 px-0 py-8 text-b-md font-semibold text-dark-200 transition-all hover:bg-transparent hover:text-light-000 lg:font-bold"
                  >
                    <span className="flex items-center justify-center gap-4">
                      <div className="flex gap-4">
                        <div className="size-16">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
                            <g clipPath="url(#icon-duel-house-edge_svg__a)">
                              <path d="M6.663.082a.73.73 0 0 1 .775.064l6.27 4.702a.73.73 0 1 1-.878 1.169l-.277-.208v5.37a2.82 2.82 0 0 1-2.821 2.82H4.267a2.82 2.82 0 0 1-2.821-2.82v-5.37l-.277.208a.731.731 0 1 1-.877-1.17L6.56.148zm.336 4.828q-1.245 0-1.928.818t-.684 2.316q0 1.495.684 2.317.683.819 1.928.818 1.245 0 1.93-.818.683-.822.683-2.317 0-1.497-.683-2.316-.684-.818-1.93-.818m1.02 3.3q-.022.824-.265 1.287-.263.505-.755.505-.49 0-.758-.505a2 2 0 0 1-.123-.31zm-1.02-2.123q.492 0 .755.505.074.14.126.312l-1.901.986q.02-.834.262-1.298.268-.504.758-.505" />
                            </g>
                            <defs>
                              <clipPath id="icon-duel-house-edge_svg__a">
                                <path d="M0 0h14v14H0z" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div>Zero Edge</div>
                      </div>
                    </span>
                  </button>
                </div>
              </span>

              {/* Provably Fair */}
              <div className="flex select-none items-center">
                <button
                  type="button"
                  className="flex h-[40px] items-center justify-center rounded-8 px-0 py-8 text-b-md font-semibold text-dark-200 transition-all hover:bg-transparent hover:text-light-000 lg:font-bold"
                >
                  <span className="flex items-center justify-center gap-4">
                    <div className="size-16">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" className="h-full w-full">
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="m1.176 3.27.237 5.245c.115 2.557 1.66 4.852 4.036 5.997l1.324.638a2.84 2.84 0 0 0 2.454 0l1.324-.638c2.376-1.145 3.92-3.44 4.036-5.997l.237-5.245c.017-.375-.33-.68-.705-.677a6 6 0 0 1-2.005-.33c-.746-.256-1.593-.726-2.324-1.184a3.41 3.41 0 0 0-3.58 0c-.73.458-1.578.928-2.324 1.184a6 6 0 0 1-2.005.33c-.375-.004-.722.302-.705.677m10.4 3.193a.952.952 0 0 0-1.497-1.177L7.025 9.172 5.782 8.136A.952.952 0 1 0 4.562 9.6l1.997 1.663a.95.95 0 0 0 1.358-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    Provably Fair
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
