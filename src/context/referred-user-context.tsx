
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
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>(initialReferredUsers);

  // Load from localStorage on the client side after initial render
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        setReferredUsers(deserializeReferredUsers(item));
      }
    } catch (error) {
      console.error('Error reading from localStorage', error);
    }
  }, []);

  // Persist to localStorage whenever referredUsers changes
  useEffect(() => {
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
