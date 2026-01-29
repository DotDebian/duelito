'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/app/contexts/SidebarContext';

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-[calc(100vh-var(--navbar-height)-theme(space.16))] flex-grow flex-col">
      <main className="flex-grow">
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}
