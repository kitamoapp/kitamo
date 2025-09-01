
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the SignupPage with SSR turned off
const SignupClientPage = dynamic(() => import('@/components/signup/signup-client-page'), { 
    ssr: false,
    loading: () => <SignupSkeleton />,
});

function SignupSkeleton() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                 <div className="flex flex-col items-center">
                    <Skeleton className="h-10 w-32 mb-4" />
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <div className="space-y-6 rounded-lg border bg-card p-6">
                    <div className="space-y-2 text-center">
                        <Skeleton className="h-7 w-24 mx-auto" />
                        <Skeleton className="h-4 w-64 mx-auto" />
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
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupSkeleton />}>
        <SignupClientPage />
    </Suspense>
  );
}
