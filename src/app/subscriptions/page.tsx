
'use client';

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
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function SubscriptionsPage() {
  const { convertAndFormatCurrency } = useCurrency();

  return (
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
                tier.name === 'Silver' && 'border-2 border-primary'
              )}
            >
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>
                  {tier.price > 0
                    ? `${convertAndFormatCurrency(
                        tier.price
                      )} / month`
                    : 'Free'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={tier.name === 'Silver'}
                >
                  {tier.name === 'Silver'
                    ? 'Current Plan'
                    : 'Choose Plan'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
