
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { subscriptionTiers } from '@/lib/data';
import type { PaymentMethod, PaymentMethodValues, SubscriptionTier } from '@/lib/types';
import { useSubscription } from '@/hooks/use-subscription';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SubscriptionPlanCard } from '@/components/subscriptions/subscription-plan-card';
import { PaymentMethodForm } from '@/components/payment-method-form';
import { useToast } from '@/hooks/use-toast';
import { usePaymentMethods } from '@/context/payment-method-context';

export default function SubscriptionsPage() {
  const { setCurrentTier } = useSubscription();
  const { toast } = useToast();
  const { paymentMethods, addPaymentMethod } = usePaymentMethods();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(
    null
  );

  const handleChoosePlan = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    if (paymentMethods.length > 0) {
      setShowConfirmation(true);
    } else {
      setShowAddPaymentDialog(true);
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
    setShowConfirmation(false);
    setSelectedTier(null);
  };

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

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Your saved payment method will be charged. Please confirm to
              upgrade your plan to{' '}
              <span className="font-bold">{selectedTier?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedTier(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPurchase}>
              Confirm Purchase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
