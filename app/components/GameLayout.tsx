'use client';

import { ReactNode } from 'react';
import { LiveBetsFeed } from './LiveBetsFeed';

interface GameLayoutProps {
  children: ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="flex flex-col p-16 sm:p-32">
      {children}
      <LiveBetsFeed />
    </div>
  );
}
