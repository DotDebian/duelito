'use client';

import { ReactNode } from 'react';
import { LiveBetsFeed } from './LiveBetsFeed';

interface GameLayoutProps {
  children: ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  return (
    <>
      {children}
      <LiveBetsFeed />
    </>
  );
}
