
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the SignupPage with SSR turned off
const SignupClientPage = dynamic(() => import('@/components/signup/signup-client-page'), { ssr: false });

export default function SignupPage() {
  return <SignupClientPage />;
}
