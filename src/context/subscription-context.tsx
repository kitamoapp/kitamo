
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
import { subscriptionTiers, referredUsers } from '@/lib/data';

interface SubscriptionContextType {
  activeReferrals: number;
  currentTier: SubscriptionTier;
  setCurrentTier: (tier: SubscriptionTier) => void;
  nextTier: SubscriptionTier | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const activeReferrals = useMemo(
    () => referredUsers.filter((u) => u.status === 'Active').length,
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

  const value = {
    activeReferrals,
    currentTier,
    setCurrentTier,
    nextTier,
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
