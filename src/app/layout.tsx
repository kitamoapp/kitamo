
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { CurrencyProvider } from '@/context/currency-context';
import { TransactionProvider } from '@/context/transaction-context';

export const metadata: Metadata = {
  title: 'KitaMo',
  description: 'Your personal finance companion.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="application-name" content="KitaMo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KitaMo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#4A45E5" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <CurrencyProvider>
          <TransactionProvider>
            {children}
          </TransactionProvider>
        </CurrencyProvider>
        <Toaster />
      </body>
    </html>
  );
}
