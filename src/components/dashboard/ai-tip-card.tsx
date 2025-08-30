'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, RefreshCw } from 'lucide-react';
import {
  generateFinancialTip,
  type FinancialTipInput,
} from '@/ai/flows/generate-financial-tip';
import { Skeleton } from '@/components/ui/skeleton';
import { transactions } from '@/lib/data';

export function AiTipCard() {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  const getFinancialData = (): FinancialTipInput => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const spendingCategories = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {} as Record<string, number>);

    return { income, expenses, spendingCategories };
  };

  const fetchTip = async () => {
    setLoading(true);
    try {
      const financialData = getFinancialData();
      const result = await generateFinancialTip(financialData);
      setTip(result.tip);
    } catch (error) {
      console.error('Failed to generate financial tip:', error);
      setTip('Could not load a financial tip at this time. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTip();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          AI Financial Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-sm">{tip}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchTip}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          New Tip
        </Button>
      </CardFooter>
    </Card>
  );
}
