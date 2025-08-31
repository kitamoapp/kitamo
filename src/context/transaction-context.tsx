
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Transaction } from '@/lib/types';
import { transactions as initialTransactions } from '@/lib/data';

// Correctly serialize the initial data before it's used anywhere.
const serializedInitialTransactions = initialTransactions.map(t => ({
  ...t,
  date: t.date.toISOString(),
}));

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kitamo-transactions';


export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with the pre-serialized data. This is safe for SSR.
  const [transactions, setTransactions] = useState<Transaction[]>(serializedInitialTransactions);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage only on the client side.
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      // Only set state from localStorage if it exists, otherwise keep the initial data.
      if (item) {
        setTransactions(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading transactions from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever transactions change, but only after initial load.
  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
      } catch (error) {
        console.error('Error saving transactions to localStorage', error);
      }
    }
  }, [transactions, isLoaded]);


  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
