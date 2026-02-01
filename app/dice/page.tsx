'use client';

import { GameLayout } from '@/app/components/GameLayout';
import { DiceGame } from './components';

export default function DicePage() {
  return (
    <GameLayout>
      <div className="flex flex-col gap-24">
        <DiceGame />
      </div>
    </GameLayout>
  );
}
