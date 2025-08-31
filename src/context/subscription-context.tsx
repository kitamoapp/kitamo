
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
}

interface SubscriptionContextType extends ReferralEarnings {
  currentTier: SubscriptionTier;
  setCurrentTier: (tier: SubscriptionTier) => void;
  nextTier: SubscriptionTier | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

const calculateEarnings = (tier: SubscriptionTier): ReferralEarnings => {
  let totalEarnings = 0;
  
  const averageReferralRevenue = 15; // Assume average plan price for demo

  // L1
  const l1Referrals = referredUsers.filter(u => u.referredBy === 'currentUser' && u.status === 'Active');
  totalEarnings += l1Referrals.length * averageReferralRevenue * (tier.levelPercentages[0] || 0);

  // L2
  const l1Ids = l1Referrals.map(u => u.id);
  const l2Referrals = referredUsers.filter(u => l1Ids.includes(u.referredBy) && u.status === 'Active');
  totalEarnings += l2Referrals.length * averageReferralRevenue * (tier.levelPercentages[1] || 0);

  // L3
  const l2Ids = l2Referrals.map(u => u.id);
  const l3Referrals = referredUsers.filter(u => l2Ids.includes(u.referredBy) && u.status === 'Active');
  totalEarnings += l3Referrals.length * averageReferralRevenue * (tier.levelPercentages[2] || 0);
  
  // L4
  const l3Ids = l3Referrals.map(u => u.id);
  const l4Referrals = referredUsers.filter(u => l3Ids.includes(u.referredBy) && u.status === 'Active');
  totalEarnings += l4Referrals.length * averageReferralRevenue * (tier.levelPercentages[3] || 0);

  // L5
  const l4Ids = l4Referrals.map(u => u.id);
  const l5Referrals = referredUsers.filter(u => l4Ids.includes(u.referredBy) && u.status === 'Active');
  totalEarnings += l5Referrals.length * averageReferralRevenue * (tier.levelPercentages[4] || 0);

  return { totalEarnings };
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [currentTier, setCurrentTierState] =
    useState<SubscriptionTier>(subscriptionTiers[0]);

  const setCurrentTier = useCallback((tier: SubscriptionTier) => {
    setCurrentTierState(tier);
  }, []);

  const nextTier: SubscriptionTier | undefined = useMemo(
    () => subscriptionTiers.find(t => t.price > currentTier.price)
    ,
    [currentTier]
  );
    
  const { totalEarnings } = useMemo(() => {
    if (currentTier.name === 'Bronze') {
      return { totalEarnings: 0 };
    }
    return calculateEarnings(currentTier);
  }, [currentTier]);
  
  const value = {
    currentTier,
    setCurrentTier,
    nextTier,
    totalEarnings,
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
