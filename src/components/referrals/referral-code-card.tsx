
'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
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
    <path d="M15 10l-4 4 6 6 4-16-18 7 4 2 2 6 3-4" />
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
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
  
  const referralMessage = `Hey! I'm using KitaMo to manage my finances. Sign up with my code to get a bonus: ${referralCode}. Link: ${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${referralCode}`;

  const shareActions = [
    { name: 'WhatsApp', icon: WhatsAppIcon, url: `https://wa.me/?text=${encodeURIComponent(referralMessage)}`},
    { name: 'Telegram', icon: TelegramIcon, url: `https://t.me/share/url?url=${encodeURIComponent(referralMessage)}` },
    { name: 'Messenger', icon: MessengerIcon, url: `fb-messenger://share/?link=${encodeURIComponent(referralMessage)}` }
  ];
  
  const handleShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Code</CardTitle>
        <CardDescription>
          Share this code with your friends. They get a discount, and you get a
          bonus!
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
