
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { useCurrency } from './currency-context';
import { rates } from '@/lib/currency-rates';

type Budgets = Record<string, number>;

interface BudgetContextType {
  budgets: Budgets;
  setBudget: (category: string, amount: number) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kitamo-budgets';

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const { currency } = useCurrency();
  const [budgets, setBudgets] = useState<Budgets>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage only on the client side
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        setBudgets(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading budgets from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Persist budgets to localStorage whenever they change, but only after initial load
    if (isLoaded) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(budgets));
      } catch (error) {
        console.error('Error saving budgets to localStorage', error);
      }
    }
  }, [budgets, isLoaded]);

  const setBudget = useCallback((category: string, amount: number) => {
    setBudgets((prev) => ({ ...prev, [category]: amount }));
  }, []);

  return (
    <BudgetContext.Provider value={{ budgets, setBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
};
