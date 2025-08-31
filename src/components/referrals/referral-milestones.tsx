
'use client';

import { CheckCircle, Award, Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { referralMilestones, referredUsers, subscriptionTiers } from '@/lib/data';
import { useCurrency } from '@/context/currency-context';

export function ReferralMilestones() {
  const { convertAndFormatCurrency } = useCurrency();
  const activeReferrals = referredUsers.filter(
    (user) => user.status === 'Active'
  ).length;

  const renderMilestoneName = (milestone: (typeof referralMilestones)[0], tier?: (typeof subscriptionTiers)[0]) => {
    if (!tier) return milestone.name;
    const cap = tier.earningCap === Infinity ? 'unlimited' : convertAndFormatCurrency(tier.earningCap);
    return milestone.name.replace('{cap}', cap);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Milestones</CardTitle>
        <CardDescription>
          Unlock new tiers and earn bonuses as you refer more friends.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {referralMilestones.map((milestone, index) => {
            const isCompleted = activeReferrals >= milestone.requiredReferrals;
            const tier = subscriptionTiers.find(t => t.requiredReferrals === milestone.requiredReferrals);

            return (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Star
                      className={cn(
                        'h-6 w-6',
                        activeReferrals >=
                          (referralMilestones[index - 1]?.requiredReferrals ||
                            0)
                          ? tier?.textColor || 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    />
                  )}
                </div>
                <div className="ml-3">
                  <p
                    className={cn(
                      'font-semibold',
                      isCompleted && 'text-green-600 dark:text-green-400'
                    )}
                  >
                    {renderMilestoneName(milestone, tier)} ({milestone.requiredReferrals} Referrals)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Bonus Reward: {convertAndFormatCurrency(milestone.reward)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
