import type { Transaction, ReferredUser } from '@/lib/types';

export const transactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'Salary',
    amount: 5000,
    date: new Date('2024-07-01'),
    description: 'Monthly Salary',
  },
  {
    id: '2',
    type: 'expense',
    category: 'Rent',
    amount: 1500,
    date: new Date('2024-07-01'),
    description: 'Apartment Rent',
  },
  {
    id: '3',
    type: 'expense',
    category: 'Groceries',
    amount: 350,
    date: new Date('2024-07-05'),
    description: 'Weekly grocery shopping',
  },
  {
    id: '4',
    type: 'expense',
    category: 'Transport',
    amount: 120,
    date: new Date('2024-07-10'),
    description: 'Gasoline for car',
  },
  {
    id: '5',
    type: 'expense',
    category: 'Entertainment',
    amount: 75,
    date: new Date('2024-07-12'),
    description: 'Movie tickets',
  },
  {
    id: '6',
    type: 'income',
    category: 'Freelance',
    amount: 750,
    date: new Date('2024-07-15'),
    description: 'Web design project',
  },
  {
    id: '7',
    type: 'expense',
    category: 'Utilities',
    amount: 150,
    date: new Date('2024-07-20'),
    description: 'Electricity and Water bill',
  },
  {
    id: '8',
    type: 'expense',
    category: 'Shopping',
    amount: 200,
    date: new Date('2024-07-22'),
    description: 'New clothes',
  },
];

export const referredUsers: ReferredUser[] = [
    {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        signupDate: new Date('2024-06-15'),
        status: 'Active',
    },
    {
        id: '2',
        name: 'Bob Williams',
        email: 'bob@example.com',
        signupDate: new Date('2024-06-20'),
        status: 'Active',
    },
    {
        id: '3',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        signupDate: new Date('2024-07-01'),
        status: 'Pending',
    },
    {
        id: '4',
        name: 'Diana Prince',
        email: 'diana@example.com',
        signupDate: new Date('2024-07-05'),
        status: 'Active',
    }
]
