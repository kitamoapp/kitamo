
'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

export function ReferralCodeCard() {
  const [referralCode, setReferralCode] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // In a real app, you'd fetch this from your backend
    const generateCode = () =>
      Math.random().toString(36).substring(2, 10).toUpperCase();
    setReferralCode(generateCode());
  }, []);

  const onCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setHasCopied(true);
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard.',
    });
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };
  
  const referralLink = isClient ? `${window.location.origin}/signup?ref=${referralCode}` : '';
  const referralMessage = `Hey! I'm using KitaMo to manage my finances and it's been great. You should check it out! Sign up using my referral link: ${referralLink}`;

  const shareActions = [
    { name: 'WhatsApp', icon: MessageCircle, url: `https://wa.me/?text=${encodeURIComponent(referralMessage)}`},
    { name: 'Telegram', icon: Send, url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(referralMessage)}` },
    { name: 'Messenger', icon: Share2, url: `https://www.facebook.com/dialog/send?app_id=YOUR_FACEBOOK_APP_ID&link=${encodeURIComponent(referralLink)}&redirect_uri=${encodeURIComponent(isClient ? window.location.href : '')}` }
  ];
  
  const handleShare = (url: string) => {
    // For Messenger, we need to replace the placeholder app ID
    if (url.includes('YOUR_FACEBOOK_APP_ID')) {
        // In a real app, you would get this from your environment variables
        // For this demo, we'll use a public example ID.
        const facebookAppId = '1846626922365001'; 
        url = url.replace('YOUR_FACEBOOK_APP_ID', facebookAppId);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Friends</CardTitle>
        <CardDescription>
          Share your code with friends to grow your network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="text" value={referralCode} readOnly />
          <Button type="button" size="icon" onClick={onCopy}>
            {hasCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="flex items-center w-full">
            <Separator className="flex-1" />
            <span className="px-2 text-xs text-muted-foreground">Share via</span>
            <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-3 gap-2 w-full">
            {shareActions.map(action => (
                 <Button key={action.name} variant="outline" onClick={() => handleShare(action.url)} aria-label={`Share on ${action.name}`} disabled={!isClient}>
                    <action.icon className="h-5 w-5" />
                </Button>
            ))}
        </div>
      </CardFooter>
    </Card>
  );
}
