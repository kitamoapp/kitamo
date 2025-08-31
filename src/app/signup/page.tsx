

'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PiggyBank } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReferredUsers } from '@/context/referred-user-context';
import type { NewReferredUser } from '@/lib/types';
import { subscriptionTiers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addReferredUser } = useReferredUsers();
  const { toast } = useToast();
  
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    const refCode = searchParams.get('ref') || '';
    setReferralCode(refCode);
  }, [searchParams]);
  

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    
    // For this demo, we'll assign a random plan to the new user.
    const randomPlan = subscriptionTiers.filter(t => t.price > 0)[Math.floor(Math.random() * (subscriptionTiers.length -1))];
    const leg = Math.random() > 0.5 ? 'left' : 'right';

    const newUser: NewReferredUser = {
      name,
      plan: randomPlan.name,
      leg,
      referredBy: referralCode.trim().toUpperCase() || undefined,
    };
    
    addReferredUser(newUser);

    toast({
        title: 'Welcome!',
        description: "Your account has been created successfully."
    });

    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 text-4xl font-bold text-primary">KitaMo</div>
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">
            Start your financial journey with KitaMo
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Your Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="referral-code">Referral Code (Optional)</Label>
                <Input 
                  id="referral-code" 
                  type="text" 
                  placeholder="Enter referral code" 
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
