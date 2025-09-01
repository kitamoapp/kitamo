
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.206c-.242-.579-.487-.5-.669-.51s-.371-.012-.57-.012c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M21 12.073c0-4.971-4.029-9-9-9s-9 4.029-9 9c0 1.606.418 3.116 1.163 4.455L2.25 21.75l5.474-1.35a8.956 8.956 0 0 0 4.276 1.1c4.971 0 9-4.029 9-9z" />
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
        strokeWidth="1.5"
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
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.898 5.515 4.595 6.924.185.055.334.19.38.37l.454 1.815 1.815-.908a.5.5 0 0 1 .45-.043C10.395 17.848 11.185 18 12 18c5.514 0 10-3.589 10-8s-4.486-8-10-8zm1.148 10.236l-2.66 2.764a.5.5 0 0 1-.77-.02l-1.95-2.28a.5.5 0 0 1 .33-.864H12.5a.5.5 0 0 1 .418.79l-1.233 1.95 1.638-1.702a.5.5 0 0 1 .625-.018z"/>
  </svg>
);


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
    { name: 'WhatsApp', icon: WhatsAppIcon, url: `https://wa.me/?text=${encodeURIComponent(referralMessage)}`},
    { name: 'Telegram', icon: TelegramIcon, url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(referralMessage)}` },
    { name: 'Messenger', icon: MessengerIcon, url: `https://www.facebook.com/dialog/send?app_id=YOUR_FACEBOOK_APP_ID&link=${encodeURIComponent(referralLink)}&redirect_uri=${encodeURIComponent(isClient ? window.location.href : '')}` }
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
