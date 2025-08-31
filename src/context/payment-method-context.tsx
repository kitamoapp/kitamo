
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
import { baseDefaultValues } from '@/components/payment-method-form';

interface PaymentMethodContextType {
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (values: PaymentMethodValues) => void;
  updatePaymentMethod: (id: string, values: PaymentMethodValues) => void;
  deletePaymentMethod: (id: string) => void;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kitamo-payment-methods';

const initialPaymentMethods: PaymentMethod[] = [
    { id: 'card-1', type: 'Card', last4: '4242', expiry: '12/26', brand: 'Visa', cardNumber: '4242424242424242' }
];

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
            return {
                id,
                type: 'Card',
                last4: values.cardNumber.slice(-4),
                expiry: values.expiry,
                brand: values.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
                cardNumber: values.cardNumber,
            };
        case 'Bank':
            return {
                id,
                type: 'Bank',
                last4: values.accountNumber.slice(-4),
                bankName: values.bankName,
                accountNumber: values.accountNumber,
                routingNumber: values.routingNumber
            };
        case 'Wallet':
            return {
                id,
                type: 'Wallet',
                provider: values.provider,
                email: values.email,
            };
    }
  }

  const addPaymentMethod = useCallback((values: PaymentMethodValues) => {
    const newMethod = createPaymentMethodFromValues(uuidv4(), values);
    setPaymentMethods(prev => [...prev, newMethod]);
  }, []);

  const updatePaymentMethod = useCallback((id: string, values: PaymentMethodValues) => {
    const updatedMethod = createPaymentMethodFromValues(id, values);
    setPaymentMethods(prev => prev.map(p => (p.id === id ? updatedMethod : p)));
  }, []);

  const deletePaymentMethod = useCallback((id: string) => {
    setPaymentMethods(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <PaymentMethodContext.Provider value={{ paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod }}>
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
