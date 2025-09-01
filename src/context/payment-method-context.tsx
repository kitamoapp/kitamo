
'use client';

import React, { 
    createContext, 
    useContext, 
    useState, 
    ReactNode, 
    useEffect, 
    useCallback 
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { PaymentMethod, PaymentMethodValues } from '@/lib/types';

interface PaymentMethodContextType {
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (values: PaymentMethodValues) => PaymentMethod;
  updatePaymentMethod: (id: string, values: PaymentMethodValues) => void;
  deletePaymentMethod: (id: string) => void;
  toggleAutoPay: (id: string, enabled: boolean) => void;
  isLoaded: boolean;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kitamo-payment-methods';

const initialPaymentMethods: PaymentMethod[] = [];

export const PaymentMethodProvider = ({ children }: { children: ReactNode }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        setPaymentMethods(JSON.parse(item));
      } else {
        // Only set initial data if local storage is empty on first load.
        setPaymentMethods(initialPaymentMethods);
      }
    } catch (error) {
      console.error('Error reading payment methods from localStorage', error);
      setPaymentMethods(initialPaymentMethods);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(paymentMethods));
      } catch (error) {
        console.error('Error saving payment methods to localStorage', error);
      }
    }
  }, [paymentMethods, isLoaded]);

  const createPaymentMethodFromValues = (id: string, values: PaymentMethodValues): PaymentMethod => {
     switch (values.type) {
        case 'Card':
            // In a real app, you would send the full card number to a PSP, not store it.
            // We only store non-sensitive parts.
            if (!/^\d{16}$/.test(values.cardNumber) && !values.cardNumber.includes('•')) {
                throw new Error("Invalid card number for brand detection");
            }
            return {
                id,
                type: 'Card',
                last4: values.cardNumber.slice(-4),
                expiry: values.expiry,
                brand: values.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
                autoPay: values.autoPay,
            };
        case 'Bank':
            return {
                id,
                type: 'Bank',
                last4: values.accountNumber.slice(-4),
                bankName: values.bankName,
                autoPay: values.autoPay,
            };
        case 'Wallet':
            return {
                id,
                type: 'Wallet',
                provider: values.provider,
                email: values.email,
                autoPay: values.autoPay,
            };
    }
  }

  const addPaymentMethod = useCallback((values: PaymentMethodValues): PaymentMethod => {
    const newMethod = createPaymentMethodFromValues(uuidv4(), values);
    setPaymentMethods(prev => [...prev, newMethod]);
    return newMethod;
  }, []);

  const updatePaymentMethod = useCallback((id: string, values: PaymentMethodValues) => {
    const updatedMethod = createPaymentMethodFromValues(id, values);
    setPaymentMethods(prev => prev.map(p => (p.id === id ? updatedMethod : p)));
  }, []);

  const deletePaymentMethod = useCallback((id: string) => {
    setPaymentMethods(prev => prev.filter(p => p.id !== id));
  }, []);
  
  const toggleAutoPay = useCallback((id: string, enabled: boolean) => {
    setPaymentMethods(prev => prev.map(p => p.id === id ? { ...p, autoPay: enabled } : p));
  }, []);

  return (
    <PaymentMethodContext.Provider value={{ paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, toggleAutoPay, isLoaded }}>
      {children}
    </PaymentMethodContext.Provider>
  );
};

export const usePaymentMethods = () => {
  const context = useContext(PaymentMethodContext);
  if (context === undefined) {
    throw new Error('usePaymentMethods must be used within a PaymentMethodProvider');
  }
  return context;
};
