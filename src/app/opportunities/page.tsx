
'use client';

import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PiggyBank,
  TrendingUp,
  MessageSquareQuote,
  Sparkles,
  Loader2,
  AlertCircle,
  Users,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTransactions } from '@/context/transaction-context';
import { useSubscription } from '@/hooks/use-subscription';
import {
  getFinancialOpportunities,
  type FinancialOpportunity,
} from '@/ai/flows/opportunity-finder-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UpgradeCard } from '@/components/upgrade-card';
import { useRouter } from 'next/navigation';

const opportunityIcons = {
  savings: PiggyBank,
  income: Users, // Changed to Users icon for referral
  negotiation: MessageSquareQuote,
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<FinancialOpportunity[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { transactions } = useTransactions();
  const { currentTier } = useSubscription();
  const router = useRouter();

  const canUseFeature = currentTier.name !== 'Free';

  useEffect(() => {
    if (!canUseFeature) {
      setIsLoading(false);
      return;
    }

    const fetchOpportunities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getFinancialOpportunities({ transactions });
        setOpportunities(result.opportunities);
      } catch (err) {
        console.error('Error fetching financial opportunities:', err);
        setError(
          "We couldn't generate opportunities right now. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, [transactions, canUseFeature]);

  const handleActionClick = (opportunity: FinancialOpportunity) => {
    if (opportunity.action === 'Go to Referrals') {
      router.push('/referrals');
    }
    // Handle other actions if necessary
  };

  if (!canUseFeature) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Opportunities
            </h1>
            <p className="text-muted-foreground">
              Unlock AI-powered suggestions to improve your financial health.
            </p>
          </div>
          <UpgradeCard
            title="Find Ways to Save and Earn"
            description="Upgrade to get personalized AI suggestions for saving money, boosting your income, and negotiating better deals on your bills."
            buttonText="Upgrade to Unlock"
            featureIcon="ai"
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Financial Opportunities
            </h1>
            <p className="text-muted-foreground">
              Your AI-powered guide to saving more and earning more.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              // Re-trigger the fetch
              const fetchOpportunities = async () => {
                setIsLoading(true);
                setError(null);
                try {
                  const result = await getFinancialOpportunities({ transactions });
                  setOpportunities(result.opportunities);
                } catch (err) {
                  console.error('Error fetching financial opportunities:', err);
                  setError("We couldn't generate opportunities right now. Please try again later.");
                } finally {
                  setIsLoading(false);
                }
              };
              fetchOpportunities();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get New Suggestions
          </Button>
        </div>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-muted"></div>
                    <div className="h-4 w-1/2 rounded bg-muted"></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 w-full rounded bg-muted"></div>
                  <div className="h-4 w-full rounded bg-muted"></div>
                  <div className="h-4 w-5/6 rounded bg-muted"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && opportunities.length === 0 && (
          <Card className="flex flex-col items-center justify-center text-center p-10">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>All Clear For Now!</CardTitle>
              <CardDescription>
                We couldn't find any specific opportunities based on your
                recent activity. Keep tracking your finances and check back
                later!
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {!isLoading && !error && opportunities.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp, index) => {
              const Icon = opportunityIcons[opp.type] || Sparkles;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{opp.title}</CardTitle>
                      <CardDescription>
                        {opp.type === 'savings' && 'Savings Suggestion'}
                        {opp.type === 'income' && 'Income Opportunity'}
                        {opp.type === 'negotiation' && 'Negotiation Tip'}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground whitespace-pre-wrap font-sans">
                      {opp.description}
                    </p>
                    {opp.action && (
                      <Button
                        variant="link"
                        className="px-0 pt-4"
                        onClick={() => handleActionClick(opp)}
                      >
                        {opp.action}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
