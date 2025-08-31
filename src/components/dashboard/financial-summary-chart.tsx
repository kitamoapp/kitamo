
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
import { subDays, format, getWeek, getYear, parseISO, startOfDay } from 'date-fns';

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
    let dataMap = new Map<string, { income: number; expenses: number; sortKey: number }>();

    if (period === 'day') {
      const sevenDaysAgo = startOfDay(subDays(now, 6));
      // Pre-populate the map for the last 7 days
      for (let i = 0; i < 7; i++) {
        const date = subDays(now, i);
        const key = format(date, 'MMM d');
        dataMap.set(key, { income: 0, expenses: 0, sortKey: date.getTime() });
      }

      transactions
        .filter(t => parseISO(t.date) >= sevenDaysAgo)
        .forEach(t => {
          const date = parseISO(t.date);
          const key = format(date, 'MMM d');
          if (dataMap.has(key)) {
            const entry = dataMap.get(key)!;
            if (t.type === 'income') entry.income += t.amount;
            else entry.expenses += t.amount;
          }
        });
        
    } else if (period === 'week') {
        const currentYearTransactions = transactions.filter(t => getYear(parseISO(t.date)) === getYear(now));
        currentYearTransactions.forEach(t => {
            const date = parseISO(t.date);
            const weekNumber = getWeek(date, { weekStartsOn: 1 });
            const key = `Week ${weekNumber}`;
            if (!dataMap.has(key)) {
                dataMap.set(key, { income: 0, expenses: 0, sortKey: weekNumber });
            }
            const entry = dataMap.get(key)!;
            if (t.type === 'income') entry.income += t.amount;
            else entry.expenses += t.amount;
        });

    } else if (period === 'month') {
        // Pre-populate map with all months
        for(let i=0; i<12; i++) {
            const monthName = format(new Date(now.getFullYear(), i, 1), 'MMM');
            dataMap.set(monthName, { income: 0, expenses: 0, sortKey: i });
        }
        
        transactions
            .filter(t => getYear(parseISO(t.date)) === getYear(now))
            .forEach(t => {
                const date = parseISO(t.date);
                const monthName = format(date, 'MMM');
                const entry = dataMap.get(monthName)!;
                if (t.type === 'income') entry.income += t.amount;
                else entry.expenses += t.amount;
            });

    } else if (period === 'year') {
        transactions.forEach(t => {
            const date = parseISO(t.date);
            const year = getYear(date);
            const key = year.toString();
             if (!dataMap.has(key)) {
                dataMap.set(key, { income: 0, expenses: 0, sortKey: year });
            }
            const entry = dataMap.get(key)!;
            if (t.type === 'income') entry.income += t.amount;
            else entry.expenses += t.amount;
        })
    }


    return Array.from(dataMap.entries())
      .map(([key, value]) => ({
        label: key,
        income: value.income,
        expenses: value.expenses,
        sortKey: value.sortKey,
      }))
      .sort((a, b) => a.sortKey - b.sortKey);

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
