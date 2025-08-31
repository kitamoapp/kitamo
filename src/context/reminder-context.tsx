
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import type { Reminder } from '@/lib/types';

// Helper to handle serialization of Date objects
const serializeReminders = (reminders: Reminder[]) => {
  return JSON.stringify(reminders.map(r => ({...r, date: r.date.toString()})));
};

const deserializeReminders = (serialized: string): Reminder[] => {
    return JSON.parse(serialized).map((r: any) => ({...r, date: new Date(r.date)}));
}


interface ReminderContextType {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
}

const ReminderContext = createContext<ReminderContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'kitamo-reminders';

const initialReminders: Reminder[] = [
   { id: 'rem-1', title: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), recurrence: 'monthly' },
   { id: 'rem-2', title: 'Gym Membership', amount: 40, category: 'Health', date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), recurrence: 'monthly' },
];


export const ReminderProvider = ({ children }: { children: ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        setReminders(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading reminders from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
        try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reminders));
        } catch (error) {
            console.error('Error saving reminders to localStorage', error);
        }
    }
  }, [reminders, isLoaded]);

  const addReminder = (reminder: Reminder) => {
    setReminders((prev) => [...prev, reminder]);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <ReminderContext.Provider value={{ reminders, addReminder, deleteReminder }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};
