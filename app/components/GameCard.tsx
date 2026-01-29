import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/types';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/${game.slug}`} className="">
      <div
        className="group relative aspect-[3/4] w-[100px] overflow-hidden rounded-[12px] bg-cover bg-center transition-all duration-200 hover:brightness-[1.15] md:h-[222px] md:w-[166px]"
        data-testid="game-card-container"
      >
        {/* Background Image */}
        <Image
          src={game.image}
          alt={game.name}
          fill
          className="absolute inset-0 z-10 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Game Info */}
        <div className="absolute inset-x-0 bottom-2 z-30 sm:bottom-3 md:bottom-4">
          <h3 className="text-center text-h-sm leading-none md:text-h-md lg:text-h-lg">
            {game.name}
          </h3>
          <h4 className="text-center text-b-xs font-semibold text-white/30 md:text-b-sm">
            Duel Originals
          </h4>
        </div>

        {/* Top badges container */}
        <div className="absolute left-[6px] right-[6px] top-[6px] z-30 flex items-start justify-between">
          {/* DUEL badge + RTP */}
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 rounded-[6px] bg-[#2563eb] px-[6px] py-[2px] text-[10px] font-bold uppercase text-white md:px-2 md:py-1 md:text-[11px]">
              DUEL
            </div>
            <div className="flex gap-1 rounded-[6px] bg-[rgba(12,16,43,0.60)] px-[6px] py-[2px] text-[10px] font-semibold text-[#22c55e] md:px-2 md:py-1 md:text-[11px]">
              {game.rtp}% RTP
            </div>
          </div>

          {/* Live Badge */}
          {game.isLive && (
            <div className="flex items-center gap-1 rounded-[6px] bg-[#dc2626] px-[6px] py-[2px] text-[10px] font-bold uppercase text-white md:px-2 md:py-1 md:text-[11px]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              LIVE
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
