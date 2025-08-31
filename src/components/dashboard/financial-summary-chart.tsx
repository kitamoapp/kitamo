
'use client';

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
import { useMemo } from 'react';
import type { Period } from '@/app/dashboard/page';
import { subDays, format, getWeek, getMonth, getYear } from 'date-fns';

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

export function FinancialSummaryChart({ period }: { period: Period }) {
  const { formatCurrency } = useCurrency();
  const { transactions } = useTransactions();

  const barChartData = useMemo(() => {
    const now = new Date();
    let filteredTransactions = transactions;
    
    // 1. More efficient data filtering before processing
    if (period === 'day') {
        const sevenDaysAgo = subDays(now, 6);
        filteredTransactions = transactions.filter(t => new Date(t.date) >= sevenDaysAgo && new Date(t.date) <= now);
    } else if (period === 'week' || period === 'month') {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        filteredTransactions = transactions.filter(t => new Date(t.date) >= startOfYear && new Date(t.date) <= now);
    }

    const dataMap = new Map<string, { income: number; expenses: number; sortKey: number }>();

    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      let key = '';
      let sortKey = 0;

      switch (period) {
        case 'day':
          key = format(date, 'MMM d');
          sortKey = date.getTime();
          break;
        case 'week':
          key = `Week ${getWeek(date)}`;
          sortKey = getWeek(date);
          break;
        case 'month':
          key = format(date, 'MMM');
          sortKey = getMonth(date);
          break;
        case 'year':
          key = format(date, 'yyyy');
          sortKey = getYear(date);
          break;
      }

      if (!dataMap.has(key)) {
        dataMap.set(key, { income: 0, expenses: 0, sortKey });
      }

      const entry = dataMap.get(key)!;
      if (t.type === 'income') {
        entry.income += t.amount;
      } else {
        entry.expenses += t.amount;
      }
    });

    // 2. More robust chronological sorting
    return Array.from(dataMap.entries())
        .map(([key, value]) => ({
            day: key,
            income: value.income,
            expenses: value.expenses,
            sortKey: value.sortKey,
        }))
        .sort((a, b) => a.sortKey - b.sortKey);

  }, [transactions, period]);

  return (
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
  );
}
