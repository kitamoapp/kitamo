
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

export function CommunityCodeInputCard() {
  const { toast } = useToast();
  const [communityCode, setCommunityCode] = useState('');
  const [hasCode, setHasCode] = useState(false);

  const handleSaveCode = () => {
    const code = communityCode.trim().toUpperCase();
    if (code === '') {
        toast({
            title: 'Error',
            description: 'Please enter a share code.',
            variant: 'destructive'
        })
        return;
    }

    if (VALID_REFERRAL_CODES.includes(code)) {
      setHasCode(true);
      toast({
          title: 'Success!',
          description: 'Your community code has been applied.'
      })
    } else {
       toast({
            title: 'Invalid Code',
            description: 'The share code you entered is not valid. Please check and try again.',
            variant: 'destructive'
        })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Code</CardTitle>
        <CardDescription>
          If someone helped you get started, you can enter their code here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="community-code">Friend's Share Code</Label>
          <Input 
            id="community-code"
            placeholder="Enter share code"
            value={communityCode}
            onChange={(e) => setCommunityCode(e.target.value)}
            disabled={hasCode} 
          />
        </div>
        <Button onClick={handleSaveCode} disabled={hasCode}>
            {hasCode ? 'Code Applied' : 'Apply Code'}
        </Button>
      </CardContent>
    </Card>
  );
}
