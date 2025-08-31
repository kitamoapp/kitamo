
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7z"></path>
    </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
        <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
    </svg>
);


const MessengerIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
    <path d="M8 13l3 -4l7 4l-3 4l-7 -4" />
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
