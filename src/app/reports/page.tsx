
'use client';

import { AppLayout } from '@/components/app-layout';
import { ReportsHeader } from '@/components/reports/reports-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FinancialSummaryChart } from '@/components/dashboard/financial-summary-chart';
import { ExpenseBreakdownChart } from '@/components/dashboard/expense-breakdown-chart';
import { useTransactions } from '@/context/transaction-context';
import { StatCard } from '@/components/reports/stat-card';
import { PiggyBank, Wallet, Percent } from 'lucide-react';
import { useCurrency } from '@/context/currency-context';

export default function ReportsPage() {
  const { transactions } = useTransactions();
  const { formatCurrency } = useCurrency();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netWorth = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <AppLayout>
      <div className="space-y-8">
        <ReportsHeader />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            title="Net Worth"
            value={formatCurrency(netWorth)}
            icon={Wallet}
            description="Total income minus total expenses."
          />
          <StatCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={PiggyBank}
            description="Your total earnings this period."
          />
          <StatCard
            title="Savings Rate"
            value={`${savingsRate.toFixed(2)}%`}
            icon={Percent}
            description="The percentage of income you are saving."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Income vs. Expenses</CardTitle>
              <CardDescription>
                A summary of your cash flow over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialSummaryChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expense by Category</CardTitle>
              <CardDescription>
                A breakdown of your spending by category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseBreakdownChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
