
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCurrency } from '@/context/currency-context';
import type { SubscriptionTier } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { Button } from '../ui/button';

interface SubscriptionPlanCardProps {
  tier: SubscriptionTier;
  onChoosePlan: (tier: SubscriptionTier) => void;
}

export function SubscriptionPlanCard({
  tier,
  onChoosePlan,
}: SubscriptionPlanCardProps) {
  const { convertAndFormatCurrency } = useCurrency();
  const { currentTier } = useSubscription();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
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
          {isClient ? (
            tier.price > 0 ? (
              `${convertAndFormatCurrency(tier.price)} / month`
            ) : (
              'Free'
            )
          ) : (
            <>&nbsp;</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
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
          onClick={() => onChoosePlan(tier)}
        >
          {tier.name === currentTier.name ? 'Current Plan' : 'Choose Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}
