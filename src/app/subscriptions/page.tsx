
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
import { Landmark, Wallet, CreditCard, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';

export default function SubscriptionsPage() {
  const { setCurrentTier } = useSubscription();
  const { toast } = useToast();
  const { paymentMethods, addPaymentMethod } = usePaymentMethods();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(
    null
  );
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);

  useEffect(() => {
    if (paymentMethods.length > 0) {
      setSelectedPaymentMethodId(paymentMethods[0].id);
    }
  }, [paymentMethods]);


  const handleChoosePlan = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    if (paymentMethods.length > 0) {
      setSelectedPaymentMethodId(paymentMethods[0].id); // Pre-select first payment method
      setShowConfirmation(true);
    } else {
      setShowAddPaymentDialog(true);
    }
  };

  const handleInitiatePurchase = () => {
    if (selectedTier && selectedPaymentMethodId) {
        setShowConfirmation(false);
        setShowPaymentProcessing(true);
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
    setShowPaymentProcessing(false);
    setSelectedTier(null);
    setSelectedPaymentMethodId(null);
  }

  const handleAddPaymentMethod = (values: PaymentMethodValues) => {
    addPaymentMethod(values);
    toast({
      title: 'Payment Method Added',
      description: 'Your new payment method has been saved.',
    });
    setShowAddPaymentDialog(false);
    // After adding a payment method, show the confirmation dialog.
    setShowConfirmation(true);
  };
  
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

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {subscriptionTiers.map((tier) => (
              <SubscriptionPlanCard 
                key={tier.name}
                tier={tier}
                onChoosePlan={handleChoosePlan}
              />
            ))}
          </div>
        </div>
      </AppLayout>

      <Dialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
      >
        <DialogContent>
          <PaymentMethodForm 
            onSubmit={handleAddPaymentMethod}
            onCancel={() => setShowAddPaymentDialog(false)}
            isSubscriptionContext={true}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Subscription</DialogTitle>
            <DialogDescription>
              Select a payment method to upgrade your plan to{' '}
              <span className="font-bold">{selectedTier?.name}</span>. The selected method will be charged.
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
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setSelectedTier(null)}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleInitiatePurchase} disabled={!selectedPaymentMethodId}>
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
       <AlertDialog open={showPaymentProcessing} onOpenChange={setShowPaymentProcessing}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4'>
                <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-center">Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You are being redirected to our secure payment partner to complete your purchase. This is a simulation.
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
