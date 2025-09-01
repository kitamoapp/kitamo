
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
import type { SubscriptionFeature, SubscriptionTier } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface SubscriptionPlanCardProps {
  tier: SubscriptionTier;
  onChoosePlan: (tier: SubscriptionTier) => void;
}

export function SubscriptionPlanCard({
  tier,
  onChoosePlan,
}: SubscriptionPlanCardProps) {
  const { convertAndFormatCurrency } = useCurrency();
  const { currentTier, isLoaded } = useSubscription();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const renderFeature = (feature: SubscriptionFeature) => {
    let text = feature.text;
    
    if (text.includes('{commissionRate}')) {
        text = text.replace('{commissionRate}', (tier.commissionRate * 100).toString());
    }
    
    if (feature.earningCap && text.includes('{cap}')) {
      const capText =
        feature.earningCap === Infinity
          ? 'Unlimited'
          : convertAndFormatCurrency(feature.earningCap);
      text = text.replace('{cap}', capText);
    }
    return text;
  };
  
  if (!isClient || !isLoaded) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <Skeleton className="h-7 w-1/2" />
                <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-2">
                           <Skeleton className="h-4 w-4 rounded-full mt-1" />
                           <Skeleton className="h-5 w-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
  }

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
          {tier.price > 0 ? (
            `${convertAndFormatCurrency(tier.price)} / month`
          ) : (
            'Free'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm flex-1">{renderFeature(feature)}</span>
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
