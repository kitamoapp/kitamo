
'use client';

import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { AiTipCard } from '@/components/dashboard/ai-tip-card';
import { useCurrency } from '@/context/currency-context';
import type { Currency } from '@/lib/types';
import { TransactionsTable } from '@/components/transactions/transactions-table';

const currencyIcons: Record<Currency, React.ElementType> = {
  USD: DollarSign,
  EUR: Euro,
  JPY: JapaneseYen,
  GBP: PoundSterling,
  PHP: PhilippinePeso,
};

export default function DashboardPage() {
  const { currency, formatCurrency } = useCurrency();
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const BalanceIcon = currencyIcons[currency] || DollarSign;

  return (
    <AppLayout>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="mt-6 grid grid-cols-1 gap-6">
            <AiTipCard />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

          <Card className="mt-6">
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
        </TabsContent>
        <TabsContent value="transactions">
          <div className="mt-4 space-y-4">
            <TransactionsTable />
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
