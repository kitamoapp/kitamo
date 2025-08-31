
import { AppLayout } from '@/components/app-layout';
import { ReferralCodeCard } from '@/components/referrals/referral-code-card';
import { ReferralFaq } from '@/components/referrals/referral-faq';
import { ReferredUsersTable } from '@/components/referrals/referred-users-table';
import { SubscriptionTierCard } from '@/components/referrals/subscription-tier-card';
import { ReferralNetworkVisualizer } from '@/components/referrals/referral-network-visualizer';

export default function ReferralsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
          <p className="text-muted-foreground">
            Share your code, track your referrals, and increase your earnings.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <SubscriptionTierCard />
            <ReferralNetworkVisualizer />
            <ReferredUsersTable />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <ReferralCodeCard />
            <ReferralFaq />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
