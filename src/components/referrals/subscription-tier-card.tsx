
'use client';

import { useMemo, useState } from 'react';
import { Star, TrendingUp, Zap } from 'lucide-react';
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

export function SubscriptionTierCard() {
  const { convertAndFormatCurrency } = useCurrency();
  const {
    activeReferrals,
    currentTier,
    nextTier,
    totalEarnings,
    directEarnings,
    indirectEarnings,
  } = useSubscription();
  const router = useRouter();

  const progressToNextTier = nextTier
    ? (activeReferrals / nextTier.requiredReferrals) * 100
    : 100;

  const canEarn = currentTier.earningCap > 0;
  const isUnlimited = currentTier.earningCap === Infinity;

  const earningsProgress = isUnlimited
    ? 100
    : (totalEarnings / currentTier.earningCap) * 100;

  return (
    <>
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
          {canEarn ? (
            <div className="space-y-2">
              <div
                className={`flex justify-between font-semibold ${currentTier.textColor}`}
              >
                <span>Current Earnings</span>
                <span>
                  {convertAndFormatCurrency(totalEarnings)} /{' '}
                  {isUnlimited
                    ? 'Unlimited'
                    : convertAndFormatCurrency(currentTier.earningCap)}
                </span>
              </div>
              <Progress value={earningsProgress} className="h-2" />
              <div
                className={`text-sm ${currentTier.textColor}/80 space-y-1`}
              >
                <p>
                  You have earned a total of{' '}
                  {convertAndFormatCurrency(totalEarnings)} from{' '}
                  {activeReferrals} active referrals in your network.
                </p>
                <p>
                  - Direct ({currentTier.directReferralPercent * 100}%):{' '}
                  {convertAndFormatCurrency(directEarnings)}
                </p>
                <p>
                  - Indirect ({currentTier.indirectReferralPercent * 100}%):{' '}
                  {convertAndFormatCurrency(indirectEarnings)}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 rounded-lg bg-background/50 p-4 text-center">
              <h3 className="font-semibold text-foreground">
                Start Earning Referral Bonuses!
              </h3>
              <p className="text-sm text-muted-foreground">
                Upgrade your plan to earn money for each friend you refer.
              </p>
              <Button
                size="sm"
                className="mt-2"
                onClick={() => router.push('/subscriptions')}
              >
                Upgrade Now
              </Button>
            </div>
          )}

          {nextTier && (
            <div className="space-y-2 rounded-lg bg-background/50 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-foreground">
                  Next Tier: {nextTier.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {activeReferrals} / {nextTier.requiredReferrals} Referrals
                </div>
              </div>
              <Progress value={progressToNextTier} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Refer {nextTier.requiredReferrals - activeReferrals} more
                friends to unlock an earning cap of{' '}
                {nextTier.earningCap === Infinity
                  ? 'Unlimited'
                  : convertAndFormatCurrency(nextTier.earningCap)}
                .
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
