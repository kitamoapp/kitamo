
'use client';

import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Lightbulb,
  Loader2,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTransactions } from '@/context/transaction-context';
import { useCurrency } from '@/context/currency-context';
import {
  getFinancialInsights,
  type FinancialInsightsOutput,
} from '@/ai/flows/financial-insights-flow';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const insightIcons = {
  positive: <TrendingUp className="h-4 w-4 text-green-500" />,
  negative: <TrendingDown className="h-4 w-4 text-red-500" />,
  neutral: <Info className="h-4 w-4 text-blue-500" />,
};

export function FinancialInsights() {
  const { transactions } = useTransactions();
  const { currency } = useCurrency();
  const [result, setResult] = useState<FinancialInsightsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      // Only fetch if there are some transactions to analyze
      if (transactions.length > 2) {
        try {
          const insights = await getFinancialInsights({ transactions, currency });
          setResult(insights);
        } catch (e) {
          console.error(e);
          setError('Could not load financial insights. Please try again later.');
        }
      } else {
        // Not enough data to provide insights
         setResult({ insights: [] });
      }
      setLoading(false);
    };

    fetchInsights();
  }, [transactions, currency]);

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-yellow-500" />
          AI Financial Insights
        </CardTitle>
        <CardDescription>
          Personalized tips based on your recent activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="ml-2 text-muted-foreground">Analyzing your data...</p>
          </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!loading && !error && result?.insights && result.insights.length > 0 && (
          <ul className="space-y-3">
            {result.insights.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1">
                    {insightIcons[item.type] || <Info className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                    <p className="text-sm">{item.insight}</p>
                    <p className="text-xs text-muted-foreground font-medium rounded-full ">{item.category}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
         {!loading && !error && (!result?.insights || result.insights.length === 0) && (
            <div className="text-center text-sm text-muted-foreground py-8">
                <p>Not enough transaction data to generate insights.</p>
                <p>Add more transactions to get started.</p>
            </div>
         )}
      </CardContent>
    </Card>
  );
}
