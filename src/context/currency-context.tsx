
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Currency } from '@/lib/types';
import { rates } from '@/lib/currency-rates';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
  convertAndFormatCurrency: (amount: number, from?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('USD');

  const convertCurrency = (amount: number, from: Currency, to: Currency) => {
    const fromRate = rates[from];
    const toRate = rates[to];
    // Convert the amount to the base currency (USD) first, then to the target currency
    const amountInUsd = amount / fromRate;
    return amountInUsd * toRate;
  };
  
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }, [currency]);

  const convertAndFormatCurrency = useCallback((amount: number, from: Currency = 'USD') => {
    const convertedAmount = convertCurrency(amount, from, currency);
    return formatCurrency(convertedAmount);
  }, [currency, formatCurrency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency, convertAndFormatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
