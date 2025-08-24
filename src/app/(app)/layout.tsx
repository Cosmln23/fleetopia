import React, { Suspense } from 'react';
import { TopNavbar, BottomNav } from '@/shared/ui';
import { AppShell } from '@/shared/ui/layout/AppShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={
        <>
          <TopNavbar />
          <BottomNav />
        </>
      }
    >
      <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
        {children}
      </Suspense>
    </AppShell>
  );
}


