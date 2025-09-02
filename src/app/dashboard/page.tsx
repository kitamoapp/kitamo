
'use client';

import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Fingerprint,
} from 'lucide-react';
import { FinancialSummaryChart } from '@/components/dashboard/financial-summary-chart';
import { useCurrency } from '@/context/currency-context';
import type { Currency } from '@/lib/types';
import { ExpenseBreakdownChart } from '@/components/dashboard/expense-breakdown-chart';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradeCard } from '@/components/upgrade-card';
import { useState, useMemo } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { AddTransactionDialog } from '@/components/transactions/add-transaction-dialog';
import { SetReminderDialog } from '@/components/transactions/set-reminder-dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SetBudgetDialog } from '@/components/budgets/set-budget-dialog';
import { BudgetSummaryCard } from '@/components/dashboard/budget-summary-card';
import { UpcomingBillsCard } from '@/components/dashboard/upcoming-bills-card';
import { useTransactions } from '@/context/transaction-context';
import { FinancialInsightsCard } from '@/components/dashboard/financial-insights-card';
import { useDashboardComponents } from '@/hooks/use-dashboard-components';
import { useSettings } from '@/hooks/use-settings';

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
  const { transactions } = useTransactions();
  const { currentTier } = useSubscription();
  const {
    setupBiometrics,
    showBiometricPrompt,
    setShowBiometricPrompt,
    setBiometricPromptSeen,
  } = useSettings();
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [period, setPeriod] = useState<Period>('month');

  const handleEnableBiometrics = async () => {
    setBiometricPromptSeen();
    setShowBiometricPrompt(false);
    await setupBiometrics();
  };

  const handleDismissBiometricSetup = () => {
    setBiometricPromptSeen();
    setShowBiometricPrompt(false);
  };


  // State for dashboard component visibility
  const { visibleComponents, handleVisibilityChange } = useDashboardComponents();


  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [transactions]);


  const BalanceIcon = currencyIcons[currency] || DollarSign;

  const canViewAdvancedAnalytics =
    currentTier.name === 'Pro' || currentTier.name === 'Max';
    
  const canViewInsights = currentTier.name !== 'Free';

  return (
    <>
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className='flex flex-wrap items-center gap-2'>
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
                    <Label htmlFor="budget-summary-toggle" className="font-normal">Show Budget Summary</Label>
                    <Switch
                      id="budget-summary-toggle"
                      checked={visibleComponents.budgetSummary}
                      onCheckedChange={(checked) => handleVisibilityChange('budgetSummary', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="upcoming-bills-toggle" className="font-normal">Show Upcoming Bills</Label>
                    <Switch
                      id="upcoming-bills-toggle"
                      checked={visibleComponents.upcomingBills}
                      onCheckedChange={(checked) => handleVisibilityChange('upcomingBills', checked)}
                    />
                  </div>
                   <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="financial-insights-toggle" className="font-normal">Show Financial Insights</Label>
                    <Switch
                      id="financial-insights-toggle"
                      checked={visibleComponents.financialInsights}
                      onCheckedChange={(checked) => handleVisibilityChange('financialInsights', checked)}
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
            <SetBudgetDialog />
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
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
           {visibleComponents.budgetSummary && (
             <BudgetSummaryCard />
           )}
           {visibleComponents.upcomingBills && (
             <UpcomingBillsCard />
           )}
        </div>
        
        {visibleComponents.financialInsights && (
          <>
            {canViewInsights ? (
              <FinancialInsightsCard />
            ) : (
               <UpgradeCard
                  title="Unlock AI-Powered Insights"
                  description="Upgrade your plan to get personalized financial advice and identify savings opportunities automatically."
                  buttonText="Upgrade to Unlock"
                />
            )}
          </>
        )}


        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {visibleComponents.financialSummary && (
            <Card>
              <CardHeader className='flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>
                    Performance of your income vs. expenses.
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
                  buttonText="Upgrade to Pro"
                />
              )}
            </>
          )}
        </div>
        {visibleComponents.transactionHistory && <TransactionsTable />}
      </div>
    </AppLayout>

    <AlertDialog open={showBiometricPrompt} onOpenChange={setShowBiometricPrompt}>
        <AlertDialogContent>
            <AlertDialogHeader>
                 <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4'>
                    <Fingerprint className="h-6 w-6 text-primary" />
                </div>
                <AlertDialogTitle className="text-center">Enable Faster Sign-Ins?</AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                    Use your device's built-in security (like Face ID or a fingerprint) to sign in securely without a password.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
                <AlertDialogCancel onClick={handleDismissBiometricSetup}>Maybe Later</AlertDialogCancel>
                <AlertDialogAction onClick={handleEnableBiometrics}>Yes, Enable</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
