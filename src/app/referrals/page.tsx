import { AppLayout } from '@/components/app-layout';
import { ReferralCodeCard } from '@/components/referrals/referral-code-card';
import { ReferredUsersTable } from '@/components/referrals/referred-users-table';

export default function ReferralsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
            <p className="text-muted-foreground">Share your code and track your referrals.</p>
        </div>
        <ReferralCodeCard />
        <ReferredUsersTable />
      </div>
    </AppLayout>
  );
}
