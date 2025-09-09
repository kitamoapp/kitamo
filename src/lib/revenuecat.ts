
'use client';

import Purchases, {
  PurchasesStoreProduct,
  CustomerInfo,
  PurchasesOffering,
  LogInResult,
} from '@revenuecat/purchases-js';

const API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY;

if (API_KEY) {
  Purchases.setDebugLogsEnabled(true);
  Purchases.configure({ apiKey: API_KEY });
} else {
    console.warn("RevenueCat API key not found. Subscription features will be disabled.");
}

export const loginUser = async (userId: string): Promise<LogInResult> => {
  if (!API_KEY) throw new Error('RevenueCat API key not configured');
  return Purchases.logIn(userId);
};

export const logoutUser = async (): Promise<CustomerInfo> => {
  if (!API_KEY) throw new Error('RevenueCat API key not configured');
  return Purchases.logOut();
};

export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  if (!API_KEY) {
    console.warn('RevenueCat API key not configured. Cannot fetch offerings.');
    return null;
  }
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error("Could not fetch RevenueCat offerings:", error);
    return null;
  }
};

export const purchasePackage = async (pkg: PurchasesStoreProduct) => {
    if (!API_KEY) throw new Error('RevenueCat API key not configured');
    return Purchases.purchaseStoreProduct(pkg);
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
    if (!API_KEY) {
        console.warn('RevenueCat API key not configured. Cannot get customer info.');
        return null;
    }
    try {
        return Purchases.getCustomerInfo();
    } catch (error) {
        console.error("Could not fetch customer info:", error);
        return null;
    }
}
