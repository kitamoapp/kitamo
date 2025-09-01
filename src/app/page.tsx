
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import { Suspense } from 'react';

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
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const GmailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48"
      {...props}
    >
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
  );

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48"
      {...props}
    >
        <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-3.28c0-1.448,0.396-2.433,2.476-2.433l2.643,0v-4.48c-0.457-0.06-2.025-0.199-3.848-0.199c-3.808,0-6.417,2.336-6.417,6.583v3.714h-4.348v4.995h4.348v12.016h5.318V29.036z"></path>
    </svg>
);

function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const authProvider = provider === 'google' 
        ? new GoogleAuthProvider() 
        : new FacebookAuthProvider();
    
    authProvider.setCustomParameters({
        'auth_domain': auth.config.authDomain
    });

    try {
        await signInWithPopup(auth, authProvider);
        router.push('/dashboard');
    } catch(error: any) {
        // Don't show an error toast if the user simply closes the pop-up.
        if (error.code === 'auth/user-cancelled' || error.code === 'auth/cancelled-popup-request') {
            console.log("Authentication cancelled by user.");
            return;
        }
        
        console.error("Authentication Error:", error);
        toast({
            title: 'Authentication Failed',
            description: 'Could not log in. Please try again.',
            variant: 'destructive'
        });
    }
  }
  
    return (
        <>
         <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 text-4xl font-bold text-primary">KitaMo</div>
            <p className="text-muted-foreground">
              Sign in to manage your finances
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
               <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground lowercase">
                    or continue with
                    </span>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => handleSocialLogin('google')}>
                        <GmailIcon className="mr-2 h-4 w-4" />
                        Gmail
                    </Button>
                    <Button variant="outline" onClick={() => handleSocialLogin('facebook')}>
                        <FacebookIcon className="mr-2 h-4 w-4" />
                        Facebook
                    </Button>
                </div>
            </CardContent>
          </Card>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </>
    )

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
                    <div className="relative my-4">
                        <Skeleton className="h-px w-full" />
                        <Skeleton className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-24" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
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
