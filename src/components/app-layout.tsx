import type { ReactNode } from 'react';
import { Header } from '@/components/header';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
}
