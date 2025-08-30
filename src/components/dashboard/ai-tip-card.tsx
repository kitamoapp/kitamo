
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function AiTipCard() {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);
  const [demographicArea, setDemographicArea] = useState('');
  const [financialGoal, setFinancialGoal] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');

  const { currency } = useCurrency();

  const getFinancialData = (): Omit<
    FinancialTipInput,
    'currency' | 'demographicArea' | 'financialGoal' | 'employmentStatus'
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
    if (!demographicArea || !financialGoal || !employmentStatus) {
      setTip(
        'Please fill in your demographic area, financial goal, and employment status to get a tip.'
      );
      return;
    }
    setLoading(true);
    try {
      const financialData = getFinancialData();
      const result = await generateFinancialTip({
        ...financialData,
        currency,
        demographicArea,
        financialGoal,
        employmentStatus,
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
    if (!demographicArea || !financialGoal || !employmentStatus) {
      setTip('Please fill in your details below to get a personalized tip.');
    }
  }, [currency, demographicArea, financialGoal, employmentStatus]);

  const canFetchTip =
    demographicArea.trim() !== '' &&
    financialGoal.trim() !== '' &&
    employmentStatus.trim() !== '';

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="demographic-area">Your Living Area</Label>
            <Select value={demographicArea} onValueChange={setDemographicArea}>
              <SelectTrigger id="demographic-area">
                <SelectValue placeholder="Select your area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Urban City">Urban City</SelectItem>
                <SelectItem value="Suburban Area">Suburban Area</SelectItem>
                <SelectItem value="Rural Countryside">
                  Rural Countryside
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="financial-goal">Primary Financial Goal</Label>
            <Select value={financialGoal} onValueChange={setFinancialGoal}>
              <SelectTrigger id="financial-goal">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Building an Emergency Fund">
                  Building an Emergency Fund
                </SelectItem>
                <SelectItem value="Paying Off Debt">Paying Off Debt</SelectItem>
                <SelectItem value="Saving for Retirement">
                  Saving for Retirement
                </SelectItem>
                <SelectItem value="Saving for a Large Purchase">
                  Saving for a Large Purchase
                </SelectItem>
                <SelectItem value="Investing for Growth">
                  Investing for Growth
                </SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employment-status">Employment Status</Label>
            <Select
              value={employmentStatus}
              onValueChange={setEmploymentStatus}
            >
              <SelectTrigger id="employment-status">
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time Employee">
                  Full-time Employee
                </SelectItem>
                <SelectItem value="Part-time Employee">
                  Part-time Employee
                </SelectItem>
                <SelectItem value="Freelancer/Self-Employed">
                  Freelancer/Self-Employed
                </SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Unemployed">Unemployed</SelectItem>
              </SelectContent>
            </Select>
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
          {tip ? 'Get a New Tip' : 'Get My First Tip'}
        </Button>
      </CardFooter>
    </Card>
  );
}
