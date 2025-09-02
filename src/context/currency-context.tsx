
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { Currency } from '@/lib/types';
import { rates } from '@/lib/currency-rates';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number, currencyCode?: Currency) => string;
  convertAndFormatCurrency: (amount: number, from?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kitamo-display-currency';

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>('PHP');

  useEffect(() => {
    const savedDisplayCurrency = localStorage.getItem(LOCAL_STORAGE_KEY) as Currency | null;
    if (savedDisplayCurrency) {
      setDisplayCurrency(savedDisplayCurrency);
    }
  }, []);

  const handleSetCurrency = (newCurrency: Currency) => {
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, newCurrency);
    } catch (error) {
        console.error('Error saving currency to localStorage', error);
    }
    setDisplayCurrency(newCurrency);
  }

  const convertCurrency = (amount: number, from: Currency, to: Currency) => {
    const fromRate = rates[from];
    const toRate = rates[to];
    // Convert the amount to the base currency (USD) first, then to the target currency
    const amountInUsd = amount / fromRate;
    return amountInUsd * toRate;
  };
  
  const formatCurrency = useCallback((amount: number, currencyCode?: Currency) => {
    const code = currencyCode || displayCurrency;
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: code,
    };

    if (code === 'JPY') {
        options.minimumFractionDigits = 0;
        options.maximumFractionDigits = 0;
    }

    return new Intl.NumberFormat('en-US', options).format(amount);
  }, [displayCurrency]);

  const convertAndFormatCurrency = useCallback((amount: number, from: Currency = 'PHP') => {
    const convertedAmount = convertCurrency(amount, from, displayCurrency);
    return formatCurrency(convertedAmount, displayCurrency);
  }, [displayCurrency, formatCurrency]);

  return (
    <CurrencyContext.Provider value={{ currency: displayCurrency, setCurrency: handleSetCurrency, formatCurrency, convertAndFormatCurrency }}>
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
