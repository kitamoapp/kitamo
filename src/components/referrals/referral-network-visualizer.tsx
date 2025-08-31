
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Share2 } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { useCurrency } from '@/context/currency-context';
import { subscriptionTiers } from '@/lib/data';
import type { SubscriptionTier } from '@/lib/types';

const NetworkNode = ({
  name,
  level,
  earnings,
  isYou = false,
  imageUrl,
  aiHint,
  planName,
}: {
  name: string;
  level: string;
  earnings?: string;
  isYou?: boolean;
  imageUrl: string;
  aiHint: string;
  planName?: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Avatar
        className={`h-16 w-16 border-4 ${
          isYou ? 'border-primary' : 'border-muted-foreground'
        }`}
      >
        <AvatarImage src={imageUrl} alt={name} data-ai-hint={aiHint} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-muted-foreground">{level}</div>
        {planName && (
            <div className="text-xs text-muted-foreground">({planName} Plan)</div>
        )}
        {earnings && (
          <div className="text-xs font-bold text-green-600">{earnings}</div>
        )}
      </div>
    </div>
  );
};

export function ReferralNetworkVisualizer() {
  const { currentTier } = useSubscription();
  const { convertAndFormatCurrency } = useCurrency();
  
  // Use Silver tier for demonstration purposes if the user is on Bronze
  const tierForDemonstration: SubscriptionTier = currentTier.name === 'Bronze' 
    ? subscriptionTiers.find(t => t.name === 'Silver')! 
    : currentTier;
    
  // Hypothetical downlines for demonstration
  const silverPlan = subscriptionTiers.find(t => t.name === 'Silver')!;
  const goldPlan = subscriptionTiers.find(t => t.name === 'Gold')!;

  const directReferralRevenue = silverPlan.price;
  const indirectReferralRevenue = goldPlan.price;

  const directEarning = directReferralRevenue * tierForDemonstration.directReferralPercent;
  const indirectEarning = indirectReferralRevenue * tierForDemonstration.indirectReferralPercent;
  const totalEarning = directEarning + indirectEarning;

  return (
    <Card>
      <CardHeader>
        <CardTitle>How You Earn</CardTitle>
        <CardDescription>
          A demonstration of how your referral network generates earnings for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-8 py-8">
        {/* Main User */}
        <NetworkNode
          name="You"
          level="Your Account"
          isYou
          imageUrl="https://picsum.photos/100/100?random=0"
          aiHint="person portrait"
          planName={currentTier.name}
          earnings={totalEarning > 0 ? `+ ${convertAndFormatCurrency(totalEarning, 'USD')}/mo Total` : undefined}
        />

        {/* Connector */}
        <div className="relative h-12 w-px bg-border">
          <Share2 className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 transform rounded-full bg-background text-primary" />
        </div>

        {/* Level 1 */}
        <div className="flex flex-col items-center gap-2">
          <div className="font-semibold text-muted-foreground">
            Direct Referrals (Level 1)
          </div>
          <div className="text-sm font-bold text-primary">
            You Earn {tierForDemonstration.directReferralPercent * 100}%
          </div>
           {directEarning > 0 && (
            <div className="text-xs font-semibold text-green-600">
              (+ {convertAndFormatCurrency(directEarning, 'USD')}/mo from Alice)
            </div>
          )}
          <div className="flex w-full justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <NetworkNode
                name="Alice"
                level="L1 Referral"
                planName="Silver"
                imageUrl="https://picsum.photos/100/100?random=1"
                aiHint="person portrait"
              />

              {/* Connector to Level 2 */}
              <div className="relative mt-4 h-8 w-px bg-border">
                <Share2 className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 transform rounded-full bg-background text-primary" />
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">(Referred by You)</div>
        </div>

        {/* Level 2 */}
        <div className="flex flex-col items-center gap-2">
          <div className="font-semibold text-muted-foreground">
            Indirect Referrals (Level 2)
          </div>
           <div className="text-sm font-bold text-primary">
            You Earn {tierForDemonstration.indirectReferralPercent * 100}%
          </div>
          {indirectEarning > 0 && (
            <div className="text-xs font-semibold text-green-600">
              (+ {convertAndFormatCurrency(indirectEarning, 'USD')}/mo from Diana)
            </div>
          )}
          <div className="mt-2 flex justify-center gap-8">
            <NetworkNode
              name="Diana"
              level="L2 Referral"
              planName="Gold"
              imageUrl="https://picsum.photos/100/100?random=4"
              aiHint="person portrait"
            />
          </div>
           <div className="text-xs text-muted-foreground">(Referred by Alice)</div>
        </div>

        <div className="mt-4 w-full rounded-lg border border-dashed bg-muted/50 p-4 text-center text-sm text-muted-foreground">
          This is a visual representation to help you understand the referral
          structure. The earnings shown are for demonstration purposes only and
          do not represent your actual earnings. Your network can have
          unlimited levels and users.
        </div>
      </CardContent>
    </Card>
  );
}
