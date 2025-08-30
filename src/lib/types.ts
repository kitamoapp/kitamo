
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string; // Changed to string to be serializable
  description: string;
};

export type ReferredUser = {
  id: string;
  name: string;
  email: string;
  signupDate: Date;
  status: 'Active' | 'Pending';
};

export type Currency = 'USD' | 'EUR' | 'JPY' | 'GBP' | 'PHP';

export type Category = {
  value: string;
  label: string;
  icon: React.ElementType;
};
