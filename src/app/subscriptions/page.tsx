
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCurrency } from '@/context/currency-context';
import { subscriptionTiers } from '@/lib/data';
import type { SubscriptionTier } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function SubscriptionsPage() {
  const { convertAndFormatCurrency } = useCurrency();
  const { currentTier, setCurrentTier } = useSubscription();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(
    null
  );
  // Simulate if the user has a payment method. Default to false for demo.
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);


  const handleChoosePlan = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    if (hasPaymentMethod) {
      setShowConfirmation(true);
    } else {
      setShowAddPaymentDialog(true);
    }
  };

  const handleConfirmPurchase = () => {
    if (selectedTier) {
      setCurrentTier(selectedTier);
    }
    setShowConfirmation(false);
    setSelectedTier(null);
  };
  
  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd save the payment info to a secure service.
    // For this demo, we'll just simulate it.
    setHasPaymentMethod(true);
    setShowAddPaymentDialog(false);
    // After adding a payment method, show the confirmation dialog.
    setShowConfirmation(true);
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
              <Card
                key={tier.name}
                className={cn(
                  'flex flex-col',
                  tier.name === currentTier.name && 'border-2 border-primary'
                )}
              >
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>
                    {tier.price > 0
                      ? `${convertAndFormatCurrency(tier.price)} / month`
                      : 'Free'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1" />
                        <span className="text-sm flex-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={tier.name === currentTier.name}
                    onClick={() => handleChoosePlan(tier)}
                  >
                    {tier.name === currentTier.name
                      ? 'Current Plan'
                      : 'Choose Plan'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
      
      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
                You don't have a payment method on file. Please add one to continue. This is a simulation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPaymentMethod} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor='card-number'>Card Number</Label>
                <Input id='card-number' placeholder='1234 5678 9101 1121' />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor='expiry'>Expiration</Label>
                    <Input id='expiry' placeholder='MM / YY' />
                </div>
                <div className="space-y-2">
                    <Label htmlFor='cvc'>CVC</Label>
                    <Input id='cvc' placeholder='123' />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type='button' variant='outline'>Cancel</Button>
                </DialogClose>
                <Button type='submit'>Save and Continue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Your saved payment method will be charged. Please confirm to upgrade your plan to{' '}
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
