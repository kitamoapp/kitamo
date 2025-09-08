
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// For demonstration, we'll have a list of valid codes.
// In a real app, these would come from your user database.
const VALID_REFERRAL_CODES = ['ALICECODE', 'BOBCODE', 'CHARLIECODE'];

export function ReferralCodeInputCard() {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [hasReferralCode, setHasReferralCode] = useState(false);

  const handleSaveReferralCode = () => {
    const code = referralCode.trim().toUpperCase();
    if (code === '') {
        toast({
            title: 'Error',
            description: 'Please enter an invite code.',
            variant: 'destructive'
        })
        return;
    }

    if (VALID_REFERRAL_CODES.includes(code)) {
      setHasReferralCode(true);
      toast({
          title: 'Success!',
          description: 'Your invite code has been applied.'
      })
    } else {
       toast({
            title: 'Invalid Code',
            description: 'The invite code you entered is not valid. Please check and try again.',
            variant: 'destructive'
        })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Code</CardTitle>
        <CardDescription>
          If someone invited you to the community, you can enter their code here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="referral-code">Inviter's Code</Label>
          <Input 
            id="referral-code"
            placeholder="Enter invite code"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            disabled={hasReferralCode} 
          />
        </div>
        <Button onClick={handleSaveReferralCode} disabled={hasReferralCode}>
            {hasReferralCode ? 'Code Applied' : 'Apply Code'}
        </Button>
      </CardContent>
    </Card>
  );
}
