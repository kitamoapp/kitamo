
'use client';

import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSubscription } from '@/hooks/use-subscription';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// For demonstration, we'll have a list of valid codes.
// In a real app, these would come from your user database.
const VALID_REFERRAL_CODES = ['ALICECODE', 'BOBCODE', 'CHARLIECODE'];

export default function ProfilePage() {
  const { currentTier } = useSubscription();
  const router = useRouter();
  const [referralCode, setReferralCode] = useState('');
  const [hasReferralCode, setHasReferralCode] = useState(false);
  const { toast } = useToast();


  const handleSaveReferralCode = () => {
    const code = referralCode.trim().toUpperCase();
    if (code === '') {
        toast({
            title: 'Error',
            description: 'Please enter a referral code.',
            variant: 'destructive'
        })
        return;
    }

    // In a real app, you would make an API call to validate the code.
    if (VALID_REFERRAL_CODES.includes(code)) {
      setHasReferralCode(true);
      toast({
          title: 'Success!',
          description: 'Your referral code has been applied.'
      })
    } else {
       toast({
            title: 'Invalid Code',
            description: 'The referral code you entered is not valid. Please check and try again.',
            variant: 'destructive'
        })
    }
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your account details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage
                      src={`https://picsum.photos/100/100`}
                      alt="User avatar"
                      data-ai-hint="person portrait"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-1 right-1 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change photo</span>
                  </Button>
                </div>
                <CardTitle className="text-2xl">User</CardTitle>
                <CardDescription>user@example.com</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Separator className="my-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Current Plan</p>
                  <Badge
                    className={cn(
                      'text-lg',
                      currentTier.name === 'Platinum' &&
                        'border-sky-500 text-sky-500',
                      currentTier.name === 'Gold' &&
                        'border-amber-500 text-amber-500',
                      currentTier.name === 'Silver' &&
                        'border-slate-500 text-slate-500',
                       currentTier.name === 'Bronze' && 'border-yellow-700 text-yellow-700'
                    )}
                    variant="outline"
                  >
                    {currentTier.name}
                  </Badge>
                </div>
                <Button className="mt-4 w-full" onClick={() => router.push('/subscriptions')}>
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal details here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="user@example.com" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referral Code</CardTitle>
                <CardDescription>
                  If you received a referral code after signing up, you can enter it here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="referral-code">Your Upline's Code</Label>
                  <Input 
                    id="referral-code"
                    placeholder="Enter referral code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    disabled={hasReferralCode} 
                  />
                </div>
                <Button onClick={handleSaveReferralCode} disabled={hasReferralCode}>
                    {hasReferralCode ? 'Code Applied' : 'Save Code'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password for better security.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
