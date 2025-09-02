
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
    date: new Date('2024-07-01').toISOString(),
    description: 'Monthly Salary',
  },
  {
    id: '2',
    type: 'expense',
    category: 'Rent',
    amount: 1500,
    date: new Date('2024-07-01').toISOString(),
    description: 'Apartment Rent',
  },
  {
    id: '3',
    type: 'expense',
    category: 'Groceries',
    amount: 350,
    date: new Date('2024-07-05').toISOString(),
    description: 'Weekly grocery shopping',
  },
  {
    id: '4',
    type: 'expense',
    category: 'Transport',
    amount: 120,
    date: new Date('2024-07-10').toISOString(),
    description: 'Gasoline for car',
  },
  {
    id: '5',
    type: 'expense',
    category: 'Entertainment',
    amount: 75,
    date: new Date('2024-07-12').toISOString(),
    description: 'Movie tickets',
  },
  {
    id: '6',
    type: 'income',
    category: 'Freelance',
    amount: 750,
    date: new Date('2024-07-15').toISOString(),
    description: 'Web design project',
  },
  {
    id: '7',
    type: 'expense',
    category: 'Utilities',
    amount: 150,
    date: new Date('2024-07-20').toISOString(),
    description: 'Electricity and Water bill',
  },
  {
    id: '8',
    type: 'expense',
    category: 'Shopping',
    amount: 200,
    date: new Date('2024-07-22').toISOString(),
    description: 'New clothes',
  },
];

export const referredUsers: ReferredUser[] = [
  // L1 - Direct Referrals
  { id: '1', name: 'Alice', signupDate: new Date('2024-06-15').toISOString(), status: 'Active', referredBy: 'currentUser', leg: 'left', plan: 'Gold' },
  { id: '2', name: 'Bob', signupDate: new Date('2024-06-20').toISOString(), status: 'Active', referredBy: 'currentUser', leg: 'right', plan: 'Silver' },
  { id: '3', name: 'Charlie', signupDate: new Date('2024-07-01').toISOString(), status: 'Active', referredBy: 'currentUser', leg: 'left', plan: 'Platinum' },
  // L2 - Referred by Alice (L)
  { id: '4', name: 'Diana', signupDate: new Date('2024-07-05').toISOString(), status: 'Active', referredBy: '1', leg: 'left', plan: 'Silver' },
  { id: '5', name: 'Ethan', signupDate: new Date('2024-07-06').toISOString(), status: 'Active', referredBy: '1', leg: 'right', plan: 'Gold' },
  // L2 - Referred by Bob (R)
  { id: '6', name: 'Fiona', signupDate: new Date('2024-07-08').toISOString(), status: 'Active', referredBy: '2', leg: 'left', plan: 'Platinum' },
  // L3 - Referred by Diana (L)
  { id: '7', name: 'George', signupDate: new Date('2024-07-10').toISOString(), status: 'Active', referredBy: '4', leg: 'right', plan: 'Gold' },
];

export const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Bronze',
    prices: [{ currency: 'PHP', amount: 0 }, { currency: 'USD', amount: 0 }],
    features: [{ text: 'Basic financial tracking tools' }],
    commissionRate: 0,
  },
  {
    name: 'Silver',
    prices: [
      { currency: 'PHP', amount: 299, annualAmount: 2870, priceId: 'price_php_silver', annualPriceId: 'price_php_silver_annual' },
      { currency: 'USD', amount: 10, annualAmount: 96, priceId: 'price_usd_silver', annualPriceId: 'price_usd_silver_annual' },
    ],
    features: [
      { text: 'All Bronze features' },
      { text: 'Earn through referral system' },
      { text: '40% commission on matched volume' },
    ],
    commissionRate: 0.40,
  },
  {
    name: 'Gold',
    prices: [
      { currency: 'PHP', amount: 699, annualAmount: 6710, priceId: 'price_php_gold', annualPriceId: 'price_php_gold_annual' },
      { currency: 'USD', amount: 25, annualAmount: 240, priceId: 'price_usd_gold', annualPriceId: 'price_usd_gold_annual' },
    ],
    features: [
      { text: 'All Silver features' },
      { text: '60% commission on matched volume' },
      { text: 'Advanced analytics' },
    ],
    commissionRate: 0.60,
  },
  {
    name: 'Platinum',
    prices: [
        { currency: 'PHP', amount: 999, annualAmount: 9590, priceId: 'price_php_platinum', annualPriceId: 'price_php_platinum_annual' },
        { currency: 'USD', amount: 40, annualAmount: 384, priceId: 'price_usd_platinum', annualPriceId: 'price_usd_platinum_annual' },
    ],
    features: [
      { text: 'All Gold features' },
      { text: '85% commission on matched volume' },
      { text: 'AI-powered financial insights' },
    ],
    commissionRate: 0.85,
  },
];

export const referralMilestones: ReferralMilestone[] = [
    { name: 'Apprentice', requiredReferrals: 5 },
    { name: 'Builder', requiredReferrals: 10 },
    { name: 'Leader', requiredReferrals: 25 },
    { name: 'Visionary', requiredReferrals: 50 },
]
