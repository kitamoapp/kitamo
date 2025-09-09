
import type {
  Transaction,
  ReferredUser,
  SubscriptionTier,
  ReferralMilestone,
  SubscriptionFeature,
} from '@/lib/types';

export const transactions: Transaction[] = [];

export const referredUsers: ReferredUser[] = [];

export const allFeatures: SubscriptionFeature[] = [
  { text: 'Basic financial tracking tools', id: 'basic_tracking' },
  { text: 'Manual budget setup', id: 'manual_budget' },
  { text: 'AI-Powered financial insights', id: 'ai_insights' },
  { text: 'AI-Powered "Smart Budget" generation', id: 'ai_budget' },
  { text: 'Advanced analytics', id: 'advanced_analytics' },
  { text: 'Get rewards by growing the community', id: 'referral_system' },
  { text: '40% bonus on community activity', id: 'commission_40' },
  { text: '60% bonus on community activity', id: 'commission_60' },
  { text: '85% bonus on community activity', id: 'commission_85' },
  { text: 'Monthly Bonus Limit', id: 'earning_cap' },
];

export const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Free',
    price: 0,
    priceId: 'price_php_bronze_free',
    annualPriceId: 'price_php_bronze_free_annual',
    features: [
      { text: 'Basic financial tracking tools', id: 'basic_tracking' },
      { text: 'Manual budget setup', id: 'manual_budget' },
    ],
    commissionRate: 0,
    earningCap: 0,
  },
  {
    name: 'Lite',
    price: 299,
    annualPrice: 2870,
    priceId: 'price_php_silver_monthly',
    annualPriceId: 'price_php_silver_annual',
    features: [
      { text: 'Basic financial tracking tools', id: 'basic_tracking' },
      { text: 'Manual budget setup', id: 'manual_budget' },
      { text: 'AI-Powered financial insights', id: 'ai_insights' },
      { text: 'AI-Powered "Smart Budget" generation', id: 'ai_budget' },
      { text: 'Advanced analytics', id: 'advanced_analytics' },
      { text: 'Get rewards by growing the community', id: 'referral_system' },
      { text: '40% bonus on community activity', id: 'commission_40' },
      { text: 'Monthly Bonus Limit', id: 'earning_cap' },
    ],
    commissionRate: 0.40,
    earningCap: 5000,
  },
  {
    name: 'Pro',
    price: 699,
    annualPrice: 6710,
    priceId: 'price_php_gold_monthly',
    annualPriceId: 'price_php_gold_annual',
    features: [
      { text: 'Basic financial tracking tools', id: 'basic_tracking' },
      { text: 'Manual budget setup', id: 'manual_budget' },
      { text: 'AI-Powered financial insights', id: 'ai_insights' },
      { text: 'AI-Powered "Smart Budget" generation', id: 'ai_budget' },
      { text: 'Advanced analytics', id: 'advanced_analytics' },
      { text: 'Get rewards by growing the community', id: 'referral_system' },
      { text: '60% bonus on community activity', id: 'commission_60' },
      { text: 'Monthly Bonus Limit', id: 'earning_cap' },
    ],
    commissionRate: 0.60,
    earningCap: 15000,
  },
  {
    name: 'Max',
    price: 999,
    annualPrice: 9590,
    priceId: 'price_php_platinum_monthly',
    annualPriceId: 'price_php_platinum_annual',
    features: [
      { text: 'Basic financial tracking tools', id: 'basic_tracking' },
      { text: 'Manual budget setup', id: 'manual_budget' },
      { text: 'AI-Powered financial insights', id: 'ai_insights' },
      { text: 'AI-Powered "Smart Budget" generation', id: 'ai_budget' },
      { text: 'Advanced analytics', id: 'advanced_analytics' },
      { text: 'Get rewards by growing the community', id: 'referral_system' },
      { text: '85% bonus on community activity', id: 'commission_85' },
      { text: 'Monthly Bonus Limit', id: 'earning_cap' },
    ],
    commissionRate: 0.85,
    earningCap: Infinity,
  },
];


export const referralMilestones: ReferralMilestone[] = [
    { name: 'Apprentice', requiredReferrals: 5 },
    { name: 'Builder', requiredReferrals: 10 },
    { name: 'Leader', requiredReferrals: 25 },
    { name: 'Visionary', requiredReferrals: 50 },
]

    
