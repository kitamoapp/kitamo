
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
import { Camera, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

// For demonstration, we'll have a list of valid codes.
// In a real app, these would come from your user database.
const VALID_REFERRAL_CODES = ['ALICECODE', 'BOBCODE', 'CHARLIECODE'];

export default function ProfilePage() {
  const { currentTier } = useSubscription();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for forms
  const [accountInfo, setAccountInfo] = useState({
    fullName: 'User',
    email: 'user@example.com',
  });
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [referralCode, setReferralCode] = useState('');
  const [hasReferralCode, setHasReferralCode] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(`https://picsum.photos/100/100`);

  const handleAccountInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAccountInfo(prev => ({ ...prev, [id]: value }));
  }
  
  const handlePasswordInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordInfo(prev => ({ ...prev, [id]: value }));
  }


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

  const handleSaveChanges = () => {
    // In a real app, you'd save this to your backend.
    toast({
      title: 'Profile Updated',
      description: 'Your account information has been saved.',
    });
  }

  const handleUpdatePassword = () => {
    if (!passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      });
      return;
    }
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    // In a real app, you'd make an API call to change the password.
    toast({
      title: 'Password Updated',
      description: 'Your password has been changed successfully.',
    });
    // Clear fields after successful update
    setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
  }

  const handleAvatarChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarSrc(URL.createObjectURL(file));
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
                      src={avatarSrc || undefined}
                      alt="User avatar"
                      data-ai-hint="person portrait"
                    />
                    <AvatarFallback>{accountInfo.fullName.charAt(0)}</AvatarFallback>
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
                <CardTitle className="text-2xl">{accountInfo.fullName}</CardTitle>
                <CardDescription>{accountInfo.email}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                 {avatarSrc && avatarSrc.startsWith('blob:') && (
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
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={accountInfo.fullName} onChange={handleAccountInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={accountInfo.email} onChange={handleAccountInfoChange} />
                </div>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
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
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={passwordInfo.currentPassword} onChange={handlePasswordInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={passwordInfo.newPassword} onChange={handlePasswordInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={passwordInfo.confirmPassword} onChange={handlePasswordInfoChange} />
                </div>
                <Button onClick={handleUpdatePassword}>Update Password</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
