
'use client';

import { useMemo } from 'react';
import { subscriptionTiers, referredUsers } from '@/lib/data';
import type { SubscriptionTier } from '@/lib/types';

export function useSubscription() {
  const activeReferrals = referredUsers.filter(
    (u) => u.status === 'Active'
  ).length;

  const currentTier: SubscriptionTier = useMemo(() => {
    return (
      [...subscriptionTiers]
        .reverse()
        .find((tier) => activeReferrals >= tier.requiredReferrals) ||
      subscriptionTiers[0]
    );
  }, [activeReferrals]);

  const nextTier: SubscriptionTier | undefined =
    subscriptionTiers[subscriptionTiers.indexOf(currentTier) + 1];

  return {
    activeReferrals,
    currentTier,
    nextTier,
  };
}
