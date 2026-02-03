'use client';

import { GameLayout } from '@/app/components/GameLayout';
import { BeefGame } from './components';

export default function BeefPage() {
  return (
    <GameLayout>
      <div className="flex flex-col gap-24">
        <BeefGame />
      </div>
    </GameLayout>
  );
}
