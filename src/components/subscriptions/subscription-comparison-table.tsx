
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/currency-context';
import type { SubscriptionTier } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check, X, Loader2, CheckCircle, Minus } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionComparisonTableProps {
  billingCycle: BillingCycle;
}

export function SubscriptionComparisonTable({
  billingCycle,
}: SubscriptionComparisonTableProps) {
  const { convertAndFormatCurrency, formatCurrency } = useCurrency();
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [isPurchasing, setIsPurchasing] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleChoosePlan = async (tier: SubscriptionTier) => {
    setIsPurchasing(true);
    // Mock purchase
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPurchasing(false);
    setShowSuccessDialog(true);
  };

  if (!isClient) {
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

  const currentTierName = "Free";

  return (
    <>
      <Card>
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Features</TableHead>
              {subscriptionTiers.map((tier) => (
                <TableHead
                  key={tier.name}
                  className={cn('text-center', tier.name === currentTierName && "text-primary")}
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

                  if (feature.id === 'earning_cap') {
                    return (
                        <TableCell key={`${tier.name}-${feature.id}`} className="text-center font-semibold">
                            {tier.earningCap === 0 && <Minus className="mx-auto h-5 w-5 text-muted-foreground" />}
                            {tier.earningCap > 0 && tier.earningCap !== Infinity && formatCurrency(tier.earningCap)}
                            {tier.earningCap === Infinity && "Unlimited"}
                        </TableCell>
                    )
                  }

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
                    disabled={tier.name === currentTierName || isPurchasing}
                    onClick={() => handleChoosePlan(tier)}
                    variant={tier.name === currentTierName ? 'outline' : 'default'}
                  >
                    {isPurchasing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {tier.name === currentTierName
                      ? 'Current Plan'
                      : 'Choose Plan'}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      
      <Dialog
        open={showSuccessDialog}
        onOpenChange={(open) => !open && setShowSuccessDialog(false)}
      >
        <DialogContent>
          <DialogHeader>
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <DialogTitle className="text-center text-2xl">
              Upgrade Successful!
            </DialogTitle>
            <DialogDescription className="text-center">
              You are now subscribed to a new plan. Welcome aboard!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => {
                setShowSuccessDialog(false);
                router.push('/dashboard');
              }}
            >
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
