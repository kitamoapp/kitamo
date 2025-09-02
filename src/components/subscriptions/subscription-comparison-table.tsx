
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

type DialogState = 'closed' | 'confirming' | 'success';

interface SubscriptionComparisonTableProps {
  billingCycle: BillingCycle;
}

export function SubscriptionComparisonTable({
  billingCycle,
}: SubscriptionComparisonTableProps) {
  const { convertAndFormatCurrency, formatCurrency } = useCurrency();
  const { currentTier, setCurrentTier, isLoaded } = useSubscription();
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = React.useState(false);

  const [dialogState, setDialogState] = React.useState<DialogState>('closed');
  const [selectedTier, setSelectedTier] = React.useState<SubscriptionTier | null>(
    null
  );
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleChoosePlan = (tier: SubscriptionTier) => {
    if (tier.price > 0) {
      setSelectedTier(tier);
      setDialogState('confirming');
    }
  };
  
  const handleDialogClose = () => {
    if (isProcessing) return;
    setDialogState('closed');
    setSelectedTier(null);
  };
  
  const handleConfirmPurchase = async () => {
    if (!selectedTier) return;
    setIsProcessing(true);

    const priceId =
      billingCycle === 'annually'
        ? selectedTier.annualPriceId
        : selectedTier.priceId;

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session.');
      }
      
      setCurrentTier(selectedTier);
      setDialogState('success');
      
    } catch (error) {
      toast({
        title: 'Payment Error',
        description:
          'Could not start the payment process. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const purchaseAmount = selectedTier
    ? billingCycle === 'annually'
      ? selectedTier.annualPrice
      : selectedTier.price
    : 0;


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
                    disabled={tier.name === currentTier.name}
                    onClick={() => handleChoosePlan(tier)}
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
      
      <Dialog
        open={dialogState === 'confirming'}
        onOpenChange={(open) => !open && handleDialogClose()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Plan</DialogTitle>
            <DialogDescription>
              You are about to purchase the{' '}
              <span className="font-bold">
                {selectedTier?.name} ({billingCycle})
              </span>{' '}
              plan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-center">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-muted-foreground">Amount Due</p>
              <p className="font-bold text-3xl">
                {formatCurrency(purchaseAmount || 0)}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Your default payment method will be charged.
            </p>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={handleDialogClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmPurchase} disabled={isProcessing}>
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm and Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog
        open={dialogState === 'success'}
        onOpenChange={(open) => !open && handleDialogClose()}
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
                handleDialogClose();
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
