
'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { subscriptionTiers } from '@/lib/data';
import type { PaymentMethod, PaymentMethodValues, SubscriptionTier } from '@/lib/types';
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
import { PaymentMethodForm } from '@/components/payment-method-form';
import { useToast } from '@/hooks/use-toast';
import { usePaymentMethods } from '@/context/payment-method-context';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Landmark, Wallet, CreditCard, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useCurrency } from '@/context/currency-context';
import { useStripe } from '@stripe/react-stripe-js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type DialogState = 'closed' | 'confirming' | 'addingPayment' | 'processingPayment' | 'error';
export type BillingCycle = 'monthly' | 'annually';

export default function SubscriptionsPage() {
  const { currentTier, setCurrentTier } = useSubscription();
  const { currency, formatCurrency } = useCurrency();
  const { toast } = useToast();
  const { paymentMethods, addPaymentMethod } = usePaymentMethods();
  const stripe = useStripe();
  
  const [dialogState, setDialogState] = useState<DialogState>('closed');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethodId) {
      setSelectedPaymentMethodId(paymentMethods[0].id);
    }
  }, [paymentMethods, selectedPaymentMethodId]);

  const handleChoosePlan = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    // Directly go to confirmation, Stripe handles payment methods.
    setDialogState('confirming');
  };
  
  const handleDialogClose = () => {
    setDialogState('closed');
    setSelectedTier(null);
    setErrorMessage('');
  }

  const handleInitiatePurchase = async () => {
    if (!selectedTier || !stripe) {
      setErrorMessage('Stripe is not ready. Please refresh the page.');
      setDialogState('error');
      return;
    }
    setDialogState('processingPayment');
    
    const priceId = billingCycle === 'annually' ? selectedTier.annualPriceId : selectedTier.priceId;

    try {
      const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priceId }),
      });

      const session = await response.json();

      if (response.ok) {
          const result = await stripe.redirectToCheckout({ sessionId: session.id });
          if (result.error) {
              setErrorMessage(result.error.message || 'An unknown error occurred.');
              setDialogState('error');
          }
      } else {
          setErrorMessage(session.error || 'Failed to create checkout session.');
          setDialogState('error');
      }
    } catch (err: any) {
        setErrorMessage(err.message || 'An unexpected error occurred.');
        setDialogState('error');
    }
  };

  const handleAddPaymentMethod = (values: PaymentMethodValues) => {
    addPaymentMethod(values);
    toast({
      title: 'Payment Method Added',
      description: 'Your new payment method has been saved.',
    });
    setDialogState('confirming');
  };
  
  const purchaseAmount = selectedTier ? (billingCycle === 'annually' ? selectedTier.annualPrice : selectedTier.price) : 0;

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
                onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
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
      
      <Dialog open={dialogState === 'confirming' || dialogState === 'processingPayment'} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Subscription</DialogTitle>
            <DialogDescription>
              You are upgrading to the{' '}
              <span className="font-bold">{selectedTier?.name} ({billingCycle})</span> plan for{' '}
              <span className="font-bold">{formatCurrency(purchaseAmount || 0)}</span>.
              You will be redirected to Stripe to complete your purchase securely.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose} disabled={dialogState === 'processingPayment'}>
                Cancel
            </Button>
            <Button onClick={handleInitiatePurchase} disabled={dialogState === 'processingPayment'}>
              {dialogState === 'processingPayment' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed to Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={dialogState === 'error'} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent>
          <DialogHeader>
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
            <DialogTitle className="text-center">Payment Error</DialogTitle>
            <DialogDescription className="text-center">
             An error occurred during the checkout process.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>
                Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
