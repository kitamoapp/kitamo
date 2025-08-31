
'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
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

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const ViberIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 256 256"
      fill="currentColor"
      {...props}
    >
        <path d="M152.3,213.2a10.6,10.6,0,0,1-10-5.9l-10.4-23a9,9,0,0,0-8.2-5.3H90.1a9.2,9.2,0,0,0-8.3,5.4L71,207.2a10.6,10.6,0,0,1-10,5.9,10.8,10.8,0,0,1-10.7-12.2l20.4-49.4a57.8,57.8,0,0,1,54-41.5h.3A57.8,57.8,0,0,1,180,157.1l20.4,49.4A10.8,10.8,0,0,1,190,218a10.6,10.6,0,0,1-10-5.9l-10.8-24.5a9,9,0,0,0-8.2-5.3H129.2a9.2,9.2,0,0,0-8.3,5.4L110,207.2A10.6,10.6,0,0,1,100,213.2h0Zm74.2-108.5a10.9,10.9,0,0,0-10.8-9.4,8.2,8.2,0,0,0-8.1,8.4v88.5a8.1,8.1,0,0,0,8.1,8.1,10.7,10.7,0,0,0,10.7-10.8V112.8A10.4,10.4,0,0,0,226.5,104.7ZM38.6,202.8a8.1,8.1,0,0,0,8.1-8.1V106.2a8.2,8.2,0,0,0-8.1-8.4,10.9,10.9,0,0,0-10.8,9.4,10.4,10.4,0,0,0,0,8.1v81.9A10.7,10.7,0,0,0,38.6,202.8Z"></path>
    </svg>
);


const MessengerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.438 8.632v4.257l3.465-2.053c1.34.42 2.766.653 4.257.653C18.627 22.222 24 17.248 24 11.111S18.627 0 12 0zm1.242 16.485l-2.35-2.73L6 16.485l6.758-7.53-1.92 2.656 2.35 2.73 4.81-2.73L13.242 16.485z" />
  </svg>
);


export function ReferralCodeCard() {
  const [referralCode, setReferralCode] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
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
  
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${referralCode}`;
  const referralMessage = `Hey! I'm using KitaMo to manage my finances. You can sign up using my referral code: ${referralCode}. Link: ${referralLink}`;

  const shareActions = [
    { name: 'WhatsApp', icon: WhatsAppIcon, url: `https://wa.me/?text=${encodeURIComponent(referralMessage)}`},
    { name: 'Viber', icon: ViberIcon, url: `viber://forward?text=${encodeURIComponent(referralMessage)}` },
    { name: 'Messenger', icon: MessengerIcon, url: `https://www.facebook.com/dialog/send?app_id=YOUR_APP_ID&link=${encodeURIComponent(referralLink)}&redirect_uri=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` }
  ];
  
  const handleShare = (url: string) => {
    // A placeholder app_id is used. For a real app, this should be a valid Facebook App ID.
    const finalUrl = url.replace('YOUR_APP_ID', '1234567890');
    window.open(finalUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Code</CardTitle>
        <CardDescription>
          Share this code with your friends so you can earn from their subscriptions.
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
                 <Button key={action.name} variant="outline" onClick={() => handleShare(action.url)} aria-label={`Share on ${action.name}`}>
                    <action.icon className="h-5 w-5" />
                </Button>
            ))}
        </div>
      </CardFooter>
    </Card>
  );
}
