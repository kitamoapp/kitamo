
'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useTransactions } from '@/context/transaction-context';
import {
  ChartContainer,
  ChartConfig,
  ChartTooltipContent,
} from '../ui/chart';
import { useCurrency } from '@/context/currency-context';

const chartConfig = {
  Groceries: { label: 'Groceries', color: 'hsl(var(--chart-1))' },
  Rent: { label: 'Rent', color: 'hsl(var(--chart-2))' },
  Transport: { label: 'Transport', color: 'hsl(var(--chart-3))' },
  Entertainment: { label: 'Entertainment', color: 'hsl(var(--chart-4))' },
  Shopping: { label: 'Shopping', color: 'hsl(var(--chart-5))' },
  Health: { label: 'Health', color: 'hsl(var(--chart-1))' },
  Utilities: { label: 'Utilities', color: 'hsl(var(--chart-2))' },
  Other: { label: 'Other', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

const RADIAN = Math.PI / 180;
const CustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="hsl(var(--foreground))"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs"
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};


export function ExpenseBreakdownChart() {
  const { formatCurrency } = useCurrency();
  const { transactions } = useTransactions();

  const expenseData = React.useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    if (expenses.length === 0) {
      return [];
    }
    
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    const categoryTotals = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>);

    const chartData = [];
    let otherTotal = 0;

    for (const category in categoryTotals) {
        const percentage = (categoryTotals[category] / totalExpense);
        if (percentage < 0.05) { // Group categories making up less than 5%
            otherTotal += categoryTotals[category];
        } else {
            chartData.push({
                name: category,
                total: categoryTotals[category],
                fill: chartConfig[category as keyof typeof chartConfig]?.color || 'hsl(var(--chart-3))',
            });
        }
    }

    if (otherTotal > 0) {
        chartData.push({
            name: 'Other',
            total: otherTotal,
            fill: chartConfig['Other']?.color || 'hsl(var(--chart-3))',
        });
    }

    return chartData;
  }, [transactions]);

  if (expenseData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No expense data for this period.
      </div>
    );
  }


  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Tooltip
            content={
              <ChartTooltipContent
                nameKey="name"
                formatter={(value) => formatCurrency(value as number)}
              />
            }
          />
          <Pie
            data={expenseData}
            dataKey="total"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={true}
            label={<CustomLabel />}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
