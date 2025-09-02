
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
import { Landmark, Wallet, CreditCard, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useCurrency } from '@/context/currency-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

type DialogState = 'closed' | 'confirming' | 'addingPayment' | 'processingPayment' | 'error' | 'success';
export type BillingCycle = 'monthly' | 'annually';

export default function SubscriptionsPage() {
  const { currentTier, setCurrentTier } = useSubscription();
  const { currency, formatCurrency } = useCurrency();
  const { toast } = useToast();
  const { paymentMethods, addPaymentMethod } = usePaymentMethods();
  const router = useRouter();

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
    if (tier.price > 0) {
      setSelectedTier(tier);
      setDialogState('confirming');
    }
  };
  
  const handleDialogClose = () => {
    setDialogState('closed');
    setSelectedTier(null);
    setErrorMessage('');
  }

  const handleInitiatePurchase = async () => {
    if (!selectedTier || !selectedPaymentMethodId) {
      setErrorMessage('Please select a payment method.');
      setDialogState('error');
      return;
    }
    setDialogState('processingPayment');
    
    // In a real app, this is where you would call your backend to create a
    // checkout session with a payment provider like PayMongo.
    // The priceId would be determined by the selectedTier and billingCycle.
    const priceId = billingCycle === 'annually' ? selectedTier.annualPriceId : selectedTier.priceId;
    const paymentMethod = paymentMethods.find(p => p.id === selectedPaymentMethodId);

    try {
      // This fetch is now a mock since Stripe is removed.
      const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId, paymentMethod: paymentMethod?.type }),
      });

      const session = await response.json();

      if (response.ok) {
          // In a real app, you would redirect to the session.url provided by the payment gateway
          // For this mock, we'll simulate a successful payment.
          setCurrentTier(selectedTier);
          setDialogState('success');
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
    const newMethod = addPaymentMethod(values);
    toast({
      title: 'Payment Method Added',
      description: 'Your new payment method has been saved.',
    });
    setSelectedPaymentMethodId(newMethod.id);
    setDialogState('confirming');
  };
  
  const purchaseAmount = selectedTier ? (billingCycle === 'annually' ? selectedTier.annualPrice : selectedTier.price) : 0;
  const priceId = selectedTier ? (billingCycle === 'annually' ? selectedTier.annualPriceId : selectedTier.priceId) : 'N/A';


  const getPaymentMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
        case 'Card': return <CreditCard className="h-6 w-6" />;
        case 'Bank': return <Landmark className="h-6 w-6" />;
        case 'Wallet': return <Wallet className="h-6 w-6" />;
        default: return <CreditCard className="h-6 w-6" />;
    }
}

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
              <span className="font-bold">{selectedTier?.name} ({billingCycle})</span> plan.
            </DialogDescription>
          </DialogHeader>
           
           <div className="space-y-4">
               <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Amount Due</p>
                        <p className="font-bold text-2xl">{formatCurrency(purchaseAmount || 0)}</p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                        Price ID: <span className="font-mono">{priceId}</span>
                    </div>
                </div>

                <h3 className="text-sm font-medium text-muted-foreground">Select Payment Method</h3>
                <RadioGroup value={selectedPaymentMethodId ?? ''} onValueChange={setSelectedPaymentMethodId} className="space-y-2">
                    {paymentMethods.map(method => (
                        <Label key={method.id} htmlFor={method.id} className={cn("flex items-center gap-4 rounded-lg border p-4 cursor-pointer hover:bg-muted/50", selectedPaymentMethodId === method.id && "border-primary ring-2 ring-primary")}>
                             <RadioGroupItem value={method.id} id={method.id} className="sr-only"/>
                             {getPaymentMethodIcon(method.type)}
                            <div className="flex-1">
                                {method.type === 'Card' && <p className="font-semibold">{method.brand} ending in {method.last4}</p>}
                                {method.type === 'Card' && <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>}
                                {method.type === 'Bank' && <p className="font-semibold">{method.bankName} ending in {method.last4s}</p>}
                                {method.type === 'Bank' && <p className="text-sm text-muted-foreground">Bank Account</p>}
                                {method.type === 'Wallet' && <p className="font-semibold">{method.provider}</p>}
                                {method.type === 'Wallet' && <p className="text-sm text-muted-foreground">{method.email}</p>}
                            </div>
                        </Label>
                    ))}
                </RadioGroup>
                <Button variant="outline" className="w-full" onClick={() => setDialogState('addingPayment')}>
                    Add New Payment Method
                </Button>
            </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose} disabled={dialogState === 'processingPayment'}>
                Cancel
            </Button>
            <Button onClick={handleInitiatePurchase} disabled={dialogState === 'processingPayment' || !selectedPaymentMethodId}>
              {dialogState === 'processingPayment' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogState === 'addingPayment'} onOpenChange={(open) => !open && setDialogState('confirming')}>
          <DialogContent>
              <PaymentMethodForm 
                onSubmit={handleAddPaymentMethod}
                onCancel={() => setDialogState('confirming')}
                isSubscriptionContext={true}
              />
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

      <Dialog open={dialogState === 'success'} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent>
          <DialogHeader>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-center text-2xl">Upgrade Successful!</DialogTitle>
            <DialogDescription className="text-center">
                You are now subscribed to the <span className="font-bold">{selectedTier?.name}</span> plan. Welcome aboard!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="w-full" onClick={() => { handleDialogClose(); router.push('/dashboard'); }}>
                Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
