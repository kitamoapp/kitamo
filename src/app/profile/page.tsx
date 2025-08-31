
'use client';

import { AppLayout } from '@/components/app-layout';
import { ProfileHeaderCard } from '@/components/profile/ProfileHeaderCard';
import { AccountInfoCard } from '@/components/profile/AccountInfoCard';
import { PaymentMethodsCard } from '@/components/profile/PaymentMethodsCard';
import { ReferralCodeInputCard } from '@/components/profile/ReferralCodeInputCard';
import { ChangePasswordCard } from '@/components/profile/ChangePasswordCard';

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your account details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <ProfileHeaderCard 
              fullName="User"
              email="user@example.com"
            />
          </div>
          <div className="md:col-span-2 space-y-8">
            <AccountInfoCard />
            <PaymentMethodsCard />
            <ReferralCodeInputCard />
            <ChangePasswordCard />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
