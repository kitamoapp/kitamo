
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Transaction } from '@/lib/types';
import { transactions as initialTransactions } from '@/lib/data';

// For the purpose of this demo, we're converting Date objects to ISO strings
// because they are not serializable and can cause issues with React state.
const transactionsWithSerializableDates = initialTransactions.map(t => ({
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

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsWithSerializableDates);

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
