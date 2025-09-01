
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTransactions } from '@/context/transaction-context';
import { getFinancialInsights } from '@/ai/flows/financial-insights-flow';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function FinancialInsightsCard() {
  const { transactions } = useTransactions();
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getFinancialInsights({ transactions });
        setInsights(result.insights);
      } catch (err) {
        console.error('Error fetching financial insights:', err);
        setError('Sorry, we couldn\'t generate insights at this time. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [transactions]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <div>
            <CardTitle>Financial Insights</CardTitle>
            <CardDescription>
            AI-powered analysis of your recent activity.
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Analyzing your transactions...</span>
          </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!isLoading && !error && insights && (
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap font-sans">
            {insights}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
