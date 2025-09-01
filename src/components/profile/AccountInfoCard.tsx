
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const initialAccountInfo = {
  fullName: 'User',
  email: 'user@example.com',
};

export function AccountInfoCard() {
  const { toast } = useToast();
  const [accountInfo, setAccountInfo] = useState(initialAccountInfo);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const hasChanged = 
      accountInfo.fullName !== initialAccountInfo.fullName || 
      accountInfo.email !== initialAccountInfo.email;
    setIsChanged(hasChanged);
  }, [accountInfo]);


  const handleAccountInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAccountInfo(prev => ({ ...prev, [id]: value }));
  }

  const handleSaveChanges = () => {
    // Here you would typically call an API to save the changes
    console.log("Saving new account info:", accountInfo);
    toast({
      title: 'Profile Updated',
      description: 'Your account information has been saved.',
    });
    // Update the "initial" state to reflect the saved changes
    initialAccountInfo.fullName = accountInfo.fullName;
    initialAccountInfo.email = accountInfo.email;
    setIsChanged(false);
  }

  return (
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
        <Button onClick={handleSaveChanges} disabled={!isChanged}>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
