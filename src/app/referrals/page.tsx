
'use client';

import { AppLayout } from '@/components/app-layout';
import { ReferralCodeCard } from '@/components/referrals/referral-code-card';
import { ReferralFaq } from '@/components/referrals/referral-faq';
import { MilestoneProgressCard } from '@/components/referrals/milestone-progress-card';
import { ReferralNetworkVisualizer } from '@/components/referrals/referral-network-visualizer';
import { RecruitUserDialog } from '@/components/referrals/recruit-user-dialog';

export default function ReferralsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
            <p className="text-muted-foreground">
              Share your code, track your referrals, and increase your
              earnings.
            </p>
          </div>
          <RecruitUserDialog />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <MilestoneProgressCard />
            <div className="block lg:hidden">
              <ReferralCodeCard />
            </div>
            <ReferralNetworkVisualizer />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <div className="hidden lg:block">
              <ReferralCodeCard />
            </div>
            <ReferralFaq />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
