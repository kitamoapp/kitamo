
'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import type { SubscriptionTier } from '@/lib/types';
import {
  subscriptionTiers,
  referredUsers,
} from '@/lib/data';

interface ReferralEarnings {
  totalEarnings: number;
  directEarnings: number;
  indirectEarnings: number;
}

interface SubscriptionContextType extends ReferralEarnings {
  activeReferrals: number;
  currentTier: SubscriptionTier;
  setCurrentTier: (tier: SubscriptionTier) => void;
  nextTier: SubscriptionTier | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

const calculateEarnings = (tier: SubscriptionTier): ReferralEarnings => {
  let directEarnings = 0;
  let indirectEarnings = 0;

  const directReferrals = referredUsers.filter(
    (u) => u.referredBy === 'currentUser' && u.status === 'Active'
  );

  directReferrals.forEach((direct) => {
    // For demonstration, assume each active referral subscribes to a plan
    // that costs on average $15.
    const averageReferralRevenue = 15;
    directEarnings += averageReferralRevenue * tier.directReferralPercent;

    const indirectReferrals = referredUsers.filter(
      (u) => u.referredBy === direct.id && u.status === 'Active'
    );

    indirectReferrals.forEach((indirect) => {
      indirectEarnings += averageReferralRevenue * tier.indirectReferralPercent;
    });
  });

  return {
    totalEarnings: directEarnings + indirectEarnings,
    directEarnings,
    indirectEarnings,
  };
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [currentTier, setCurrentTierState] =
    useState<SubscriptionTier>(subscriptionTiers[0]);

  const activeReferrals = useMemo(
    () =>
      referredUsers.filter(
        (u) => u.referredBy === 'currentUser' && u.status === 'Active'
      ).length,
    []
  );

  const setCurrentTier = useCallback((tier: SubscriptionTier) => {
    setCurrentTierState(tier);
  }, []);

  const nextTier: SubscriptionTier | undefined = useMemo(
    () => subscriptionTiers[subscriptionTiers.indexOf(currentTier) + 1],
    [currentTier]
  );

  const { totalEarnings, directEarnings, indirectEarnings } = useMemo(() => {
    if (currentTier.name === 'Bronze') {
      return { totalEarnings: 0, directEarnings: 0, indirectEarnings: 0 };
    }
    return calculateEarnings(currentTier);
  }, [currentTier]);

  const value = {
    activeReferrals,
    currentTier,
    setCurrentTier,
    nextTier,
    totalEarnings,
    directEarnings,
    indirectEarnings,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionProvider'
    );
  }
  return context;
};
