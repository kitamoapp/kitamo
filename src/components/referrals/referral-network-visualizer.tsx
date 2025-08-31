
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

const LevelConnector = ({ level, percent, earning, referralSource }: { level: number, percent: number, earning: number, referralSource: string }) => {
  const { convertAndFormatCurrency } = useCurrency();
  return (
    <>
      <div className="relative mt-4 h-8 w-px bg-border">
        <Share2 className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 transform rounded-full bg-background text-primary" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="font-semibold text-muted-foreground">
          Level {level} Referrals
        </div>
        <div className="text-sm font-bold text-primary">
          You Earn {percent * 100}%
        </div>
        {earning > 0 && (
          <div className="text-xs font-semibold text-green-600">
            (+ {convertAndFormatCurrency(earning, 'USD')}/mo)
          </div>
        )}
         <div className="text-xs text-muted-foreground">(Referred by {referralSource})</div>
      </div>
    </>
  );
};


export function ReferralNetworkVisualizer() {
  const { currentTier } = useSubscription();
  const { convertAndFormatCurrency } = useCurrency();
  
  // Use Platinum tier for demonstration purposes to show all levels
  const tierForDemonstration: SubscriptionTier = subscriptionTiers.find(t => t.name === 'Platinum')!;
    
  // Hypothetical downlines for demonstration
  const silverPlan = subscriptionTiers.find(t => t.name === 'Silver')!;
  const goldPlan = subscriptionTiers.find(t => t.name === 'Gold')!;
  const platinumPlan = subscriptionTiers.find(t => t.name === 'Platinum')!;

  const levelRevenues = [
    silverPlan.price, // L1
    goldPlan.price,   // L2
    silverPlan.price, // L3
    platinumPlan.price, // L4
    goldPlan.price // L5
  ];

  const levelPercentages = [
    tierForDemonstration.directReferralPercent, // L1
    tierForDemonstration.indirectReferralPercent, // L2
    tierForDemonstration.indirectReferralPercent * 0.5, // L3 demo
    tierForDemonstration.indirectReferralPercent * 0.25, // L4 demo
    tierForDemonstration.indirectReferralPercent * 0.1, // L5 demo
  ];
  
  const levelEarnings = levelRevenues.map((revenue, index) => revenue * levelPercentages[index]);
  const totalEarning = levelEarnings.reduce((acc, earning) => acc + earning, 0);

  const referralChain = [
    { name: "You", level: "Your Account", isYou: true, planName: currentTier.name, referredBy: "", earnings: totalEarning > 0 ? `+ ${convertAndFormatCurrency(totalEarning, 'USD')}/mo Total` : undefined, imageUrl: "https://picsum.photos/100/100?random=0", aiHint: "person portrait" },
    { name: "Alice", level: "L1 Referral", planName: "Silver", referredBy: "You", imageUrl: "https://picsum.photos/100/100?random=1", aiHint: "person portrait" },
    { name: "Diana", level: "L2 Referral", planName: "Gold", referredBy: "Alice", imageUrl: "https://picsum.photos/100/100?random=4", aiHint: "person portrait" },
    { name: "Ethan", level: "L3 Referral", planName: "Silver", referredBy: "Diana", imageUrl: "https://picsum.photos/100/100?random=5", aiHint: "person portrait" },
    { name: "Fiona", level: "L4 Referral", planName: "Platinum", referredBy: "Ethan", imageUrl: "https://picsum.photos/100/100?random=6", aiHint: "woman portrait" },
    { name: "George", level: "L5 Referral", planName: "Gold", referredBy: "Fiona", imageUrl: "https://picsum.photos/100/100?random=7", aiHint: "man portrait" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>How You Earn</CardTitle>
        <CardDescription>
          A demonstration of how a 5-level referral network generates earnings for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
        {/* Main User */}
        <NetworkNode
          name={referralChain[0].name}
          level={referralChain[0].level}
          isYou
          imageUrl={referralChain[0].imageUrl}
          aiHint={referralChain[0].aiHint}
          planName={referralChain[0].planName}
          earnings={referralChain[0].earnings}
        />

        {referralChain.slice(1).map((user, index) => (
           <div key={user.name} className="flex flex-col items-center w-full">
             <LevelConnector
                level={index + 1}
                percent={levelPercentages[index]}
                earning={levelEarnings[index]}
                referralSource={referralChain[index].name}
             />
             <div className="mt-4">
                <NetworkNode
                    name={user.name}
                    level={user.level}
                    planName={user.planName}
                    imageUrl={user.imageUrl}
                    aiHint={user.aiHint}
                />
             </div>
           </div>
        ))}

        <div className="mt-4 w-full rounded-lg border border-dashed bg-muted/50 p-4 text-center text-sm text-muted-foreground">
          This is a visual representation to help you understand the referral
          structure. The earnings shown are for demonstration purposes only and
          do not represent your actual earnings. Your network can have
          unlimited levels and users, and earning percentages may vary.
        </div>
      </CardContent>
    </Card>
  );
}
