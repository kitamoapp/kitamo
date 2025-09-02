
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';
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
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const handleChoosePlan = (tier: SubscriptionTier) => {
    if (tier.price > 0) {
      setSelectedTier(tier);
      setDialogState('confirming');
    }
  };
  
  const handleDialogClose = () => {
    setDialogState('closed');
    setSelectedTier(null);
  }

  const handleManualPurchase = () => {
    if (!selectedTier) return;
    
    // In this manual flow, we trust the user has paid and upgrade them.
    setCurrentTier(selectedTier);
    setDialogState('success');
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
      
      <Dialog open={dialogState === 'confirming'} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Payment</DialogTitle>
             <DialogDescription>
              You are upgrading to the{' '}
              <span className="font-bold">{selectedTier?.name} ({billingCycle})</span> plan.
            </DialogDescription>
          </DialogHeader>
           
           <div className="space-y-4 text-center">
               <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-muted-foreground">Amount Due</p>
                    <p className="font-bold text-3xl">{formatCurrency(purchaseAmount || 0)}</p>
                </div>

                <p className="text-sm text-muted-foreground">
                    Scan the QR code below using GCash or PayMaya to pay.
                </p>

                <div className="flex justify-center">
                  {/* 
                    IMPORTANT: Replace this placeholder QR code with your actual QR code image.
                    1. Save your GCash/PayMaya QR code image in the `public` folder.
                    2. Update the `src` property below to point to your image file (e.g., /my-gchash-qr.png).
                  */}
                  <Image 
                    src="/placeholder-qr.png" 
                    alt="Payment QR Code"
                    width={250}
                    height={250}
                    className='rounded-lg'
                    data-ai-hint="qr code"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                    After paying, click "Confirm Payment" below to activate your subscription. Your account will be upgraded manually upon verification.
                </p>
            </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleDialogClose}>
                Cancel
            </Button>
            <Button onClick={handleManualPurchase}>
              Confirm Payment
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
