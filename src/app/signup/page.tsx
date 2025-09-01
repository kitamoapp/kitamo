
import Link from 'next/link';
import React, { Suspense } from 'react';
import { SignupForm } from '@/components/signup/signup-form';
import { Skeleton } from '@/components/ui/skeleton';

function SignupSkeleton() {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center">
        <Skeleton className="mb-4 h-10 w-32" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-7 w-24" />
          <Skeleton className="mx-auto h-4 w-64" />
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
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="mt-4 h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
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
        <Suspense fallback={<SignupSkeleton />}>
          <SignupForm />
        </Suspense>
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
