
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
  const [budgets, setBudgets] = useState<Budgets>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!item) return {};

        const storedData = JSON.parse(item);
        
        // Convert stored budget amounts to the current currency
        const storedCurrency = storedData.currency || 'USD';
        const convertedBudgets: Budgets = {};
        const fromRate = rates[storedCurrency];
        const toRate = rates[currency];

        for (const category in storedData.budgets) {
            const amountInBase = storedData.budgets[category] / fromRate;
            convertedBudgets[category] = amountInBase * toRate;
        }
        return convertedBudgets;

      } catch (error) {
        console.error('Error reading budgets from localStorage', error);
        return {};
      }
    }
    return {};
  });


  useEffect(() => {
    // Persist budgets to localStorage whenever they change
    try {
       if (typeof window !== 'undefined') {
         const dataToStore = {
            currency,
            budgets
         };
         window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
       }
    } catch (error) {
      console.error('Error saving budgets to localStorage', error);
    }
  }, [budgets, currency]);

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
