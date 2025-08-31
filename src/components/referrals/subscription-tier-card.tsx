
'use client';

import { Star, Zap } from 'lucide-react';
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
import { useSubscription } from '@/context/subscription-context';

export function SubscriptionTierCard() {
  const { convertAndFormatCurrency } = useCurrency();
  const {
    currentTier,
    totalEarnings,
  } = useSubscription();
  const router = useRouter();

  const isBronze = currentTier.name === 'Bronze';
  
  return (
    <Card
      className={`border-2 ${currentTier.borderColor} bg-gradient-to-br ${currentTier.gradientFrom} ${currentTier.gradientTo}`}
    >
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Star className={`h-6 w-6 ${currentTier.textColor}`} />
            <span className={currentTier.textColor}>
              {currentTier.name} Tier
            </span>
          </CardTitle>
          <CardDescription className={`${currentTier.textColor}/80`}>
            Your current subscription level.
          </CardDescription>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => router.push('/subscriptions')}
        >
          <Zap className="mr-2" /> View Plans
        </Button>
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
          <div className="space-y-2">
            <div
              className={`flex justify-between font-semibold ${currentTier.textColor}`}
            >
              <span>Current Monthly Earnings (Est.)</span>
              <span>
                {convertAndFormatCurrency(totalEarnings)}
              </span>
            </div>
            <div className={`text-sm ${currentTier.textColor}/80 space-y-1`}>
              <p>
                This is an estimate of your monthly earnings based on your current network.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
