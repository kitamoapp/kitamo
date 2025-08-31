
'use client';

import { Award, Star, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useCurrency } from '@/context/currency-context';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';
import { useSubscription } from '@/context/subscription-context';

export function MilestoneProgressCard() {
  const { convertAndFormatCurrency } = useCurrency();
  const {
    currentTier,
    totalEarnings,
    nextTier,
  } = useSubscription();
  const router = useRouter();

  const isBronze = currentTier.name === 'Bronze';
  
  // For demonstration, let's assume a static goal for the next tier
  const goal = nextTier ? 10000 : totalEarnings; 
  const progress = nextTier ? (totalEarnings / goal) * 100 : 100;

  return (
    <Card
      className={`border-2 border-primary/50 bg-gradient-to-br from-primary/20 to-background`}
    >
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className={`h-6 w-6 text-primary`} />
            <span className={`text-foreground`}>
              Your Progress
            </span>
          </CardTitle>
          <CardDescription className={`text-muted-foreground`}>
            Keep growing your network to unlock new rewards!
          </CardDescription>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => router.push('/subscriptions')}
        >
          <Zap className="mr-2" /> View Ranks
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isBronze ? (
          <div className="space-y-2 rounded-lg bg-background/50 p-4 text-center">
            <h3 className="font-semibold text-foreground">
              Unlock Your Earning Potential!
            </h3>
            <p className="text-sm text-muted-foreground">
              Upgrade to a paid plan to start earning from your referrals.
            </p>
            <Button
              size="sm"
              className="mt-4"
              onClick={() => router.push('/subscriptions')}
            >
              Upgrade to Earn
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
             <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-primary">{currentTier.name} Rank</div>
                {nextTier && <div className="text-sm text-muted-foreground">Next: {nextTier.name} Rank</div>}
             </div>
            <Progress value={progress} className="h-4" />
            <div
              className={`flex justify-between font-semibold`}
            >
              <span>Current Monthly Earnings (Est.)</span>
              <span>
                {convertAndFormatCurrency(totalEarnings)}
              </span>
            </div>
            {nextTier && (
                 <div className={`text-sm text-muted-foreground space-y-1`}>
                    <p>
                        You're only <span className='font-bold text-accent'>{convertAndFormatCurrency(goal - totalEarnings)}</span> away from reaching the {nextTier.name} rank!
                    </p>
                 </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
