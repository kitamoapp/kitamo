
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SubscriptionComparisonTable } from '@/components/subscriptions/subscription-comparison-table';

export type BillingCycle = 'monthly' | 'annually';

export default function SubscriptionsPage() {
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>('monthly');

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Subscription Plans
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Choose the plan that fits your needs and start earning rewards
            for helping the community grow.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <Label htmlFor="billing-cycle-switch">Monthly</Label>
          <Switch
            id="billing-cycle-switch"
            checked={billingCycle === 'annually'}
            onCheckedChange={(checked) =>
              setBillingCycle(checked ? 'annually' : 'monthly')
            }
          />
          <Label htmlFor="billing-cycle-switch">Annually</Label>
          <div className="ml-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
            Save 20%
          </div>
        </div>

        <SubscriptionComparisonTable billingCycle={billingCycle} />
      </div>
    </AppLayout>
  );
}
