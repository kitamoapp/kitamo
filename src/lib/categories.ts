
import {
  Briefcase,
  Car,
  Gift,
  Heart,
  Home,
  ShoppingBag,
  Utensils,
} from 'lucide-react';
import type { Category } from './types';

export const incomeCategories: Category[] = [
  { value: 'Salary', label: 'Salary', icon: Briefcase },
  { value: 'Freelance', label: 'Freelance', icon: Briefcase },
  { value: 'Investment', label: 'Investment', icon: Briefcase },
  { value: 'Other', label: 'Other', icon: Gift },
];

export const expenseCategories: Category[] = [
  { value: 'Groceries', label: 'Groceries', icon: Utensils },
  { value: 'Rent', label: 'Rent', icon: Home },
  { value: 'Transport', label: 'Transport', icon: Car },
  { value: 'Entertainment', label: 'Entertainment', icon: Gift },
  { value: 'Shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'Health', label: 'Health', icon: Heart },
  { value: 'Utilities', label: 'Utilities', icon: Home },
  { value: 'Other', label: 'Other', icon: Gift },
];
