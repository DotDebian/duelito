'use client';

import { GameLayout } from '@/app/components/GameLayout';
import { MinesGame } from './components';

export default function MinesPage() {
  return (
    <GameLayout>
      <div className="flex flex-col gap-24">
        <MinesGame />
      </div>
    </GameLayout>
  );
}
