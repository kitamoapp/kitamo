
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
            description: 'Please enter a referral code.',
            variant: 'destructive'
        })
        return;
    }

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
  );
}
