
'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Trash2, Users, Shield, Award, Gem, Briefcase, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useReferredUsers } from '@/context/referred-user-context';
import type { ReferredUser, SubscriptionTier } from '@/lib/types';
import { subscriptionTiers } from '@/lib/data';

interface ProfileHeaderCardProps {
  fullName: string;
  email: string;
}

const PlanBadge = ({ tierName }: { tierName: string }) => {
  const getIcon = () => {
    switch (tierName) {
        case 'Free': return <Shield className="h-4 w-4" />;
        case 'Lite': return <Briefcase className="h-4 w-4" />;
        case 'Pro': return <Award className="h-4 w-4" />;
        case 'Max': return <Gem className="h-4 w-4" />;
        default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <Badge
      className={cn(
        'text-base gap-2',
        tierName === 'Max' && 'border-sky-500/50 text-sky-500 bg-sky-500/10',
        tierName === 'Pro' && 'border-amber-500/50 text-amber-500 bg-amber-500/10',
        tierName === 'Lite' && 'border-slate-500/50 text-slate-500 bg-slate-500/10',
        tierName === 'Free' && 'border-gray-500/50 text-gray-500 bg-gray-500/10'
      )}
      variant="outline"
    >
      {getIcon()}
      {tierName}
    </Badge>
  );
};


export function ProfileHeaderCard({ fullName, email }: ProfileHeaderCardProps) {
  const { referredUsers } = useReferredUsers();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarSrc, setAvatarSrc] = useState<string | null>(`https://picsum.photos/100/100`);

  const handleAvatarChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
            title: 'Invalid File Type',
            description: 'Please select an image file.',
            variant: 'destructive'
        });
        return;
      }
      const newAvatarSrc = URL.createObjectURL(file);
      setAvatarSrc(newAvatarSrc);
      toast({
        title: 'Photo updated',
        description: 'Your new profile picture is now displayed.',
      });
    }
  };

  const handleRemovePhoto = () => {
    setAvatarSrc(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    toast({
      title: 'Photo Removed',
      description: 'Your profile picture has been removed.',
    });
  };

  const downlineCount = useMemo(() => {
    const countDescendants = (userId: string): number => {
      const children = referredUsers.filter(u => u.referredBy === userId);
      let count = children.length;
      for (const child of children) {
        count += countDescendants(child.id);
      }
      return count;
    }
    // In a real app, the current user's ID would come from an auth context.
    return countDescendants('currentUser');
  }, [referredUsers]);

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="relative">
          <Avatar className="h-24 w-24 mb-2">
            <AvatarImage
              src={avatarSrc || undefined}
              alt="User avatar"
              data-ai-hint="person portrait"
            />
            <AvatarFallback>{fullName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-1 right-1 h-8 w-8 rounded-full"
            onClick={handleAvatarChangeClick}
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Change photo</span>
          </Button>
        </div>
        <CardTitle className="text-2xl">{fullName}</CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {avatarSrc && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive w-full mb-4"
            onClick={handleRemovePhoto}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Photo
          </Button>
        )}
        <Separator className="my-4" />
        <div className="flex justify-around items-center text-center mb-4">
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
                <PlanBadge tierName="Free" />
            </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Community Size</p>
                <div className="flex items-center justify-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <p className="text-xl font-bold">{downlineCount}</p>
                </div>
            </div>
        </div>
        <Button className="mt-4 w-full" onClick={() => router.push('/subscriptions')}>
          Manage Subscription
        </Button>
      </CardContent>
    </Card>
  );
}
