
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const GmailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M22 5.88V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-.56.31-1.08.8-1.39l8-4.5a2 2 0 0 1 2.4 0l8 4.5c.49.31.8.83.8 1.39z" fillOpacity=".05" />
      <path d="M22 6.5l-10 6-10-6V18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6.5z" fill="#ea4335" />
      <path d="M22 5.88l-10 6-10-6L12 2l10 3.88z" fill="#c5221f" />
      <path d="M2 6l10 6 10-6-10-4L2 6z" fill="#4285f4" />
      <path d="M2 18V6.5l10 6L2 18z" fillOpacity=".1" />
      <path d="M22 18V6.5l-10 6L22 18z" fillOpacity=".1" />
    </svg>
  );

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="#1877f2" stroke="#1877f2" />
</svg>
);


export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
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
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={handleLogin}>
                        <GmailIcon className="mr-2 h-4 w-4" />
                        Gmail
                    </Button>
                    <Button variant="outline" onClick={handleLogin}>
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
        </div>
      </div>
    </>
  );
}
