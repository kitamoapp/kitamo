
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ChangePasswordCard() {
  const { toast } = useToast();
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordInfo(prev => ({ ...prev, [id]: value }));
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
     if (passwordInfo.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'New password must be at least 8 characters long.',
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
    toast({
      title: 'Password Updated',
      description: 'Your password has been changed successfully.',
    });
    setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
  }

  return (
    <div className="space-y-6 rounded-lg border p-4">
        <div className="space-y-0.5">
            <h4 className="text-base font-medium">Change Password</h4>
            <p className="text-sm text-muted-foreground">
                Update your password for better security.
            </p>
        </div>
        <div className="space-y-4">
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
        </div>
    </div>
  );
}
