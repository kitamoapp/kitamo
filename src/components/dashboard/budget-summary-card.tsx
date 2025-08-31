
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useBudgets } from '@/context/budget-context';
import { useTransactions } from '@/context/transaction-context';
import { useCurrency } from '@/context/currency-context';
import { Progress } from '../ui/progress';
import { expenseCategories } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';
import { SetBudgetDialog } from '../budgets/set-budget-dialog';

export function BudgetSummaryCard() {
  const { budgets } = useBudgets();
  const { transactions } = useTransactions();
  const { formatCurrency } = useCurrency();

  const activeBudgets = Object.entries(budgets).filter(
    ([, amount]) => amount > 0
  );

  const spentAmounts = React.useMemo(() => {
    return activeBudgets.reduce((acc, [category]) => {
      const spent = transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.category === category &&
            new Date(t.date).getMonth() === new Date().getMonth()
        )
        .reduce((sum, t) => sum + t.amount, 0);
      acc[category] = spent;
      return acc;
    }, {} as Record<string, number>);
  }, [transactions, activeBudgets]);

  if (activeBudgets.length === 0) {
    return (
       <Card className="flex flex-col items-center justify-center text-center p-6 bg-muted/40">
        <CardHeader>
           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4">
            <Target className="h-6 w-6 text-primary" />
           </div>
          <CardTitle>Track Your Spending</CardTitle>
          <CardDescription>
            You haven't set any budgets yet. Create a budget to monitor your spending habits.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <SetBudgetDialog />
        </CardContent>
      </Card>
    )
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
        <CardDescription>
          Your spending progress for the current month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeBudgets.map(([category, budgetAmount]) => {
            const spent = spentAmounts[category] || 0;
            const progress = (spent / budgetAmount) * 100;
            const remaining = budgetAmount - spent;
            const categoryInfo = expenseCategories.find(c => c.value === category);

            return (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <div className='flex items-center gap-2'>
                    {categoryInfo && <categoryInfo.icon className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-medium">{category}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(spent)} / {formatCurrency(budgetAmount)}
                  </span>
                </div>
                <Progress value={progress} />
                 <p className={cn(
                    "text-xs mt-1",
                    remaining >= 0 ? "text-green-600" : "text-red-600"
                 )}>
                    {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over budget`}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
