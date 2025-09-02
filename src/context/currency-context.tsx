
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { Currency } from '@/lib/types';
import { rates } from '@/lib/currency-rates';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
  convertAndFormatCurrency: (amount: number, from?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kitamo-currency';

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('PHP');

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item && (item === 'USD' || item === 'EUR' || item === 'JPY' || item === 'GBP' || item === 'PHP')) {
        setCurrency(item as Currency);
      }
    } catch (error) {
      console.error('Error reading currency from localStorage', error);
    }
  }, []);

  const handleSetCurrency = (newCurrency: Currency) => {
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, newCurrency);
    } catch (error) {
        console.error('Error saving currency to localStorage', error);
    }
    setCurrency(newCurrency);
  }

  const convertCurrency = (amount: number, from: Currency, to: Currency) => {
    const fromRate = rates[from];
    const toRate = rates[to];
    // Convert the amount to the base currency (USD) first, then to the target currency
    const amountInUsd = amount / fromRate;
    return amountInUsd * toRate;
  };
  
  const formatCurrency = useCallback((amount: number) => {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: currency,
    };

    // Use a more compact notation for JPY as it has no decimals
    if (currency === 'JPY') {
        options.minimumFractionDigits = 0;
        options.maximumFractionDigits = 0;
    }

    return new Intl.NumberFormat('en-US', options).format(amount);
  }, [currency]);

  const convertAndFormatCurrency = useCallback((amount: number, from: Currency = 'PHP') => {
    const convertedAmount = convertCurrency(amount, from, currency);
    return formatCurrency(convertedAmount);
  }, [currency, formatCurrency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatCurrency, convertAndFormatCurrency }}>
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
