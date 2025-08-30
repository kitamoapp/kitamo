
'use client';

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

  const expenseData = transactions
    .filter((t) => t.type === 'expense')
    .reduce(
      (acc, t) => {
        let entry = acc.find((e) => e.category === t.category);
        if (!entry) {
          entry = { category: t.category, total: 0, fill: '' };
          acc.push(entry);
        }
        entry.total += t.amount;
        return acc;
      },
      [] as { category: string; total: number; fill: string }[]
    )
    .map((item) => ({
      ...item,
      fill: chartConfig[item.category as keyof typeof chartConfig]?.color || '#8884d8',
    }));

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[250px] w-full"
    >
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Tooltip
            content={
              <ChartTooltipContent
                nameKey="category"
                formatter={(value, name) => (
                  <div className="flex flex-col">
                    <span className="font-bold">{name}</span>
                    <span>{formatCurrency(value as number)}</span>
                  </div>
                )}
              />
            }
          />
          <Pie
            data={expenseData}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
              index,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              if (percent < 0.05) return null;

              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                  className="text-xs font-medium"
                >
                  {expenseData[index].category}
                </text>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
