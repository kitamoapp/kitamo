
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/currency-context';
import type { SubscriptionTier } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check, X, Loader2, CheckCircle, Minus } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { PurchasesStoreProduct } from '@revenuecat/purchases-js';

interface SubscriptionComparisonTableProps {
  billingCycle: BillingCycle;
}

export function SubscriptionComparisonTable({
  billingCycle,
}: SubscriptionComparisonTableProps) {
  const { convertAndFormatCurrency, formatCurrency } = useCurrency();
  const { currentTier, offerings, purchasePackage, isLoaded, isPurchasing } = useSubscription();
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleChoosePlan = async (tier: SubscriptionTier) => {
    if (!offerings) return;
  
    const pkg = (billingCycle === 'monthly'
      ? offerings.monthly
      : offerings.annual
    )?.find(p => {
      const tierForProduct = subscriptionTiers.find(t => t.priceId === p.identifier || t.annualPriceId === p.identifier);
      return tierForProduct?.name === tier.name;
    });

    if (pkg) {
      await purchasePackage(pkg);
      // Check if the purchase was successful (tier might have changed)
      // The dialog will now be controlled by the `isPurchasing` state
      if (!isPurchasing) {
         setShowSuccessDialog(true);
      }
    } else {
        toast({
            title: "Plan not available",
            description: "This plan is not available for purchase at the moment.",
            variant: "destructive"
        })
    }
  };

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

  // Get packages for the selected billing cycle
  const packages = billingCycle === 'annually' ? offerings?.annual : offerings?.monthly;

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
                    disabled={tier.name === currentTier.name || isPurchasing}
                    onClick={() => handleChoosePlan(tier)}
                    variant={tier.name === currentTier.name ? 'outline' : 'default'}
                  >
                    {isPurchasing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
              You are now subscribed to the{' '}
              <span className="font-bold">{currentTier?.name}</span> plan.
              Welcome aboard!
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
