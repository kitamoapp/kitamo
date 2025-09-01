
'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import type { ReferredUser, NewReferredUser } from '@/lib/types';
import { referredUsers as initialReferredUsers } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

interface ReferredUserContextType {
  referredUsers: ReferredUser[];
  addReferredUser: (user: NewReferredUser) => void;
  isLoaded: boolean;
}

const ReferredUserContext = createContext<ReferredUserContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'kitamo-referred-users';
// A mock mapping of referral codes to user IDs.
// In a real app, this would be handled by your backend.
const REFERRAL_CODE_TO_USER_ID_MAP: Record<string, string> = {
  'ALICECODE': '1',
  'BOBCODE': '2',
  'CHARLIECODE': '3',
};


export const ReferredUserProvider = ({ children }: { children: ReactNode }) => {
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);


  // Load from localStorage on the client side after initial render
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        setReferredUsers(JSON.parse(item));
      } else {
        setReferredUsers(initialReferredUsers);
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

  const addReferredUser = (user: NewReferredUser) => {
    const referrerId = user.referredBy 
      ? (REFERRAL_CODE_TO_USER_ID_MAP[user.referredBy] || 'currentUser') // Default to 'currentUser' if code is invalid
      : 'currentUser';

    const newUser: ReferredUser = {
      ...user,
      id: uuidv4(),
      signupDate: new Date().toISOString(),
      status: 'Active',
      referredBy: referrerId,
    };
    setReferredUsers((prev) => [newUser, ...prev]);
  };

  return (
    <ReferredUserContext.Provider value={{ referredUsers, addReferredUser, isLoaded }}>
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
