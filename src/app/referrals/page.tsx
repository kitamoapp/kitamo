
'use client';

import { AppLayout } from '@/components/app-layout';
import { CommunityCodeCard } from '@/components/community/community-code-card';
import { CommunityFaq } from '@/components/community/community-faq';
import { MilestoneProgressCard } from '@/components/community/milestone-progress-card';
import { CommunityNetworkVisualizer } from '@/components/community/community-network-visualizer';
import { HelpFriendDialog } from '@/components/community/help-friend-dialog';

export default function ReferralsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Community</h1>
            <p className="text-muted-foreground">
              Help your friends and grow the community to increase your
              earnings.
            </p>
          </div>
          <HelpFriendDialog />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <MilestoneProgressCard />
            <div className="block lg:hidden">
              <CommunityCodeCard />
            </div>
            <CommunityNetworkVisualizer />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <div className="hidden lg:block">
              <CommunityCodeCard />
            </div>
            <CommunityFaq />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
