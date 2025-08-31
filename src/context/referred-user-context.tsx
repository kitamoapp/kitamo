
'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import type { ReferredUser } from '@/lib/types';
import { referredUsers as initialReferredUsers } from '@/lib/data';

// Helper to handle serialization of Date objects
const serializeReferredUsers = (users: ReferredUser[]) => {
  return JSON.stringify(
    users.map((u) => ({ ...u, signupDate: u.signupDate.toISOString() }))
  );
};

const deserializeReferredUsers = (jsonString: string): ReferredUser[] => {
  return JSON.parse(jsonString).map((u: any) => ({
    ...u,
    signupDate: new Date(u.signupDate),
  }));
};

interface ReferredUserContextType {
  referredUsers: ReferredUser[];
  addReferredUser: (user: ReferredUser) => void;
}

const ReferredUserContext = createContext<ReferredUserContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'kitamo-referred-users';

export const ReferredUserProvider = ({ children }: { children: ReactNode }) => {
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>(() => {
    // This function now runs only on the client-side during initialization
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        return item ? deserializeReferredUsers(item) : initialReferredUsers;
      } catch (error) {
        console.error('Error reading from localStorage', error);
        return initialReferredUsers;
      }
    }
    return initialReferredUsers;
  });

  useEffect(() => {
    // This effect runs only on the client and syncs state to localStorage
    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        serializeReferredUsers(referredUsers)
      );
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [referredUsers]);

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
