
'use client';

import { Award, Star, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useCurrency } from '@/context/currency-context';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';
import { useSubscription } from '@/hooks/use-subscription';
import { useReferredUsers } from '@/context/referred-user-context';
import { referralMilestones } from '@/lib/data';

export function MilestoneProgressCard() {
  const { convertAndFormatCurrency } = useCurrency();
  const { currentTier, totalEarnings } = useSubscription();
  const { referredUsers } = useReferredUsers();
  const router = useRouter();

  const isBronze = currentTier.name === 'Bronze';
  const earningCap = currentTier.earningCap ?? 0;
  const progress = earningCap > 0 ? (totalEarnings / earningCap) * 100 : 0;
  const remaining = earningCap - totalEarnings;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className={`h-6 w-6 text-primary`} />
            <span>Your Progress</span>
          </CardTitle>
          <CardDescription>
            Track your earnings towards your monthly cap.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isBronze ? (
          <div className="space-y-2 rounded-lg bg-background/50 p-4 text-center">
            <h3 className="font-semibold text-foreground">
              Unlock Your Earning Potential!
            </h3>
            <p className="text-sm text-muted-foreground">
              Upgrade to a paid plan to start earning from your referrals.
            </p>
            <Button
              size="sm"
              className="mt-4"
              onClick={() => router.push('/subscriptions')}
            >
              Upgrade to Earn
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Monthly Earnings
                </p>
                <p className="font-semibold text-lg text-primary">
                  {convertAndFormatCurrency(totalEarnings)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Earning Cap</p>
                <p className="font-semibold text-lg">
                  {earningCap === Infinity
                    ? 'Unlimited'
                    : convertAndFormatCurrency(earningCap)}
                </p>
              </div>
            </div>

            <Progress value={progress} className="h-3" />

            <p className="text-sm text-muted-foreground">
              You have earned{' '}
              <span className="font-bold text-accent">
                {convertAndFormatCurrency(totalEarnings)}
              </span>{' '}
              of your {convertAndFormatCurrency(earningCap)} cap this
              month.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
