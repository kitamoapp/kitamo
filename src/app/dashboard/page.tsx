
'use client';

import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { transactions } from '@/lib/data';
import { SummaryCard } from '@/components/dashboard/summary-card';
import {
  DollarSign,
  Euro,
  JapaneseYen,
  PoundSterling,
  PhilippinePeso,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { FinancialSummaryChart } from '@/components/dashboard/financial-summary-chart';
import { useCurrency } from '@/context/currency-context';
import type { Currency } from '@/lib/types';
import { ExpenseBreakdownChart } from '@/components/dashboard/expense-breakdown-chart';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradeCard } from '@/components/upgrade-card';

const currencyIcons: Record<Currency, React.ElementType> = {
  USD: DollarSign,
  EUR: Euro,
  JPY: JapaneseYen,
  GBP: PoundSterling,
  PHP: PhilippinePeso,
};

export default function DashboardPage() {
  const { currency, formatCurrency } = useCurrency();
  const { currentTier } = useSubscription();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const BalanceIcon = currencyIcons[currency] || DollarSign;

  const canViewAdvancedAnalytics =
    currentTier.name === 'Silver' ||
    currentTier.name === 'Gold' ||
    currentTier.name === 'Platinum';

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={TrendingUp}
          />
          <SummaryCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            icon={TrendingDown}
          />
          <SummaryCard
            title="Balance"
            value={formatCurrency(balance)}
            icon={BalanceIcon}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>
                Your income and expenses over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <FinancialSummaryChart />
            </CardContent>
          </Card>
          {canViewAdvancedAnalytics ? (
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>
                  How you are spending your money.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseBreakdownChart />
              </CardContent>
            </Card>
          ) : (
            <UpgradeCard
              title="Unlock Advanced Analytics"
              description="See a detailed breakdown of your expenses by category to better understand your spending habits."
              buttonText="Upgrade to Silver"
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
