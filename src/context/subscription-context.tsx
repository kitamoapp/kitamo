
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
import Purchases, { PurchasesStoreProduct, CustomerInfo, PurchasesOffering } from 'react-native-purchases';
import type { SubscriptionTier, ReferredUser } from '@/lib/types';
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
  offerings: PurchasesOffering | null;
  purchasePackage: (pkg: PurchasesStoreProduct) => Promise<void>;
  isLoaded: boolean;
  isPurchasing: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

const getDownlineVolume = (
  userId: string,
  allUsers: ReferredUser[],
): number => {
  const directReferrals = allUsers.filter(
    (u) => u.referredBy === userId && u.status === 'Active'
  );

  let volume = 0;
  for (const referral of directReferrals) {
    const tier = subscriptionTiers.find(t => t.name === referral.plan);
    if (tier) {
      volume += tier.price;
    }
    volume += getDownlineVolume(referral.id, allUsers);
  }
  return volume;
};

const calculateEarnings = (
  tier: SubscriptionTier,
  referredUsers: ReferredUser[],
): ReferralEarnings => {
  if (tier.commissionRate === 0) {
    return {
      totalEarnings: 0,
      leftLegVolume: 0,
      rightLegVolume: 0,
      payableVolume: 0,
    };
  }
  
  const getPlanPrice = (planName: ReferredUser['plan']) => {
    const tier = subscriptionTiers.find((t) => t.name === planName);
    return tier?.price || 0;
  };

  const directConnections = referredUsers.filter(
    (u) => u.referredBy === 'currentUser' && u.status === 'Active'
  );

  const leftLegConnection = directConnections.find((u) => u.leg === 'left');
  const rightLegConnection = directConnections.find((u) => u.leg === 'right');

  let leftLegVolume = 0;
  if (leftLegConnection) {
    leftLegVolume =
      getPlanPrice(leftLegConnection.plan) +
      getDownlineVolume(leftLegConnection.id, referredUsers);
  }

  let rightLegVolume = 0;
  if (rightLegConnection) {
    rightLegVolume =
      getPlanPrice(rightLegConnection.plan) +
      getDownlineVolume(rightLegConnection.id, referredUsers);
  }

  const payableVolume = Math.min(leftLegVolume, rightLegVolume);
  let totalEarnings = payableVolume * tier.commissionRate;
  
  const payingLeftConnections = directConnections.filter(u => u.leg === 'left' && getPlanPrice(u.plan) > 0);
  const payingRightConnections = directConnections.filter(u => u.leg === 'right' && getPlanPrice(u.plan) > 0);
  const currentTierPrice = getPlanPrice(tier.name);

  if (payingLeftConnections.length > 0 && payingRightConnections.length > 0) {
      const directConnectionPayments = directConnections.reduce((sum, user) => sum + getPlanPrice(user.plan), 0);
      if (directConnectionPayments >= currentTierPrice) {
          totalEarnings += currentTierPrice;
      }
  }

  return { totalEarnings, leftLegVolume, rightLegVolume, payableVolume };
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { referredUsers, isLoaded: usersLoaded } = useReferredUsers();
  const { user, loading: authLoading } = useAuth();

  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(subscriptionTiers[0]);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const updateTierFromCustomerInfo = (customerInfo: CustomerInfo) => {
    const premiumEntitlement = customerInfo.entitlements.active['premium_access'];
    if (premiumEntitlement) {
      const tier = subscriptionTiers.find(t => t.priceId === premiumEntitlement.productIdentifier || t.annualPriceId === premiumEntitlement.productIdentifier);
      if (tier) {
        setCurrentTier(tier);
      }
    } else {
      setCurrentTier(subscriptionTiers[0]); // Free plan
    }
  };


  useEffect(() => {
    const initRevenueCat = async () => {
      if (process.env.NEXT_PUBLIC_REVENUECAT_API_KEY) {
        Purchases.setDebugLogsEnabled(true);
        Purchases.configure({ apiKey: process.env.NEXT_PUBLIC_REVENUECAT_API_KEY });
      }
    };
    initRevenueCat();
  }, []);

  useEffect(() => {
    const setupUser = async () => {
      if (user) {
        try {
          await Purchases.logIn(user.uid);
          const customerInfo = await Purchases.getCustomerInfo();
          updateTierFromCustomerInfo(customerInfo);
          const offerings = await Purchases.getOfferings();
          if (offerings.current) {
            setOfferings(offerings.current);
          }
        } catch (e) {
          console.error("RevenueCat setup error:", e);
        } finally {
          setIsLoaded(true);
        }
      } else {
        // Handle user logout
        try {
            await Purchases.logOut();
            setCurrentTier(subscriptionTiers[0]);
            setOfferings(null);
        } catch (e) {
            console.error("RevenueCat logout error:", e);
        }
      }
    };

    if (!authLoading) {
      setupUser();
    }
  }, [user, authLoading]);

  const purchasePackage = async (pkg: PurchasesStoreProduct) => {
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchaseStoreProduct(pkg);
      updateTierFromCustomerInfo(customerInfo);
    } catch (e: any) {
        if (!e.userCancelled) {
            console.error("Purchase error", e);
        }
    } finally {
      setIsPurchasing(false);
    }
  };

  const { totalEarnings, leftLegVolume, rightLegVolume, payableVolume } =
    useMemo(() => {
      return calculateEarnings(currentTier, referredUsers);
    }, [currentTier, referredUsers]);

  const value = {
    currentTier,
    offerings,
    purchasePackage,
    totalEarnings,
    leftLegVolume,
    rightLegVolume,
    payableVolume,
    isLoaded: isLoaded && usersLoaded,
    isPurchasing,
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
