
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
};

export type ReferredUser = {
  id:string;
  name: string;
  signupDate: string;
  status: 'Active' | 'Pending';
  referredBy: string | 'currentUser';
  leg: 'left' | 'right';
  plan: 'Free' | 'Personal' | 'Lite' | 'Pro' | 'Max';
};

export type Currency = 'USD' | 'EUR' | 'JPY' | 'GBP' | 'PHP';

export type Category = {
  value: string;
  label: string;
  icon: React.ElementType;
};

export type SubscriptionFeature = {
  id: string;
  text: string;
};

export type SubscriptionTier = {
  name: 'Free' | 'Personal' | 'Lite' | 'Pro' | 'Max';
  price: number;
  annualPrice?: number;
  priceId: string;
  annualPriceId: string;
  features: SubscriptionFeature[];
  commissionRate: number;
  earningCap: number;
};

export type ReferralMilestone = {
  name:string;
  requiredReferrals: number;
};

export type Reminder = {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
};


interface BasePaymentMethod {
    id: string;
    type: 'Card' | 'Bank' | 'Wallet';
    autoPay: boolean;
}

interface CardPaymentMethod extends BasePaymentMethod {
    type: 'Card';
    last4: string;
    expiry: string;
    brand: string;
}

interface BankPaymentMethod extends BasePaymentMethod {
    type: 'Bank';
    last4s: string;
    bankName: string;
}

interface WalletPaymentMethod extends BasePaymentMethod {
    type: 'Wallet';
    provider: 'GCash' | 'PayMaya';
    email: string;
}

export type PaymentMethod = CardPaymentMethod | BankPaymentMethod | WalletPaymentMethod;

export type PaymentMethodValues = {
  type: 'Card' | 'Bank' | 'Wallet';
  cardNumber: string;
  expiry: string;
  cvc: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  provider: 'GCash' | 'PayMaya';
  email: string;
  autoPay: boolean;
};

export type NewReferredUser = {
  name: string;
  leg: 'left' | 'right';
  plan: 'Free' | 'Personal' | 'Lite' | 'Pro' | 'Max';
  referredBy?: string; // This can be the referral code
};

    