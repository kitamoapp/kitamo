
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
  Settings2,
} from 'lucide-react';
import { FinancialSummaryChart } from '@/components/dashboard/financial-summary-chart';
import { useCurrency } from '@/context/currency-context';
import type { Currency } from '@/lib/types';
import { ExpenseBreakdownChart } from '@/components/dashboard/expense-breakdown-chart';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradeCard } from '@/components/upgrade-card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { AddTransactionDialog } from '@/components/transactions/add-transaction-dialog';
import { SetReminderDialog } from '@/components/transactions/set-reminder-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const currencyIcons: Record<Currency, React.ElementType> = {
  USD: DollarSign,
  EUR: Euro,
  JPY: JapaneseYen,
  GBP: PoundSterling,
  PHP: PhilippinePeso,
};

export type Period = 'day' | 'week' | 'month' | 'year';

export default function DashboardPage() {
  const { currency, formatCurrency } = useCurrency();
  const { currentTier } = useSubscription();
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [period, setPeriod] = useState<Period>('month');

  // State for dashboard component visibility
  const [visibleComponents, setVisibleComponents] = useState({
    summaryCards: true,
    financialSummary: true,
    expenseBreakdown: true,
    transactionHistory: true,
  });

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

  const handleVisibilityChange = (component: keyof typeof visibleComponents, checked: boolean) => {
    setVisibleComponents(prev => ({ ...prev, [component]: checked }));
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className='flex items-center gap-2'>
            <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Customize
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Customize Dashboard</DialogTitle>
                  <DialogDescription>
                    Select the components you want to see on your dashboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="summary-cards-toggle" className="font-normal">Show Summary Cards</Label>
                    <Switch
                      id="summary-cards-toggle"
                      checked={visibleComponents.summaryCards}
                      onCheckedChange={(checked) => handleVisibilityChange('summaryCards', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="financial-summary-toggle" className="font-normal">Show Financial Summary</Label>
                    <Switch
                      id="financial-summary-toggle"
                      checked={visibleComponents.financialSummary}
                      onCheckedChange={(checked) => handleVisibilityChange('financialSummary', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="expense-breakdown-toggle" className="font-normal">Show Expense Breakdown</Label>
                    <Switch
                      id="expense-breakdown-toggle"
                      checked={visibleComponents.expenseBreakdown}
                      onCheckedChange={(checked) => handleVisibilityChange('expenseBreakdown', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="transaction-history-toggle" className="font-normal">Show Transaction History</Label>
                    <Switch
                      id="transaction-history-toggle"
                      checked={visibleComponents.transactionHistory}
                      onCheckedChange={(checked) => handleVisibilityChange('transactionHistory', checked)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setShowCustomizeDialog(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <SetReminderDialog />
            <AddTransactionDialog />
          </div>
        </div>

        {visibleComponents.summaryCards && (
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
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {visibleComponents.financialSummary && (
            <Card>
              <CardHeader className='flex-row items-center justify-between pb-2 space-y-0'>
                <div>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>
                    Your income and expenses over time.
                  </CardDescription>
                </div>
                <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)} className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="pl-2">
                <FinancialSummaryChart period={period} />
              </CardContent>
            </Card>
          )}

          {visibleComponents.expenseBreakdown && (
            <>
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
            </>
          )}
        </div>
        {visibleComponents.transactionHistory && <TransactionsTable />}
      </div>
    </AppLayout>
  );
}
