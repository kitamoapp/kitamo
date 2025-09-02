
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


function ForgotPasswordDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your inbox for instructions to reset your password.',
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Could not send password reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forgot Password?</DialogTitle>
          <DialogDescription>
            No problem. Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleResetPassword}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              { isSubmitting && <Loader2 className="animate-spin" />}
              Send Reset Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function LoginForm() {
  const router = useRouter();
  const { login, user, loading, mfaState, verifyMfaCode } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    if (user && mfaState === 'idle') {
      router.push('/dashboard');
    }
  }, [user, mfaState, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      // On success, the useEffect will redirect or the mfaState will change
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMfaVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await verifyMfaCode(mfaCode);
      // On success, useEffect will redirect
    } catch (error: any) {
      // The toast is handled inside the context
    } finally {
      setIsSubmitting(false);
    }
  }


  if (loading) {
    return <LoginSkeleton />;
  }
  
  if (user && mfaState === 'idle') {
     return <LoginSkeleton />;
  }
  
  if (mfaState === 'requires_mfa' || mfaState === 'verifying_mfa') {
    return (
      <>
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 text-4xl font-bold text-primary">KitaMo</div>
          <p className="text-muted-foreground">
            Complete verification to sign in
          </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Enter Verification Code</CardTitle>
                <CardDescription>
                    A code was sent to your phone. Enter it below to continue.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleMfaVerification} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="mfa-code">Verification Code</Label>
                        <Input
                            id="mfa-code"
                            type="text"
                            placeholder="123456"
                            required
                            value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value)}
                            disabled={isSubmitting || mfaState === 'verifying_mfa'}
                            maxLength={6}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting || mfaState === 'verifying_mfa'}>
                        { (isSubmitting || mfaState === 'verifying_mfa') && <Loader2 className="animate-spin" />}
                        Verify
                    </Button>
                </form>
            </CardContent>
        </Card>
      </>
    )
  }


  return (
    <>
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 text-4xl font-bold text-primary">KitaMo</div>
        <p className="text-muted-foreground">
          Sign in for your personalized financial consultation
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" type="button" className="p-0 h-auto text-xs" onClick={() => setShowForgotPassword(true)}>
                  Forgot Password?
                </Button>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
               {isSubmitting && <Loader2 className="animate-spin" />}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
      <ForgotPasswordDialog open={showForgotPassword} onOpenChange={setShowForgotPassword} />
    </>
  );
}

function LoginSkeleton() {
    return (
        <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center">
                <Skeleton className="h-10 w-32 mb-4" />
                <Skeleton className="h-5 w-64" />
            </div>
            <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full mt-4" />
                </div>
            </div>
             <Skeleton className="h-5 w-48 mx-auto" />
        </div>
    )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoginSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
