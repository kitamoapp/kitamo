
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string; // Changed to string to be serializable
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

export type SubscriptionTier = {
  name: string;
  price: number;
  features: string[];
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
