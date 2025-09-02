
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
import { subDays, format, getWeek, getYear, parseISO, startOfDay, eachDayOfInterval, subWeeks, eachWeekOfInterval, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';

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

  const { barChartData, maxY } = useMemo(() => {
    const now = new Date();
    let dataMap = new Map<string, { income: number; expenses: number; sortKey: number }>();

    if (period === 'day') {
      // Last 7 days
      const last7Days = eachDayOfInterval({ start: subDays(now, 6), end: now });
      last7Days.forEach(date => {
        const key = format(date, 'MMM d');
        dataMap.set(key, { income: 0, expenses: 0, sortKey: date.getTime() });
      });

      const sevenDaysAgo = startOfDay(subDays(now, 6));
      transactions
        .filter(t => parseISO(t.date) >= sevenDaysAgo)
        .forEach(t => {
          const key = format(parseISO(t.date), 'MMM d');
          const entry = dataMap.get(key);
          if (entry) {
            if (t.type === 'income') entry.income += t.amount;
            else entry.expenses += t.amount;
          }
        });
        
    } else if (period === 'week') {
        // Last 12 weeks
        const twelveWeeksAgo = subWeeks(now, 11);
        const last12Weeks = eachWeekOfInterval({ start: twelveWeeksAgo, end: now }, { weekStartsOn: 1 });

        last12Weeks.forEach((weekStartDate) => {
            const weekNumber = getWeek(weekStartDate, { weekStartsOn: 1 });
            const key = `W${weekNumber}`;
            dataMap.set(key, { income: 0, expenses: 0, sortKey: weekStartDate.getTime() });
        });

        transactions
            .filter(t => parseISO(t.date) >= twelveWeeksAgo)
            .forEach(t => {
                const date = parseISO(t.date);
                const weekNumber = getWeek(date, { weekStartsOn: 1 });
                const key = `W${weekNumber}`;
                const entry = dataMap.get(key);
                if (entry) {
                    if (t.type === 'income') entry.income += t.amount;
                    else entry.expenses += t.amount;
                }
            });

    } else if (period === 'month') {
        // Pre-populate map with all months of the current year
        const months = eachMonthOfInterval({ start: startOfYear(now), end: endOfYear(now) });
        months.forEach((month, index) => {
            const monthName = format(month, 'MMM');
            dataMap.set(monthName, { income: 0, expenses: 0, sortKey: index });
        });
        
        transactions
            .filter(t => getYear(parseISO(t.date)) === getYear(now))
            .forEach(t => {
                const monthName = format(parseISO(t.date), 'MMM');
                const entry = dataMap.get(monthName);
                if (entry) {
                    if (t.type === 'income') entry.income += t.amount;
                    else entry.expenses += t.amount;
                }
            });

    } else if (period === 'year') {
        transactions.forEach(t => {
            const year = getYear(parseISO(t.date));
            const key = year.toString();
             if (!dataMap.has(key)) {
                dataMap.set(key, { income: 0, expenses: 0, sortKey: year });
            }
            const entry = dataMap.get(key)!;
            if (t.type === 'income') entry.income += t.amount;
            else entry.expenses += t.amount;
        })
    }


    const finalData = Array.from(dataMap.entries())
      .map(([key, value]) => ({
        label: key,
        income: value.income,
        expenses: value.expenses,
        sortKey: value.sortKey,
      }))
      .sort((a, b) => a.sortKey - b.sortKey);
    
    // Find the max value for Y-axis domain
    const maxVal = finalData.reduce((max, item) => Math.max(max, item.income, item.expenses), 0);
    const yAxisMax = Math.max(50000, maxVal); // Set a minimum of 50000 or the max value if higher

    return { barChartData: finalData, maxY: yAxisMax };

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
            domain={[0, (dataMax: number) => Math.max(maxY, dataMax)]}
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
