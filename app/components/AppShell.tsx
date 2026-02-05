'use client';

import { ReactNode } from 'react';
import { SidebarProvider } from '@/app/contexts/SidebarContext';
import { BalanceProvider } from '@/app/contexts/BalanceContext';
import { Header, Sidebar, MainContent, Footer } from './';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <BalanceProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-[--background]">
          <Header />

          <div className="flex bg-dark-800 text-light-000">
            <Sidebar />

            <MainContent>
              {children}

              <Footer />
            </MainContent>
          </div>
        </div>
      </SidebarProvider>
    </BalanceProvider>
  );
}
