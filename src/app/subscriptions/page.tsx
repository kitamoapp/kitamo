
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
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SubscriptionPlanCard } from '@/components/subscriptions/subscription-plan-card';
import { PaymentMethodForm } from '@/components/payment-method-form';
import { useToast } from '@/hooks/use-toast';
import { usePaymentMethods } from '@/context/payment-method-context';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Landmark, Wallet, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/auth-context';
import { useCurrency } from '@/context/currency-context';

type DialogState = 'closed' | 'confirming' | 'addingPayment' | 'processingPayment';
export type BillingCycle = 'monthly' | 'annually';

export default function SubscriptionsPage() {
  const { setCurrentTier, getTierPrice } = useSubscription();
  const { formatCurrency } = useCurrency();
  const { regionalCurrency, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { paymentMethods, addPaymentMethod } = usePaymentMethods();
  
  const [dialogState, setDialogState] = useState<DialogState>('closed');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethodId) {
      setSelectedPaymentMethodId(paymentMethods[0].id);
    }
  }, [paymentMethods, selectedPaymentMethodId]);

  const handleChoosePlan = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    if (paymentMethods.length > 0) {
      setDialogState('confirming');
    } else {
      setDialogState('addingPayment');
    }
  };
  
  const handleDialogClose = () => {
    setDialogState('closed');
    setSelectedTier(null);
  }

  const handleInitiatePurchase = () => {
    if (selectedTier && selectedPaymentMethodId) {
        setDialogState('processingPayment');
    }
  };
  
  const handleConfirmPurchase = () => {
     if (selectedTier) {
      setCurrentTier(selectedTier);
       toast({
        title: 'Subscription Updated!',
        description: `You are now subscribed to the ${selectedTier.name} plan.`,
      });
    }
    handleDialogClose();
    setSelectedPaymentMethodId(null);
  }

  const handleAddPaymentMethod = (values: PaymentMethodValues) => {
    const newMethod = addPaymentMethod(values);
    toast({
      title: 'Payment Method Added',
      description: 'Your new payment method has been saved.',
    });
    setSelectedPaymentMethodId(newMethod.id);
    setDialogState('confirming');
  };
  
  const getPaymentMethodIcon = (type: PaymentMethod['type']) => {
      switch (type) {
          case 'Card': return <CreditCard className="h-6 w-6" />;
          case 'Bank': return <Landmark className="h-6 w-6" />;
          case 'Wallet': return <Wallet className="h-6 w-6" />;
          default: return <CreditCard className="h-6 w-6" />;
      }
  }

  if (authLoading || !regionalCurrency) {
    return (
        <AppLayout>
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        </AppLayout>
    )
  }
  
  const selectedTierPrice = selectedTier ? getTierPrice(selectedTier, regionalCurrency) : null;
  const purchaseAmount = billingCycle === 'annually' ? selectedTierPrice?.annualAmount : selectedTierPrice?.amount;
  const priceIdForCheckout = billingCycle === 'annually' ? selectedTierPrice?.annualPriceId : selectedTierPrice?.priceId;

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

      <Dialog
        open={dialogState === 'addingPayment'}
        onOpenChange={(open) => !open && handleDialogClose()}
      >
        <DialogContent>
          <PaymentMethodForm 
            onSubmit={handleAddPaymentMethod}
            onCancel={handleDialogClose}
            isSubscriptionContext={true}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialogState === 'confirming'} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Subscription</DialogTitle>
            <DialogDescription>
              You are upgrading to the{' '}
              <span className="font-bold">{selectedTier?.name} ({billingCycle})</span> plan. The selected payment method will be charged {' '}
              <span className="font-bold">{formatCurrency(purchaseAmount || 0, regionalCurrency)}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup value={selectedPaymentMethodId || ''} onValueChange={setSelectedPaymentMethodId}>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <Label 
                    key={method.id} 
                    htmlFor={method.id}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors",
                      selectedPaymentMethodId === method.id && "border-primary ring-2 ring-primary"
                    )}
                  >
                     <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                     {getPaymentMethodIcon(method.type)}
                     <div className='flex-1'>
                        {method.type === 'Card' && <p className="font-semibold">{method.brand} ending in {method.last4}</p>}
                        {method.type === 'Card' && <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>}
                        {method.type === 'Bank' && <p className="font-semibold">{method.bankName} ending in {method.last4}</p>}
                        {method.type === 'Bank' && <p className="text-sm text-muted-foreground">Bank Account</p>}
                        {method.type === 'Wallet' && <p className="font-semibold">{method.provider}</p>}
                        {method.type === 'Wallet' && <p className="text-sm text-muted-foreground">{method.email}</p>}
                     </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>
                Cancel
            </Button>
            <Button onClick={handleInitiatePurchase} disabled={!selectedPaymentMethodId}>
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
       <AlertDialog open={dialogState === 'processingPayment'} onOpenChange={(open) => !open && handleDialogClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4'>
                <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-center">Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
             This is a simulation. In a real application, you would pass the following Price ID to your payment provider to initiate the checkout: <br />
             <span className="mt-2 inline-block font-mono bg-muted p-1 rounded-md text-xs">{priceIdForCheckout || 'N/A'}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleConfirmPurchase} className="w-full">Simulate Successful Payment</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
