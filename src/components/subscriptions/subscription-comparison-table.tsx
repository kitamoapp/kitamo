
'use client';

import * as React from 'react';
import { useCurrency } from '@/context/currency-context';
import type { SubscriptionTier } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import type { BillingCycle } from '@/app/subscriptions/page';
import { subscriptionTiers, allFeatures } from '@/lib/data';
import { Card } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SubscriptionComparisonTableProps {
  onChoosePlan: (tier: SubscriptionTier) => void;
  billingCycle: BillingCycle;
}

export function SubscriptionComparisonTable({
  onChoosePlan,
  billingCycle,
}: SubscriptionComparisonTableProps) {
  const { convertAndFormatCurrency } = useCurrency();
  const { currentTier, isLoaded } = useSubscription();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isLoaded) {
    return (
      <Card>
        <div className="p-6">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-6 w-1/3" />
                <div className="flex gap-8">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Features</TableHead>
            {subscriptionTiers.map((tier) => (
              <TableHead
                key={tier.name}
                className={cn('text-center', tier.name === currentTier.name && "text-primary")}
              >
                <p className="text-lg font-semibold">{tier.name}</p>
                <div className="text-sm">
                  {tier.price > 0 ? (
                     <p className='font-normal text-muted-foreground'>
                      <span className="text-xl font-bold text-foreground">
                        {convertAndFormatCurrency(
                          billingCycle === 'annually' ? tier.annualPrice! : tier.price
                        )}
                      </span>
                      /{billingCycle === 'annually' ? 'yr' : 'mo'}
                    </p>
                  ) : (
                    <p className="text-xl font-bold">Free</p>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {allFeatures.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell className="font-medium">{feature.text}</TableCell>
              {subscriptionTiers.map((tier) => {
                const hasFeature = tier.features.some(
                  (f) => f.id === feature.id
                );
                return (
                  <TableCell key={`${tier.name}-${feature.id}`} className="text-center">
                    {hasFeature ? (
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-muted-foreground" />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          <TableRow>
            <TableCell></TableCell>
            {subscriptionTiers.map((tier) => (
              <TableCell key={`${tier.name}-footer`} className="text-center p-4">
                <Button
                  className="w-full"
                  disabled={tier.name === currentTier.name || tier.price === 0}
                  onClick={() => onChoosePlan(tier)}
                  variant={tier.name === currentTier.name ? 'outline' : 'default'}
                >
                  {tier.name === currentTier.name
                    ? 'Current Plan'
                    : 'Choose Plan'}
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}
