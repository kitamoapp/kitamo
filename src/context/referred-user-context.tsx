
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { ReferredUser } from '@/lib/types';
import { referredUsers as initialReferredUsers } from '@/lib/data';

interface ReferredUserContextType {
  referredUsers: ReferredUser[];
  addReferredUser: (user: ReferredUser) => void;
}

const ReferredUserContext = createContext<ReferredUserContextType | undefined>(
  undefined
);

export const ReferredUserProvider = ({ children }: { children: ReactNode }) => {
  const [referredUsers, setReferredUsers] =
    useState<ReferredUser[]>(initialReferredUsers);

  const addReferredUser = (user: ReferredUser) => {
    setReferredUsers((prev) => [user, ...prev]);
  };

  return (
    <ReferredUserContext.Provider value={{ referredUsers, addReferredUser }}>
      {children}
    </ReferredUserContext.Provider>
  );
};

export const useReferredUsers = () => {
  const context = useContext(ReferredUserContext);
  if (context === undefined) {
    throw new Error(
      'useReferredUsers must be used within a ReferredUserProvider'
    );
  }
  return context;
};
