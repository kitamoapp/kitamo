

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
  plan: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
};

export type Currency = 'USD' | 'EUR' | 'JPY' | 'GBP' | 'PHP';

export type Category = {
  value: string;
  label: string;
  icon: React.ElementType;
};

export type SubscriptionFeature = {
  text: string;
  // Use earningCap to dynamically insert the value into the text where {cap} is a placeholder
  earningCap?: number;
};

export type SubscriptionTier = {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  price: number;
  annualPrice?: number;
  earningCap?: number;
  features: SubscriptionFeature[];
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  commissionRate: number;
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
    last4: string;
    bankName: string;
}

interface WalletPaymentMethod extends BasePaymentMethod {
    type: 'Wallet';
    provider: string;
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
  provider: string;
  email: string;
  autoPay: boolean;
};

export type NewReferredUser = {
  name: string;
  leg: 'left' | 'right';
  plan: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  referredBy?: string; // This can be the referral code
};

    
