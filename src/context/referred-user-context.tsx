
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
import { v4 as uuidv4 } from 'uuid';

interface ReferredUserContextType {
  referredUsers: ReferredUser[];
  addReferredUser: (user: Omit<ReferredUser, 'id' | 'signupDate' | 'status' | 'referredBy'>) => void;
}

const ReferredUserContext = createContext<ReferredUserContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'kitamo-referred-users';

export const ReferredUserProvider = ({ children }: { children: ReactNode }) => {
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>(initialReferredUsers);
  const [isLoaded, setIsLoaded] = useState(false);


  // Load from localStorage on the client side after initial render
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        setReferredUsers(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading from localStorage', error);
      // Fallback to initial data if localStorage is corrupt or unavailable
      setReferredUsers(initialReferredUsers);
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever referredUsers changes
  useEffect(() => {
    if (isLoaded) {
        try {
        window.localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(referredUsers)
        );
        } catch (error) {
        console.error('Error writing to localStorage', error);
        }
    }
  }, [referredUsers, isLoaded]);

  const addReferredUser = (user: Omit<ReferredUser, 'id' | 'signupDate'| 'status' | 'referredBy'>) => {
    const newUser: ReferredUser = {
        ...user,
        id: uuidv4(),
        signupDate: new Date().toISOString(),
        status: 'Active',
        referredBy: 'currentUser'
    }
    setReferredUsers((prev) => [newUser, ...prev]);
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
