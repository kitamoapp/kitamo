export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: Date;
  description: string;
};

export type ReferredUser = {
  id: string;
  name: string;
  email: string;
  signupDate: Date;
  status: 'Active' | 'Pending';
};
