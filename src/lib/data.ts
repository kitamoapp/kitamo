
import type {
  Transaction,
  ReferredUser,
  SubscriptionTier,
  ReferralMilestone,
} from '@/lib/types';

export const transactions: Omit<Transaction, 'date'> & { date: Date }[] = [
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
  // Direct Referrals (Tier 1)
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    signupDate: new Date('2024-06-15'),
    status: 'Active',
    referredBy: 'currentUser', // Main user
    earnings: 100, // e.g., from subscription
  },
  {
    id: '2',
    name: 'Bob Williams',
    email: 'bob@example.com',
    signupDate: new Date('2024-06-20'),
    status: 'Active',
    referredBy: 'currentUser',
    earnings: 150,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    signupDate: new Date('2024-07-01'),
    status: 'Pending',
    referredBy: 'currentUser',
    earnings: 0,
  },
  // Indirect Referrals (Tier 2) - Referred by Alice
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    signupDate: new Date('2024-07-05'),
    status: 'Active',
    referredBy: '1', // Referred by Alice
    earnings: 80,
  },
  // Indirect Referrals (Tier 2) - Referred by Bob
  {
    id: '5',
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    signupDate: new Date('2024-07-06'),
    status: 'Active',
    referredBy: '2', // Referred by Bob
    earnings: 120,
  },
  {
    id: '6',
    name: 'Fiona Glenanne',
    email: 'fiona@example.com',
    signupDate: new Date('2024-07-08'),
    status: 'Pending',
    referredBy: '2', // Referred by Bob
    earnings: 0,
  },
];

export const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Bronze',
    price: 0,
    features: [{ text: 'Financial tracking' }],
    requiredReferrals: 0,
    earningCap: 0,
    borderColor: 'border-yellow-700',
    gradientFrom: 'from-yellow-100',
    gradientTo: 'to-stone-100',
    textColor: 'text-yellow-800',
    directReferralPercent: 0,
    indirectReferralPercent: 0,
  },
  {
    name: 'Silver',
    price: 10,
    features: [
      { text: 'Financial tracking' },
      { text: 'Earning cap of {cap}', earningCap: 100 },
      { text: '15% from direct referrals' },
      { text: '5% from indirect referrals' },
    ],
    requiredReferrals: 0,
    earningCap: 100,
    borderColor: 'border-slate-400',
    gradientFrom: 'from-slate-200',
    gradientTo: 'to-white',
    textColor: 'text-slate-700',
    directReferralPercent: 0.15,
    indirectReferralPercent: 0.05,
  },
  {
    name: 'Gold',
    price: 20,
    features: [
      { text: 'Financial tracking' },
      { text: 'Earning cap of {cap}', earningCap: 500 },
      { text: '25% from direct referrals' },
      { text: '15% from indirect referrals' },
    ],
    requiredReferrals: 0,
    earningCap: 500,
    borderColor: 'border-amber-500',
    gradientFrom: 'from-amber-200',
    gradientTo: 'to-yellow-100',
    textColor: 'text-amber-800',
    directReferralPercent: 0.25,
    indirectReferralPercent: 0.15,
  },
  {
    name: 'Platinum',
    price: 50,
    features: [
      { text: 'Financial tracking' },
      { text: 'Unlimited Earning Potential', earningCap: Infinity },
      { text: '35% from direct referrals' },
      { text: '25% from indirect referrals' },
    ],
    requiredReferrals: 0,
    earningCap: Infinity,
    borderColor: 'border-sky-500',
    gradientFrom: 'from-sky-200',
    gradientTo: 'to-cyan-100',
    textColor: 'text-sky-800',
    directReferralPercent: 0.35,
    indirectReferralPercent: 0.25,
  },
];

export const referralMilestones: ReferralMilestone[] = [
  {
    name: 'Unlock Silver Tier',
    requiredReferrals: 5,
  },
  {
    name: 'Unlock Gold Tier',
    requiredReferrals: 20,
  },
  {
    name: 'Unlock Platinum Tier',
    requiredReferrals: 50,
  },
];
