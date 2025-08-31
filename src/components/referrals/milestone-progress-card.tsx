
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
  const { currentTier, totalEarnings, nextTier } = useSubscription();
  const { referredUsers } = useReferredUsers();
  const router = useRouter();

  const isBronze = currentTier.name === 'Bronze';

  const directReferralsCount = referredUsers.filter(
    (u) => u.referredBy === 'currentUser'
  ).length;

  const nextMilestone = referralMilestones.find(
    (m) => m.requiredReferrals > directReferralsCount
  );
  
  const currentMilestone = [...referralMilestones].reverse().find(
      (m) => directReferralsCount >= m.requiredReferrals
  );


  const goal = nextMilestone ? nextMilestone.requiredReferrals : (currentMilestone?.requiredReferrals || 0);
  const progress = goal > 0 ? (directReferralsCount / goal) * 100 : 100;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className={`h-6 w-6 text-primary`} />
            <span>Your Progress</span>
          </CardTitle>
          <CardDescription>
            Keep growing your network to unlock new rewards!
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
                  Next Milestone
                </p>
                <p className="font-semibold text-lg text-primary">
                  {nextMilestone ? nextMilestone.name : 'Max Rank Reached!'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">My Referrals</p>
                <p className="font-semibold text-lg">
                  {directReferralsCount} / {goal}
                </p>
              </div>
            </div>

            <Progress value={progress} className="h-3" />

            {nextMilestone && (
              <p className="text-sm text-muted-foreground">
                You need{' '}
                <span className="font-bold text-accent">
                  {nextMilestone.requiredReferrals - directReferralsCount}
                </span>{' '}
                more referrals to reach the {nextMilestone.name} rank!
              </p>
            )}

            <div
              className={`flex justify-between font-semibold pt-4 border-t border-dashed`}
            >
              <span>Current Monthly Earnings (Est.)</span>
              <span>{convertAndFormatCurrency(totalEarnings)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
