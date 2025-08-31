
'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import type { SubscriptionTier, ReferredUser } from '@/lib/types';
import {
  subscriptionTiers,
  referredUsers,
} from '@/lib/data';

interface ReferralEarnings {
  totalEarnings: number;
  leftLegVolume: number;
  rightLegVolume: number;
  payableVolume: number;
}

interface SubscriptionContextType extends ReferralEarnings {
  currentTier: SubscriptionTier;
  setCurrentTier: (tier: SubscriptionTier) => void;
  nextTier: SubscriptionTier | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

const getPlanPrice = (planName: ReferredUser['plan']) => {
  return subscriptionTiers.find(t => t.name === planName)?.price || 0;
}

// Recursive function to calculate volume for a given user's downline
const getDownlineVolume = (userId: string, allUsers: ReferredUser[]): number => {
  const directReferrals = allUsers.filter(u => u.referredBy === userId && u.status === 'Active');
  
  let volume = 0;
  for (const referral of directReferrals) {
    // Add the referral's own plan price to the volume
    volume += getPlanPrice(referral.plan);
    // Add the volume from their downline
    volume += getDownlineVolume(referral.id, allUsers);
  }
  return volume;
};


const calculateEarnings = (tier: SubscriptionTier): ReferralEarnings => {
  if (tier.commissionRate === 0) {
    return { totalEarnings: 0, leftLegVolume: 0, rightLegVolume: 0, payableVolume: 0 };
  }

  const directReferrals = referredUsers.filter(u => u.referredBy === 'currentUser' && u.status === 'Active');

  const leftLegReferral = directReferrals.find(u => u.leg === 'left');
  const rightLegReferral = directReferrals.find(u => u.leg === 'right');
  
  let leftLegVolume = 0;
  if (leftLegReferral) {
    leftLegVolume = getPlanPrice(leftLegReferral.plan) + getDownlineVolume(leftLegReferral.id, referredUsers);
  }

  let rightLegVolume = 0;
  if (rightLegReferral) {
    rightLegVolume = getPlanPrice(rightLegReferral.plan) + getDownlineVolume(rightLegReferral.id, referredUsers);
  }
  
  const payableVolume = Math.min(leftLegVolume, rightLegVolume);
  const totalEarnings = payableVolume * tier.commissionRate;

  return { totalEarnings, leftLegVolume, rightLegVolume, payableVolume };
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
    
  const { totalEarnings, leftLegVolume, rightLegVolume, payableVolume } = useMemo(() => {
    if (currentTier.name === 'Bronze') {
      return { totalEarnings: 0, leftLegVolume: 0, rightLegVolume: 0, payableVolume: 0 };
    }
    return calculateEarnings(currentTier);
  }, [currentTier]);
  
  const value = {
    currentTier,
    setCurrentTier,
    nextTier,
    totalEarnings,
    leftLegVolume,
    rightLegVolume,
    payableVolume,
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
