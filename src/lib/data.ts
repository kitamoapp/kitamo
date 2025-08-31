
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
  // L1 - Direct Referrals
  { id: '1', name: 'Alice', signupDate: new Date('2024-06-15'), status: 'Active', referredBy: 'currentUser', leg: 'left', plan: 'Gold' },
  { id: '2', name: 'Bob', signupDate: new Date('2024-06-20'), status: 'Active', referredBy: 'currentUser', leg: 'right', plan: 'Silver' },
  { id: '3', name: 'Charlie', signupDate: new Date('2024-07-01'), status: 'Active', referredBy: 'currentUser', leg: 'left', plan: 'Platinum' },
  // L2 - Referred by Alice (L)
  { id: '4', name: 'Diana', signupDate: new Date('2024-07-05'), status: 'Active', referredBy: '1', leg: 'left', plan: 'Silver' },
  { id: '5', name: 'Ethan', signupDate: new Date('2024-07-06'), status: 'Active', referredBy: '1', leg: 'right', plan: 'Gold' },
  // L2 - Referred by Bob (R)
  { id: '6', name: 'Fiona', signupDate: new Date('2024-07-08'), status: 'Active', referredBy: '2', leg: 'left', plan: 'Platinum' },
  // L3 - Referred by Diana (L)
  { id: '7', name: 'George', signupDate: new Date('2024-07-10'), status: 'Active', referredBy: '4', leg: 'right', plan: 'Gold' },
];

export const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Bronze',
    price: 0,
    features: [{ text: 'Financial tracking' }],
    borderColor: 'border-yellow-700',
    gradientFrom: 'from-yellow-100',
    gradientTo: 'to-stone-100',
    textColor: 'text-yellow-800',
    commissionRate: 0,
  },
  {
    name: 'Silver',
    price: 10,
    features: [
      { text: 'Financial tracking' },
      { text: 'Earn through referral system' },
      { text: '10% commission on matched volume' },
    ],
    borderColor: 'border-slate-400',
    gradientFrom: 'from-slate-200',
    gradientTo: 'to-white',
    textColor: 'text-slate-700',
    commissionRate: 0.1,
  },
  {
    name: 'Gold',
    price: 25,
    features: [
      { text: 'Financial tracking' },
      { text: 'Earn through referral system' },
      { text: '15% commission on matched volume' },
    ],
    borderColor: 'border-amber-500',
    gradientFrom: 'from-amber-200',
    gradientTo: 'to-yellow-100',
    textColor: 'text-amber-800',
    commissionRate: 0.15,
  },
  {
    name: 'Platinum',
    price: 40,
    features: [
      { text: 'Financial tracking' },
      { text: 'Earn through referral system' },
      { text: '20% commission on matched volume' },
    ],
    borderColor: 'border-sky-500',
    gradientFrom: 'from-sky-200',
    gradientTo: 'to-cyan-100',
    textColor: 'text-sky-800',
    commissionRate: 0.2,
  },
];
