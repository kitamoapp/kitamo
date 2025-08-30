
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
import { useCurrency } from '@/context/currency-context';

export function AiTipCard() {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();

  const getFinancialData = (): Omit<FinancialTipInput, 'currency'> => {
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
      const result = await generateFinancialTip({ ...financialData, currency });
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
  }, [currency]);

  return (
    <Card className="bg-primary/10 border-primary/20">
      <CardHeader className="flex-row items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <div>
            <CardTitle className="text-primary">Your AI Financial Tip</CardTitle>
            <CardDescription>
                Personalized advice to help you improve your financial health.
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-lg font-medium">{tip}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchTip}
          disabled={loading}
          className="text-primary hover:bg-primary/20 hover:text-primary"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Get a New Tip
        </Button>
      </CardFooter>
    </Card>
  );
}
