'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { Tile, MinesPhase } from '../types';

interface MinesTileProps {
  tile: Tile;
  phase: MinesPhase;
  onClick: () => void;
  disabled: boolean;
}

// SVG épées croisées
const SwordsIcon = ({ className, opacity = 0.5, color = '#121731' }: { className?: string; opacity?: number; color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 32 32"
    className={className}
    style={{ opacity }}
  >
    <g clipPath="url(#icon-duel-swords-alt-dark_svg__a)">
      <path fill={color} d="M31.707.293a1 1 0 0 0-.9-.275L26.401.9a3 3 0 0 0-1.53.818L4.89 22.136l5.405 4.753L30.282 7.138c.419-.419.706-.95.819-1.532l.88-4.413a1 1 0 0 0-.274-.9M3.299 19.295l-1 1a1 1 0 0 0-.206 1.113l1.718 3.876L.3 28.797a1.004 1.004 0 0 0 0 1.412l1.5 1.5a1.003 1.003 0 0 0 1.412 0l3.512-3.513 3.875 1.72a.995.995 0 0 0 1.112-.207l1-1a1.004 1.004 0 0 0 0-1.413l-7.999-8a1.003 1.003 0 0 0-1.412 0m22.703 1.294-3.169-3.169-5.411 5.413 3.168 3.17-1.294 1.293a1.004 1.004 0 0 0 0 1.413l1 1a1 1 0 0 0 1.113.206l3.874-1.719 3.512 3.513a1.003 1.003 0 0 0 1.412 0l1.5-1.5a1.004 1.004 0 0 0 0-1.412l-3.512-3.513 1.718-3.876a.995.995 0 0 0-.206-1.113l-1-1a1.003 1.003 0 0 0-1.412 0zM1.724 7.138l7.449 7.45 5.412-5.412-7.443-7.458A2.96 2.96 0 0 0 5.611.9L1.199.018a1.01 1.01 0 0 0-.906.275 1.01 1.01 0 0 0-.275.907l.888 4.4c.118.581.4 1.113.818 1.532z" />
    </g>
    <defs>
      <clipPath id="icon-duel-swords-alt-dark_svg__a">
        <path fill="#fff" d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const MinesTile = memo(function MinesTile({
  tile,
  phase,
  onClick,
  disabled,
}: MinesTileProps) {
  const isIdle = phase === 'idle';
  const isPlaying = phase === 'playing';
  const isSelecting = phase === 'selecting';
  const isGameOver = phase === 'won' || phase === 'lost';
  const isClickable = !disabled && ((isPlaying && tile.state === 'hidden') || isSelecting);

  // Déterminer les classes CSS selon l'état
  const getBackgroundClass = () => {
    switch (tile.state) {
      case 'preselected':
        return 'bg-blue-600';
      case 'diamond-clicked':
        // Vert seulement après cashout (game won), sinon neutre
        return isGameOver ? 'bg-[#091c2a]' : 'bg-dark-700';
      case 'diamond':
        return 'bg-dark-700';
      case 'mine':
        return 'bg-dark-700';
      case 'mine-exploded':
        return 'bg-[#1d0b24]';
      default:
        if (isIdle) return 'bg-dark-500';
        if (isPlaying || isSelecting) return 'bg-dark-400';
        return 'bg-dark-500';
    }
  };

  const getBorderClass = () => {
    switch (tile.state) {
      case 'diamond-clicked':
        // Bordure verte seulement après cashout (game won)
        return isGameOver ? 'border-green-700' : 'border-transparent';
      case 'diamond':
        return 'border-transparent';
      case 'mine-exploded':
        return 'border-red-600';
      default:
        return 'border-transparent';
    }
  };

  const getOpacityClass = () => {
    if (phase == "lost" && tile.state !== 'mine-exploded') {
      return 'opacity-60';
    }
    return '';
  };

  const getHoverClass = () => {
    if (isSelecting && tile.state === 'preselected') {
      return 'cursor-pointer hover:bg-blue-500';
    }
    if (isClickable && tile.state === 'hidden') {
      return 'hover:bg-dark-300 cursor-pointer';
    }
    if (isSelecting) {
      return 'cursor-pointer hover:bg-dark-300';
    }
    return '';
  };

  const renderContent = () => {
    switch (tile.state) {
      case 'diamond':
        return (
          <div className="animate-reveal relative size-[46%]">
            <Image
              src="/images/mines/diamond-blue.png"
              alt="Diamond"
              fill
              className="object-contain"
            />
          </div>
        );
      case 'diamond-clicked':
        return (
          <div className="animate-reveal relative size-[50%]">
            <Image
              src="/images/mines/diamond-blue.png"
              alt="Diamond"
              fill
              className="object-contain"
            />
          </div>
        );
      case 'mine':
        return (
          <div className="animate-reveal relative size-[50%]">
            <Image
              src="/images/mines/bomb.png"
              alt="Mine"
              fill
              className="object-contain"
            />
          </div>
        );
      case 'mine-exploded':
        return (
          <div className="animate-explode relative size-[85%]">
            <Image
              src="/images/mines/explosion.png"
              alt="Explosion"
              fill
              className="object-contain"
            />
          </div>
        );
      case 'preselected':
        return (
          <div className="size-[32%]">
            <SwordsIcon className="w-full h-full" opacity={1} color="#ffffff" />
          </div>
        );
      default:
        return (
          <div className="size-[32%]">
            <SwordsIcon className="w-full h-full" opacity={isIdle ? 0.5 : 1} />
          </div>
        );
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={`
        aspect-square rounded-8 border-2
        transition-all duration-100
        shadow-[0px_2px_0px_0px_#161834]
        flex items-center justify-center
        ${getBackgroundClass()}
        ${getBorderClass()}
        ${getOpacityClass()}
        ${getHoverClass()}
        disabled:cursor-default
      `}
    >
      {renderContent()}
    </button>
  );
});
