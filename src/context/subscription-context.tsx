
'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import type { SubscriptionTier, ReferredUser } from '@/lib/types';
import { subscriptionTiers } from '@/lib/data';
import { useReferredUsers } from './referred-user-context';

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
  isLoaded: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'kitamo-subscription-tier';

const getPlanPrice = (planName: ReferredUser['plan']) => {
  return subscriptionTiers.find((t) => t.name === planName)?.price || 0;
};

// Recursive function to calculate volume for a given user's downline
const getDownlineVolume = (
  userId: string,
  allUsers: ReferredUser[]
): number => {
  const directReferrals = allUsers.filter(
    (u) => u.referredBy === userId && u.status === 'Active'
  );

  let volume = 0;
  for (const referral of directReferrals) {
    // Add the referral's own plan price to the volume
    volume += getPlanPrice(referral.plan);
    // Add the volume from their downline
    volume += getDownlineVolume(referral.id, allUsers);
  }
  return volume;
};

const calculateEarnings = (
  tier: SubscriptionTier,
  referredUsers: ReferredUser[]
): ReferralEarnings => {
  if (tier.commissionRate === 0) {
    return {
      totalEarnings: 0,
      leftLegVolume: 0,
      rightLegVolume: 0,
      payableVolume: 0,
    };
  }

  const directReferrals = referredUsers.filter(
    (u) => u.referredBy === 'currentUser' && u.status === 'Active'
  );

  const leftLegReferral = directReferrals.find((u) => u.leg === 'left');
  const rightLegReferral = directReferrals.find((u) => u.leg === 'right');

  let leftLegVolume = 0;
  if (leftLegReferral) {
    leftLegVolume =
      getPlanPrice(leftLegReferral.plan) +
      getDownlineVolume(leftLegReferral.id, referredUsers);
  }

  let rightLegVolume = 0;
  if (rightLegReferral) {
    rightLegVolume =
      getPlanPrice(rightLegReferral.plan) +
      getDownlineVolume(rightLegReferral.id, referredUsers);
  }

  const payableVolume = Math.min(leftLegVolume, rightLegVolume);
  const totalEarnings = Math.min(payableVolume * tier.commissionRate, tier.earningCap ?? Infinity);

  return { totalEarnings, leftLegVolume, rightLegVolume, payableVolume };
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { referredUsers } = useReferredUsers();
  const [currentTier, setCurrentTierState] =
    useState<SubscriptionTier>(subscriptionTiers[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        const storedTier = JSON.parse(item);
        const foundTier = subscriptionTiers.find(t => t.name === storedTier.name);
        if (foundTier) {
          setCurrentTierState(foundTier);
        }
      }
    } catch (error) {
      console.error('Error reading subscription tier from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  const setCurrentTier = useCallback((tier: SubscriptionTier) => {
    setCurrentTierState(tier);
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
       try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentTier));
      } catch (error) {
        console.error('Error saving subscription tier to localStorage', error);
      }
    }
  }, [currentTier, isLoaded]);

  const nextTier: SubscriptionTier | undefined = useMemo(
    () => subscriptionTiers.find((t) => t.price > currentTier.price),
    [currentTier]
  );

  const { totalEarnings, leftLegVolume, rightLegVolume, payableVolume } =
    useMemo(() => {
      if (currentTier.name === 'Bronze') {
        return {
          totalEarnings: 0,
          leftLegVolume: 0,
          rightLegVolume: 0,
          payableVolume: 0,
        };
      }
      return calculateEarnings(currentTier, referredUsers);
    }, [currentTier, referredUsers]);

  const value = {
    currentTier,
    setCurrentTier,
    nextTier,
    totalEarnings,
    leftLegVolume,
    rightLegVolume,
    payableVolume,
    isLoaded,
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
