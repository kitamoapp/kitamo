
'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { useTransactions } from '@/context/transaction-context';
import {
  ChartTooltipContent,
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from '../ui/chart';
import { useCurrency } from '@/context/currency-context';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ExpenseBreakdownChart } from './expense-breakdown-chart';

const barChartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-2))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type ChartType = 'bar' | 'pie';

export function FinancialSummaryChart() {
  const { formatCurrency } = useCurrency();
  const { transactions } = useTransactions();

  const barChartData = transactions
    .reduce(
      (acc, t) => {
        const day = new Date(t.date).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
        });
        let entry = acc.find((e) => e.day === day);
        if (!entry) {
          entry = { day, income: 0, expenses: 0 };
          acc.push(entry);
        }
        if (t.type === 'income') {
          entry.income += t.amount;
        } else {
          entry.expenses += t.amount;
        }
        return acc;
      },
      [] as { day: string; income: number; expenses: number }[]
    )
    .sort(
      (a, b) =>
        new Date(a.day + ', 2024').getTime() -
        new Date(b.day + ', 2024').getTime()
    );

  return (
    <Tabs defaultValue="bar">
      <div className="flex items-center justify-end">
        <TabsList>
          <TabsTrigger value="bar">Income vs. Expenses</TabsTrigger>
          <TabsTrigger value="pie">Expense Breakdown</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="bar" className="mt-4">
        <ChartContainer
          config={barChartConfig}
          className="min-h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData} accessibilityLayer>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                tickFormatter={(value) =>
                  formatCurrency(value).replace(/\.00$/, '')
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(value as number)}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </TabsContent>
      <TabsContent value="pie" className="mt-4">
        <ExpenseBreakdownChart />
      </TabsContent>
    </Tabs>
  );
}
