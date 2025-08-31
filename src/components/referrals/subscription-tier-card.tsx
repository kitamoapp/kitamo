
'use client';

import { useMemo, useState } from 'react';
import { Star, TrendingUp, Zap } from 'lucide-react';

import {
  subscriptionTiers,
  referredUsers,
  REFERRAL_BONUS,
} from '@/lib/data';
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
import { rates } from '@/lib/currency-rates';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

export function SubscriptionTierCard() {
  const { currency, convertAndFormatCurrency } = useCurrency();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const activeReferrals = referredUsers.filter(
    (u) => u.status === 'Active'
  ).length;

  const currentTier = useMemo(() => {
    return (
      [...subscriptionTiers]
        .reverse()
        .find((tier) => activeReferrals >= tier.requiredReferrals) ||
      subscriptionTiers[0]
    );
  }, [activeReferrals]);

  const nextTier =
    subscriptionTiers[subscriptionTiers.indexOf(currentTier) + 1];
  
  const currentRate = rates[currency];
  const convertedEarningCap = currentTier.earningCap * currentRate;
  const convertedReferralBonus = REFERRAL_BONUS * currentRate;
  const currentEarnings = activeReferrals * convertedReferralBonus;


  const progressToNextTier = nextTier
    ? (activeReferrals / nextTier.requiredReferrals) * 100
    : 100;

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
        <Button size="sm" variant="secondary" onClick={() => setShowUpgradeDialog(true)}>
          <Zap className="mr-2" /> Upgrade
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div
            className={`flex justify-between font-semibold ${currentTier.textColor}`}
          >
            <span>Current Earnings</span>
            <span>
              {convertAndFormatCurrency(currentEarnings, currency)} /{' '}
              {convertAndFormatCurrency(currentTier.earningCap)}
            </span>
          </div>
          <Progress
            value={(currentEarnings / convertedEarningCap) * 100}
            className="h-2"
          />
          <p className={`text-sm ${currentTier.textColor}/80`}>
            You have earned {convertAndFormatCurrency(currentEarnings, currency)} from{' '}
            {activeReferrals} active referrals.
          </p>
        </div>

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
              Refer {nextTier.requiredReferrals - activeReferrals} more friends
              to unlock an earning cap of {convertAndFormatCurrency(nextTier.earningCap)}
              .
            </p>
          </div>
        )}
      </CardContent>
    </Card>
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade Your Plan</AlertDialogTitle>
            <AlertDialogDescription>
              This is where a real application would present different subscription plans and payment options. For this demo, this is just a placeholder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowUpgradeDialog(false)}>
              Got It!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
