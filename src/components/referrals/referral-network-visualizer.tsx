
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Users, ArrowDown, Award, DollarSign } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { useCurrency } from '@/context/currency-context';
import { cn } from '@/lib/utils';


const LegCard = ({ title, volume, isPayableLeg, isWeakerLeg }: { title: string, volume: number, isPayableLeg: boolean, isWeakerLeg: boolean }) => {
  const { formatCurrency } = useCurrency();
  
  return (
    <div className={cn(
      "rounded-lg border p-4 w-full text-center relative",
      isPayableLeg ? "border-primary bg-primary/10 border-2" : "bg-muted/50"
    )}>
       {isWeakerLeg && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
             <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                Pay Leg
             </span>
          </div>
       )}
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="text-2xl font-bold text-primary">{formatCurrency(volume)}</div>
      <p className="text-xs text-muted-foreground">Total Group Volume</p>
    </div>
  )
};


export function ReferralNetworkVisualizer() {
  const { currentTier, leftLegVolume, rightLegVolume, payableVolume, totalEarnings } = useSubscription();
  const { formatCurrency } = useCurrency();
  const isWeakerLegLeft = leftLegVolume <= rightLegVolume;

  return (
    <Card>
      <CardHeader>
        <CardTitle>How You Earn</CardTitle>
        <CardDescription>
          Your earnings are based on the total sales volume of your weaker leg.
          This is known as a Binary Plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6 py-8">
        <div className="flex flex-col items-center gap-2 text-center">
            <Avatar className="h-20 w-20 border-4 border-primary">
                <AvatarImage src={"https://picsum.photos/100/100?random=0"} alt="You" data-ai-hint="person portrait" />
                <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div className="text-lg">
                <div className="font-semibold">Your Business Center</div>
                <div className="text-sm text-muted-foreground">{currentTier.name} Plan</div>
            </div>
        </div>

        <ArrowDown className="h-8 w-8 text-muted-foreground" />

        <div className="grid grid-cols-2 gap-6 w-full max-w-md">
           <LegCard title="Left Leg" volume={leftLegVolume} isPayableLeg={isWeakerLegLeft} isWeakerLeg={isWeakerLegLeft} />
           <LegCard title="Right Leg" volume={rightLegVolume} isPayableLeg={!isWeakerLegLeft} isWeakerLeg={!isWeakerLegLeft}/>
        </div>

        <div className="mt-4 w-full rounded-lg border border-dashed bg-muted/50 p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Award className="h-5 w-5 text-primary"/>
            <p className="text-sm text-muted-foreground">
                Your commission is <span className="font-bold text-primary">{currentTier.commissionRate * 100}%</span> of your weaker leg's volume.
            </p>
          </div>
          <div className="mt-2 text-lg">
             <span className="font-semibold">{formatCurrency(payableVolume)} (Payable Volume)</span>
             <span className="mx-2">x</span>
             <span className="font-semibold">{currentTier.commissionRate * 100}% (Rate)</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
            <DollarSign className="h-6 w-6"/>
            <span>{formatCurrency(totalEarnings)}</span>
          </div>
           <p className="text-xs text-muted-foreground">Estimated Monthly Earnings</p>
        </div>
      </CardContent>
    </Card>
  );
}
