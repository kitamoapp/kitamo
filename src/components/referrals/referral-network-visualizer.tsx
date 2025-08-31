
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Share2, User } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';

const NetworkNode = ({
  name,
  level,
  earnings,
  isYou = false,
  imageUrl,
  aiHint,
}: {
  name: string;
  level: string;
  earnings?: string;
  isYou?: boolean;
  imageUrl: string;
  aiHint: string;
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
        {earnings && (
          <div className="text-xs font-bold text-green-600">{earnings}</div>
        )}
      </div>
    </div>
  );
};

export function ReferralNetworkVisualizer() {
  const { currentTier } = useSubscription();

  return (
    <Card>
      <CardHeader>
        <CardTitle>How You Earn</CardTitle>
        <CardDescription>
          Visually understand how your referral network generates earnings for
          you.
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
            You Earn {currentTier.directReferralPercent * 100}%
          </div>
          <div className="flex w-full justify-center gap-8 md:gap-16">
            <NetworkNode
              name="Alice"
              level="L1 Referral"
              imageUrl="https://picsum.photos/100/100?random=1"
              aiHint="person portrait"
            />
            <div className="flex flex-col items-center">
              <NetworkNode
                name="Bob"
                level="L1 Referral"
                imageUrl="https://picsum.photos/100/100?random=2"
                aiHint="person portrait"
              />

              {/* Connector to Level 2 */}
              <div className="relative mt-4 h-8 w-px bg-border">
                <Share2 className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 transform rounded-full bg-background text-primary" />
              </div>
            </div>
            <NetworkNode
              name="Charlie"
              level="L1 Referral"
              imageUrl="https://picsum.photos/100/100?random=3"
              aiHint="person portrait"
            />
          </div>
        </div>

        {/* Level 2 */}
        <div className="flex flex-col items-center gap-2">
          <div className="font-semibold text-muted-foreground">
            Indirect Referrals (Level 2)
          </div>
           <div className="text-sm font-bold text-primary">
            You Earn {currentTier.indirectReferralPercent * 100}%
          </div>
          <div className="text-muted-foreground">(Referred by Bob)</div>
          <div className="mt-2 flex justify-center gap-8">
            <NetworkNode
              name="Diana"
              level="L2 Referral"
              imageUrl="https://picsum.photos/100/100?random=4"
              aiHint="person portrait"
            />
            <NetworkNode
              name="Ethan"
              level="L2 Referral"
              imageUrl="https://picsum.photos/100/100?random=5"
              aiHint="person portrait"
            />
          </div>
        </div>

        <div className="mt-4 w-full rounded-lg border border-dashed bg-muted/50 p-4 text-center text-sm text-muted-foreground">
          This is a visual representation to help you understand the referral
          structure. Your network can have unlimited levels and users.
        </div>
      </CardContent>
    </Card>
  );
}
