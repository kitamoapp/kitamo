'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { transactions } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartTooltipContent, ChartContainer, ChartConfig } from '../ui/chart';

const chartData = transactions.reduce((acc, t) => {
    const day = t.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    let entry = acc.find(e => e.day === day);
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
}, [] as { day: string; income: number; expenses: number }[]).sort((a,b) => new Date(a.day + ", 2024").getTime() - new Date(b.day + ", 2024").getTime());


const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function FinancialSummaryChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} accessibilityLayer>
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
                tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
