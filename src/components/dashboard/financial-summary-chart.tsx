
'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
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
import { subDays, format, getWeek, getMonth, getYear, startOfYear, startOfDay, startOfWeek, endOfWeek, parse } from 'date-fns';

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

    const sevenDaysAgo = startOfDay(subDays(now, 6));
    const beginningOfYear = startOfYear(now);

    switch (period) {
      case 'day':
        filteredTransactions = transactions.filter(t => new Date(t.date) >= sevenDaysAgo);
        break;
      case 'week':
      case 'month':
      case 'year':
        filteredTransactions = transactions.filter(t => new Date(t.date).getFullYear() === now.getFullYear());
        break;
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
          const weekNumber = getWeek(date, { weekStartsOn: 1 });
          key = `Week ${weekNumber}`;
          sortKey = weekNumber;
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

    const sortedData = Array.from(dataMap.entries())
      .map(([key, value]) => ({
        label: key,
        income: value.income,
        expenses: value.expenses,
        sortKey: value.sortKey,
      }))
      .sort((a, b) => a.sortKey - b.sortKey);

    if (period === 'day') {
      const result = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(now, i);
        const key = format(date, 'MMM d');
        const existingEntry = sortedData.find(d => d.label === key);
        if (existingEntry) {
          result.push(existingEntry);
        } else {
          result.push({ label: key, income: 0, expenses: 0, sortKey: date.getTime() });
        }
      }
      return result;
    }
    
    if (period === 'month') {
        const months = Array.from({length: 12}, (_, i) => format(new Date(now.getFullYear(), i, 1), 'MMM'));
        return months.map((monthName, index) => {
            const existing = sortedData.find(d => d.label === monthName);
            return existing || { label: monthName, income: 0, expenses: 0, sortKey: index };
        });
    }

    return sortedData;
  }, [transactions, period]);

  return (
    <ChartContainer config={barChartConfig} className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={barChartData} accessibilityLayer>
          <XAxis
            dataKey="label"
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
            tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, '')}
          />
          <ChartTooltip
            content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
