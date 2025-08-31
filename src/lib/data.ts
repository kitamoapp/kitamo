
import type {
  Transaction,
  ReferredUser,
  SubscriptionTier,
  ReferralMilestone,
} from '@/lib/types';

export const transactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'Salary',
    amount: 5000,
    date: new Date('2024-07-01'),
    description: 'Monthly Salary',
  },
  {
    id: '2',
    type: 'expense',
    category: 'Rent',
    amount: 1500,
    date: new Date('2024-07-01'),
    description: 'Apartment Rent',
  },
  {
    id: '3',
    type: 'expense',
    category: 'Groceries',
    amount: 350,
    date: new Date('2024-07-05'),
    description: 'Weekly grocery shopping',
  },
  {
    id: '4',
    type: 'expense',
    category: 'Transport',
    amount: 120,
    date: new Date('2024-07-10'),
    description: 'Gasoline for car',
  },
  {
    id: '5',
    type: 'expense',
    category: 'Entertainment',
    amount: 75,
    date: new Date('2024-07-12'),
    description: 'Movie tickets',
  },
  {
    id: '6',
    type: 'income',
    category: 'Freelance',
    amount: 750,
    date: new Date('2024-07-15'),
    description: 'Web design project',
  },
  {
    id: '7',
    type: 'expense',
    category: 'Utilities',
    amount: 150,
    date: new Date('2024-07-20'),
    description: 'Electricity and Water bill',
  },
  {
    id: '8',
    type: 'expense',
    category: 'Shopping',
    amount: 200,
    date: new Date('2024-07-22'),
    description: 'New clothes',
  },
];

export const referredUsers: ReferredUser[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    signupDate: new Date('2024-06-15'),
    status: 'Active',
  },
  {
    id: '2',
    name: 'Bob Williams',
    email: 'bob@example.com',
    signupDate: new Date('2024-06-20'),
    status: 'Active',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    signupDate: new Date('2024-07-01'),
    status: 'Pending',
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    signupDate: new Date('2024-07-05'),
    status: 'Active',
  },
  {
    id: '5',
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    signupDate: new Date('2024-07-06'),
    status: 'Active',
  },
  {
    id: '6',
    name: 'Fiona Glenanne',
    email: 'fiona@example.com',
    signupDate: new Date('2024-07-08'),
    status: 'Pending',
  },
];

export const REFERRAL_BONUS = 10;

export const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Bronze',
    price: 0,
    features: [
      'Basic financial tracking',
      'Standard referral bonus',
      'Limited earning potential',
    ],
    requiredReferrals: 0,
    earningCap: 100,
    borderColor: 'border-yellow-700',
    gradientFrom: 'from-yellow-100',
    gradientTo: 'to-stone-100',
    textColor: 'text-yellow-800',
  },
  {
    name: 'Silver',
    price: 10,
    features: [
      'All Bronze features',
      'Increased earning cap',
      'Priority support',
      'Advanced analytics',
    ],
    requiredReferrals: 5,
    earningCap: 500,
    borderColor: 'border-slate-400',
    gradientFrom: 'from-slate-200',
    gradientTo: 'to-white',
    textColor: 'text-slate-700',
  },
  {
    name: 'Gold',
    price: 20,
    features: [
      'All Silver features',
      'Highest earning cap',
      'Dedicated account manager',
      'Early access to new features',
    ],
    requiredReferrals: 20,
    earningCap: 2500,
    borderColor: 'border-amber-500',
    gradientFrom: 'from-amber-200',
    gradientTo: 'to-yellow-100',
    textColor: 'text-amber-800',
  },
  {
    name: 'Platinum',
    price: 50,
    features: [
      'All Gold features',
      'Unlimited earning potential',
      'Customizable rewards',
      'Exclusive partner offers',
    ],
    requiredReferrals: 50,
    earningCap: 10000,
    borderColor: 'border-sky-500',
    gradientFrom: 'from-sky-200',
    gradientTo: 'to-cyan-100',
    textColor: 'text-sky-800',
  },
];

export const referralMilestones: ReferralMilestone[] = [
  {
    name: 'First Referral!',
    requiredReferrals: 1,
    reward: 5,
  },
  {
    name: 'Referral Pro',
    requiredReferrals: 5,
    reward: 25,
  },
  {
    name: 'Super Referrer',
    requiredReferrals: 10,
    reward: 75,
  },
  {
    name: 'Referral Machine',
    requiredReferrals: 25,
    reward: 200,
  },
  {
    name: 'Referral King',
    requiredReferrals: 50,
    reward: 500,
  },
];
