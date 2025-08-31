
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
        viewBox="0 0 48 48"
        fill="currentColor"
        {...props}
    >
        <path d="M41.9,10.1C38.2,6.5,33.4,4.5,28,4.5c-9.9,0-18,8.1-18,18c0,3.2,0.9,6.3,2.5,8.9l-2.8,10.2l10.5-2.8 c2.5,1.5,5.3,2.3,8.3,2.3h0c0,0,0,0,0,0c9.9,0,18-8.1,18-18C46,16.8,44.4,13.1,41.9,10.1z"></path><path fill="#fff" d="M33.6,30.3c-0.2-0.3-0.8-0.5-1.7-1c-0.9-0.4-5.4-2.7-6.2-3c-0.8-0.3-1.4-0.4-2,0.4 s-2.3,3-2.9,3.5c-0.5,0.5-1.1,0.6-2,0.2c-0.9-0.4-3.8-1.4-7.2-4.4c-2.7-2.4-4.5-5.4-5-6.3c-0.5-0.9-0.1-1.4,0.4-1.8 c0.4-0.4,0.8-0.9,1.2-1.4c0.4-0.4,0.5-0.8,0.8-1.3c0.2-0.5,0.1-1-0.1-1.4c-0.2-0.4-2-4.9-2.7-6.7c-0.7-1.8-1.5-1.5-2-1.5 c-0.5,0-1.1,0-1.7,0c-0.6,0-1.6,0.2-2.4,1c-0.8,0.8-3.1,3-3.1,7.3c0,4.3,3.2,8.5,3.6,9.1c0.4,0.6,6.2,9.5,15,13.2 c2.1,0.9,3.7,1.4,5,1.8c2.1,0.6,4,0.5,5.5,0.3c1.7-0.2,5.4-2.2,6.1-4.3c0.8-2.1,0.8-3.9,0.5-4.3C34.4,30.7,33.8,30.5,33.6,30.3z"></path>
    </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.57c-.28 1.1-.86 1.32-1.7.82l-4.74-3.51l-2.25 2.15c-.23.22-.42.41-.83.41z" />
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
    { name: 'Telegram', icon: TelegramIcon, url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(referralMessage)}` },
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
