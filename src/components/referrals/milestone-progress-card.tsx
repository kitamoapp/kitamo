
'use client';

import { Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useCurrency } from '@/context/currency-context';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';
import { useSubscription } from '@/hooks/use-subscription';

export function MilestoneProgressCard() {
  const { convertAndFormatCurrency } = useCurrency();
  const { currentTier, totalEarnings } = useSubscription();
  const router = useRouter();

  const earnsCommission = currentTier.commissionRate > 0;
  const earningCap = currentTier.earningCap;
  
  const progress = earningCap > 0 && earningCap !== Infinity 
    ? (totalEarnings / earningCap) * 100 
    : (earningCap === Infinity ? 100 : 0);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className={`h-6 w-6 text-primary`} />
            <span>Your Progress</span>
          </CardTitle>
          <CardDescription>
            Track your community rewards towards your monthly cap.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!earnsCommission ? (
          <div className="space-y-2 rounded-lg bg-background/50 p-4 text-center">
            <h3 className="font-semibold text-foreground">
              Unlock Your Earning Potential!
            </h3>
            <p className="text-sm text-muted-foreground">
              Upgrade to a plan with community rewards to start earning.
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
                  Monthly Bonus
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
              {earningCap === Infinity 
                ? "You have uncapped earning potential!"
                : `You've earned ${convertAndFormatCurrency(totalEarnings)} of your ${convertAndFormatCurrency(earningCap)} cap.`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
