
'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
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

    const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);
    
    const topCategories = sortedCategories.slice(0, 4);
    const otherCategories = sortedCategories.slice(4);

    const chartData = topCategories.map(([name, total]) => ({
      name,
      total,
      fill: chartConfig[name as keyof typeof chartConfig]?.color || chartConfig.Other.color,
    }));
    
    if (otherCategories.length > 0) {
        const otherTotal = otherCategories.reduce((sum, [, total]) => sum + total, 0);
        chartData.push({
            name: 'Other',
            total: otherTotal,
            fill: chartConfig.Other.color,
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
        <PieChart>
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
            outerRadius={100}
            innerRadius={60}
            labelLine={false}
            paddingAngle={5}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
              index,
            }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
              const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

              if ((percent * 100) < 5) return null; // Don't render label for small slices

              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-xs font-medium"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {expenseData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
