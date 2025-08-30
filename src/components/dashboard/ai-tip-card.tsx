
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export function AiTipCard() {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);
  const [demographicArea, setDemographicArea] = useState('');
  const [financialBackground, setFinancialBackground] =
    useState('');
  const { currency } = useCurrency();

  const getFinancialData = (): Omit<
    FinancialTipInput,
    'currency' | 'demographicArea' | 'financialBackground'
  > => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const spendingCategories = transactions
      .filter((t) => t.type === 'expense')
      .reduce(
        (acc, t) => {
          if (!acc[t.category]) {
            acc[t.category] = 0;
          }
          acc[t.category] += t.amount;
          return acc;
        },
        {} as Record<string, number>
      );

    return { income, expenses, spendingCategories };
  };

  const fetchTip = async () => {
    if (!demographicArea || !financialBackground) {
        setTip("Please fill in your demographic area and financial background to get a tip.")
        return;
    }
    setLoading(true);
    try {
      const financialData = getFinancialData();
      const result = await generateFinancialTip({
        ...financialData,
        currency,
        demographicArea,
        financialBackground,
      });
      setTip(result.tip);
    } catch (error) {
      console.error('Failed to generate financial tip:', error);
      setTip('Could not load a financial tip at this time. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!demographicArea || !financialBackground) {
        setTip("Please fill in your details below to get a personalized tip.")
    }
  }, [currency, demographicArea, financialBackground]);
  
  const canFetchTip = demographicArea.trim() !== '' && financialBackground.trim() !== '';

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
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="demographic-area">Your Living Area</Label>
            <Input
              id="demographic-area"
              value={demographicArea}
              onChange={(e) => setDemographicArea(e.target.value)}
              placeholder="e.g., Urban, Suburban, Rural"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="financial-background">Your Financial Profile</Label>
            <Input
              id="financial-background"
              value={financialBackground}
              onChange={(e) => setFinancialBackground(e.target.value)}
              placeholder="e.g., Student, Young Professional"
            />
          </div>
        </div>
        {loading ? (
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-lg font-medium pt-4">{tip}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchTip}
          disabled={loading || !canFetchTip}
          className="text-primary hover:bg-primary/20 hover:text-primary"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          {tip ? "Get a New Tip" : "Get My First Tip"}
        </Button>
      </CardFooter>
    </Card>
  );
}
