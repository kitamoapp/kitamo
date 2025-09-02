
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
import type { SubscriptionTier, ReferredUser, TierPrice, Currency } from '@/lib/types';
import { subscriptionTiers } from '@/lib/data';
import { useReferredUsers } from './referred-user-context';
import { useAuth } from './auth-context';

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
  getTierPrice: (tier: SubscriptionTier, currency: Currency) => TierPrice | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'kitamo-subscription-tier';


// Recursive function to calculate volume for a given user's downline
const getDownlineVolume = (
  userId: string,
  allUsers: ReferredUser[],
  currency: Currency,
): number => {
  const directReferrals = allUsers.filter(
    (u) => u.referredBy === userId && u.status === 'Active'
  );

  let volume = 0;
  for (const referral of directReferrals) {
    const tier = subscriptionTiers.find(t => t.name === referral.plan);
    if (tier) {
        const priceInfo = tier.prices.find(p => p.currency === currency);
        if (priceInfo) {
            volume += priceInfo.amount;
        }
    }
    // Add the volume from their downline
    volume += getDownlineVolume(referral.id, allUsers, currency);
  }
  return volume;
};

const calculateEarnings = (
  tier: SubscriptionTier,
  referredUsers: ReferredUser[],
  currency: Currency
): ReferralEarnings => {
  if (tier.commissionRate === 0) {
    return {
      totalEarnings: 0,
      leftLegVolume: 0,
      rightLegVolume: 0,
      payableVolume: 0,
    };
  }
  
  const getPlanPrice = (planName: ReferredUser['plan'], currency: Currency) => {
    const tier = subscriptionTiers.find((t) => t.name === planName);
    const priceInfo = tier?.prices.find(p => p.currency === currency);
    return priceInfo?.amount || 0;
  };

  const directReferrals = referredUsers.filter(
    (u) => u.referredBy === 'currentUser' && u.status === 'Active'
  );

  const leftLegReferral = directReferrals.find((u) => u.leg === 'left');
  const rightLegReferral = directReferrals.find((u) => u.leg === 'right');

  let leftLegVolume = 0;
  if (leftLegReferral) {
    leftLegVolume =
      getPlanPrice(leftLegReferral.plan, currency) +
      getDownlineVolume(leftLegReferral.id, referredUsers, currency);
  }

  let rightLegVolume = 0;
  if (rightLegReferral) {
    rightLegVolume =
      getPlanPrice(rightLegReferral.plan, currency) +
      getDownlineVolume(rightLegReferral.id, referredUsers, currency);
  }

  const payableVolume = Math.min(leftLegVolume, rightLegVolume);
  let totalEarnings = payableVolume * tier.commissionRate;
  
  const payingLeftReferrals = directReferrals.filter(u => u.leg === 'left' && getPlanPrice(u.plan, currency) > 0);
  const payingRightReferrals = directReferrals.filter(u => u.leg === 'right' && getPlanPrice(u.plan, currency) > 0);
  const currentTierPrice = getPlanPrice(tier.name, currency);

  if (payingLeftReferrals.length > 0 && payingRightReferrals.length > 0) {
      const directReferralPayments = directReferrals.reduce((sum, user) => sum + getPlanPrice(user.plan, currency), 0);
      if (directReferralPayments >= currentTierPrice) {
          totalEarnings += currentTierPrice;
      }
  }

  return { totalEarnings, leftLegVolume, rightLegVolume, payableVolume };
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { referredUsers, isLoaded: usersLoaded } = useReferredUsers();
  const { regionalCurrency, loading: authLoading } = useAuth();
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
      } else {
        setCurrentTierState(subscriptionTiers[0]);
      }
    } catch (error) {
      console.error('Error reading subscription tier from localStorage', error);
      setCurrentTierState(subscriptionTiers[0]);
    }
    setIsLoaded(true);
  }, []);

  const setCurrentTier = useCallback((tier: SubscriptionTier) => {
    setCurrentTierState(tier);
  }, []);
  
  const getTierPrice = useCallback((tier: SubscriptionTier, currency: Currency) => {
    return tier.prices.find(p => p.currency === currency);
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

  const nextTier: SubscriptionTier | undefined = useMemo(() => {
    const currentPrice = getTierPrice(currentTier, regionalCurrency || 'USD')?.amount ?? 0;
    return subscriptionTiers.find((t) => {
      const tierPrice = getTierPrice(t, regionalCurrency || 'USD')?.amount ?? 0;
      return tierPrice > currentPrice;
    });
  }, [currentTier, regionalCurrency, getTierPrice]);

  const { totalEarnings, leftLegVolume, rightLegVolume, payableVolume } =
    useMemo(() => {
      if (currentTier.name === 'Bronze' || !regionalCurrency) {
        return {
          totalEarnings: 0,
          leftLegVolume: 0,
          rightLegVolume: 0,
          payableVolume: 0,
        };
      }
      return calculateEarnings(currentTier, referredUsers, regionalCurrency);
    }, [currentTier, referredUsers, regionalCurrency]);

  const value = {
    currentTier,
    setCurrentTier,
    nextTier,
    totalEarnings,
    leftLegVolume,
    rightLegVolume,
    payableVolume,
    isLoaded: isLoaded && usersLoaded && !authLoading,
    getTierPrice,
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
