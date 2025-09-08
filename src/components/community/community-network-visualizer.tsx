
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
import { Users, Award, Briefcase, Gem, User, PlusCircle, MinusCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReferredUsers } from '@/context/referred-user-context';
import type { ReferredUser } from '@/lib/types';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { subscriptionTiers } from '@/lib/data';


const PlanIcon = ({ plan }: { plan: ReferredUser['plan']}) => {
    const tier = subscriptionTiers.find(t => t.name === plan);
    switch (plan) {
        case 'Free': return <Shield className="h-4 w-4 text-gray-500" />;
        case 'Personal': return <User className="h-4 w-4 text-green-500" />;
        case 'Lite': return <Briefcase className="h-4 w-4 text-slate-500" />;
        case 'Pro': return <Award className="h-4 w-4 text-amber-500" />;
        case 'Max': return <Gem className="h-4 w-4 text-sky-500" />;
        default: return <User className="h-4 w-4" />;
    }
}

const NodeToggleButton = ({ isExpanded, onClick }: { isExpanded: boolean, onClick: (e: React.MouseEvent) => void }) => (
    <Button variant="ghost" size="icon" onClick={onClick} className="h-6 w-6 absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-background hover:bg-muted rounded-full">
        {isExpanded ? <MinusCircle className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
    </Button>
)

const DownlineNode = ({ user, allUsers, level = 0, expandedNodes, toggleNode }: { user: ReferredUser, allUsers: ReferredUser[], level?: number, expandedNodes: Set<string>, toggleNode: (id: string) => void }) => {
    const children = allUsers.filter(u => u.referredBy === user.id);
    const isExpanded = expandedNodes.has(user.id);
    const hasChildren = children.length > 0;

    return (
        <div className={cn("relative pl-6 before:absolute before:left-0 before:top-4 before:h-full before:w-px before:bg-border", level > 0 && 'pt-4')}>
            <div className="relative flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm min-w-max">
                 <div className="absolute -left-3 top-4 h-px w-3 bg-border"></div>
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
                {hasChildren && <NodeToggleButton isExpanded={isExpanded} onClick={(e) => { e.stopPropagation(); toggleNode(user.id); }} />}
            </div>
            {isExpanded && children.length > 0 && (
                <div className="mt-4 space-y-4">
                    {children.map(child => <DownlineNode key={child.id} user={child} allUsers={allUsers} level={level + 1} expandedNodes={expandedNodes} toggleNode={toggleNode} />)}
                </div>
            )}
        </div>
    )
}

const LegColumn = ({ leg, users, allUsers, expandedNodes, toggleNode }: { leg: 'left' | 'right', users: ReferredUser[], allUsers: ReferredUser[], expandedNodes: Set<string>, toggleNode: (id: string) => void }) => (
    <div className="flex flex-col items-center gap-4">
        {/* Connector from top */}
        <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-border"></div>

        <h3 className='font-semibold text-lg'>{leg === 'left' ? 'Left' : 'Right'} Team</h3>

        {users.length > 0 ? (
            <div className="space-y-4">
                {users.map(user => <DownlineNode key={user.id} user={user} allUsers={allUsers} level={1} expandedNodes={expandedNodes} toggleNode={toggleNode} />)}
            </div>
        ) : (
            <div className="text-center text-muted-foreground p-4 border-2 border-dashed rounded-lg">
                No one on this team yet.
            </div>
        )}
    </div>
);


const VisualizerSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="relative h-px w-full max-w-lg">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 justify-center items-start pt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative flex flex-col items-center gap-4">
              <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-border"></div>
              <div className="relative flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm min-w-max z-10">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );


export function CommunityNetworkVisualizer() {
  const { referredUsers, isLoaded } = useReferredUsers();
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set());

  const toggleNode = (userId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };
  
  const directConnections = React.useMemo(() => {
    return referredUsers.filter(u => u.referredBy === 'currentUser');
  }, [referredUsers]);

  const leftTeamUsers = directConnections.filter(u => u.leg === 'left');
  const rightTeamUsers = directConnections.filter(u => u.leg === 'right');


  if (!isLoaded) {
      return <VisualizerSkeleton />;
  }

  if (directConnections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Community Network</CardTitle>
          <CardDescription>
            Help friends get started to build your community.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center py-10">
            <Users className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-muted-foreground">You haven't helped anyone get started yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Community Network</CardTitle>
        <CardDescription>
          Click the plus icon to expand a person's connections.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 py-4">
        <div className="flex items-center gap-3">
             <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={"https://picsum.photos/100/100?random=0"} alt="You" data-ai-hint="person portrait" />
                <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div>
                <p className='text-lg font-semibold'>You</p>
                <p className='text-sm text-muted-foreground'>Community Root</p>
            </div>
        </div>
        
        {/* Horizontal Connector Line */}
        <div className="relative h-px w-full max-w-lg bg-border">
          {/* Vertical line down from 'You' */}
          <div className="absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2 bg-border"></div>
           {/* T-junctions for legs */}
           <div className="absolute top-0 left-1/4 h-4 w-px bg-border"></div>
           <div className="absolute top-0 right-1/4 h-4 w-px bg-border"></div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 justify-center items-start pt-4">
            <LegColumn leg="left" users={leftTeamUsers} allUsers={referredUsers} expandedNodes={expandedNodes} toggleNode={toggleNode} />
            <LegColumn leg="right" users={rightTeamUsers} allUsers={referredUsers} expandedNodes={expandedNodes} toggleNode={toggleNode} />
        </div>
      </CardContent>
    </Card>
  );
}
