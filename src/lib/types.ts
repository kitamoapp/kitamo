
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
};

export type ReferredUser = {
  id: string;
  name: string;
  signupDate: Date;
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
};

export type SubscriptionTier = {
  name: string;
  price: number;
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
