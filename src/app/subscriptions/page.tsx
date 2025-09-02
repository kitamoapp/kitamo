
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { subscriptionTiers } from '@/lib/data';
import type { SubscriptionTier } from '@/lib/types';
import { useSubscription } from '@/hooks/use-subscription';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SubscriptionPlanCard } from '@/components/subscriptions/subscription-plan-card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCurrency } from '@/context/currency-context';
import { useRouter } from 'next/navigation';

type DialogState = 'closed' | 'confirming' | 'success';
export type BillingCycle = 'monthly' | 'annually';

export default function SubscriptionsPage() {
  const { currentTier, setCurrentTier } = useSubscription();
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const router = useRouter();

  const [dialogState, setDialogState] = useState<DialogState>('closed');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(
    null
  );
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

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

      const { url, id: sessionId } = await response.json();

      // In a real integration, you would redirect to the PayMongo/Stripe URL.
      // For this demo, we simulate a successful redirect.
      console.log(`Redirecting to checkout session: ${sessionId}`);
      
      // Update local state and show success dialog
      setCurrentTier(selectedTier);
      setDialogState('success');
      
      // To test the real redirect:
      // window.location.href = url;
      
      // For demo purposes, we redirect to dashboard
      router.push(url);


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

  return (
    <>
      <AppLayout>
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Subscription Plans
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Choose the plan that fits your needs and start maximizing your
              referral earnings.
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

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {subscriptionTiers.map((tier) => (
              <SubscriptionPlanCard
                key={tier.name}
                tier={tier}
                onChoosePlan={handleChoosePlan}
                billingCycle={billingCycle}
              />
            ))}
          </div>
        </div>
      </AppLayout>

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
              You will be redirected to our secure payment partner to complete
              your purchase.
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
