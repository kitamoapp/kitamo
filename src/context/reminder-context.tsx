
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
  return JSON.stringify(
    reminders.map((r) => ({ ...r, date: r.date.toString() }))
  );
};

const deserializeReminders = (jsonString: string): Reminder[] => {
  return JSON.parse(jsonString).map((r: any) => ({
    ...r,
    date: new Date(r.date),
  }));
};

interface ReminderContextType {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
}

const ReminderContext = createContext<ReminderContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'kitamo-reminders';

export const ReminderProvider = ({ children }: { children: ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        // Pre-populate with some default reminders if none exist
        const initialReminders = [
           { id: 'rem-1', title: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), recurrence: 'monthly' },
           { id: 'rem-2', title: 'Gym Membership', amount: 40, category: 'Health', date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), recurrence: 'monthly' },
        ];
        return item ? deserializeReminders(item) : initialReminders;
      } catch (error) {
        console.error('Error reading reminders from localStorage', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
       if (typeof window !== 'undefined') {
         window.localStorage.setItem(LOCAL_STORAGE_KEY, serializeReminders(reminders));
       }
    } catch (error) {
      console.error('Error saving reminders to localStorage', error);
    }
  }, [reminders]);

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
