
import type { ReactNode } from 'react';
import { Header } from '@/components/header';
import { SubscriptionProvider } from '@/context/subscription-context';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SubscriptionProvider>
        <Header />
        <main className="flex-1">
          <div className="container py-8">{children}</div>
        </main>
      </SubscriptionProvider>
    </div>
  );
}
