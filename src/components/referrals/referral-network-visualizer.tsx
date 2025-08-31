
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Users, ArrowDown, Award, DollarSign, User, Briefcase, Gem } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { useCurrency } from '@/context/currency-context';
import { cn } from '@/lib/utils';
import { useReferredUsers } from '@/context/referred-user-context';
import type { ReferredUser } from '@/lib/types';
import { Badge } from '../ui/badge';


const PlanIcon = ({ plan }: { plan: ReferredUser['plan']}) => {
    switch (plan) {
        case 'Bronze': return <Award className="h-4 w-4 text-yellow-700" />;
        case 'Silver': return <Briefcase className="h-4 w-4 text-slate-500" />;
        case 'Gold': return <Gem className="h-4 w-4 text-amber-500" />;
        case 'Platinum': return <Gem className="h-4 w-4 text-sky-500" />;
        default: return <User className="h-4 w-4" />;
    }
}


const DownlineNode = ({ user, allUsers, level = 0 }: { user: ReferredUser, allUsers: ReferredUser[], level?: number }) => {
    const children = allUsers.filter(u => u.referredBy === user.id);

    return (
        <div className={cn("relative pl-6 before:absolute before:left-0 before:top-4 before:h-full before:w-px before:bg-border", level > 0 && 'pt-4')}>
            <div className="relative flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm">
                 <div className="absolute -left-3.5 top-4 h-px w-3 bg-border"></div>
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://picsum.photos/100/100?random=${user.id}`} alt={user.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                    <p className="font-semibold">{user.name}</p>
                    <div className='flex items-center gap-2'>
                        <PlanIcon plan={user.plan} />
                        <p className="text-sm text-muted-foreground">{user.plan} Plan</p>
                    </div>
                </div>
            </div>
            {children.length > 0 && (
                <div className="mt-4 space-y-4">
                    {children.map(child => <DownlineNode key={child.id} user={child} allUsers={allUsers} level={level + 1} />)}
                </div>
            )}
        </div>
    )
}


export function ReferralNetworkVisualizer() {
  const { referredUsers } = useReferredUsers();
  
  const directReferrals = React.useMemo(() => {
    return referredUsers.filter(u => u.referredBy === 'currentUser');
  }, [referredUsers]);

  if (directReferrals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Network</CardTitle>
          <CardDescription>
            Recruit users to start building your network.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center py-10">
            <Users className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-muted-foreground">You haven't referred anyone yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Network</CardTitle>
        <CardDescription>
          Here's a visual representation of your downline.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-6 py-4">
        <div className="flex items-center gap-3">
             <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={"https://picsum.photos/100/100?random=0"} alt="You" data-ai-hint="person portrait" />
                <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div>
                <p className='text-lg font-semibold'>You</p>
                <p className='text-sm text-muted-foreground'>Network Root</p>
            </div>
        </div>
        <div className="w-full space-y-4">
           {directReferrals.map(user => (
              <DownlineNode key={user.id} user={user} allUsers={referredUsers} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
