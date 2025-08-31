
'use client';

import { useContext } from 'react';
import { useSubscriptionContext } from '@/context/subscription-context';

export function useSubscription() {
  const context = useSubscriptionContext();
  return context;
}
