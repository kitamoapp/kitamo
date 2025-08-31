
'use client';

import { useContext } from 'react';
import { useSubscription as useSubscriptionContext } from '@/context/subscription-context';

export function useSubscription() {
  const context = useSubscriptionContext();
  return context;
}
