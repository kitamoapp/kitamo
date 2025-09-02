
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { CurrencyProvider } from '@/context/currency-context';
import { TransactionProvider } from '@/context/transaction-context';
import { ThemeProvider } from '@/components/theme-provider';
import { SubscriptionProvider } from '@/context/subscription-context';
import { ReferredUserProvider } from '@/context/referred-user-context';
import { BudgetProvider } from '@/context/budget-context';
import { ReminderProvider } from '@/context/reminder-context';
import { PaymentMethodProvider } from '@/context/payment-method-context';
import { AuthProvider } from '@/context/auth-context';
import { StripeProvider } from '@/context/stripe-provider';

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CurrencyProvider>
              <TransactionProvider>
                <ReferredUserProvider>
                  <SubscriptionProvider>
                     <StripeProvider>
                        <BudgetProvider>
                          <ReminderProvider>
                            <PaymentMethodProvider>
                              {children}
                            </PaymentMethodProvider>
                          </ReminderProvider>
                        </BudgetProvider>
                      </StripeProvider>
                  </SubscriptionProvider>
                </ReferredUserProvider>
              </TransactionProvider>
            </CurrencyProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
