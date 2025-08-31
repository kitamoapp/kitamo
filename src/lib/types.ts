
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: Date | string;
  description: string;
};

export type ReferredUser = {
  id: string;
  name: string;
  email: string;
  signupDate: Date;
  status: 'Active' | 'Pending';
};

export type Currency = 'USD' | 'EUR' | 'JPY' | 'GBP' | 'PHP';

export type Category = {
  value: string;
  label: string;
  icon: React.ElementType;
};

export type SubscriptionFeature = {
  text: string;
  earningCap?: number;
};

export type SubscriptionTier = {
  name: string;
  price: number;
  features: SubscriptionFeature[];
  requiredReferrals: number;
  earningCap: number;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
};

export type ReferralMilestone = {
    name: string;
    requiredReferrals: number;
    reward: number;
}
