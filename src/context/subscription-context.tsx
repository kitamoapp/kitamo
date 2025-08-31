
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
  REFERRAL_PERCENTAGES,
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

const calculateEarnings = (): ReferralEarnings => {
  let directEarnings = 0;
  let indirectEarnings = 0;

  const directReferrals = referredUsers.filter(
    (u) => u.referredBy === 'currentUser' && u.status === 'Active'
  );

  directReferrals.forEach((direct) => {
    directEarnings += direct.earnings * REFERRAL_PERCENTAGES.direct;

    const indirectReferrals = referredUsers.filter(
      (u) => u.referredBy === direct.id && u.status === 'Active'
    );

    indirectReferrals.forEach((indirect) => {
      indirectEarnings += indirect.earnings * REFERRAL_PERCENTAGES.indirect;
    });
  });

  return {
    totalEarnings: directEarnings + indirectEarnings,
    directEarnings,
    indirectEarnings,
  };
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const activeReferrals = useMemo(
    () =>
      referredUsers.filter(
        (u) => u.referredBy === 'currentUser' && u.status === 'Active'
      ).length,
    []
  );

  const initialTier = useMemo(() => {
    return (
      [...subscriptionTiers]
        .reverse()
        .find((tier) => activeReferrals >= tier.requiredReferrals) ||
      subscriptionTiers[0]
    );
  }, [activeReferrals]);

  const [currentTier, setCurrentTierState] =
    useState<SubscriptionTier>(initialTier);

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
    return calculateEarnings();
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

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useSubscriptionContext must be used within a SubscriptionProvider'
    );
  }
  return context;
};
