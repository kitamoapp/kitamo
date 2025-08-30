import { transactions } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Car,
  Home,
  Utensils,
  ShoppingBag,
  Heart,
  Briefcase,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../ui/button';

const categoryIcons: { [key: string]: React.ElementType } = {
  Groceries: Utensils,
  Rent: Home,
  Transport: Car,
  Entertainment: Gift,
  Shopping: ShoppingBag,
  Health: Heart,
  Salary: Briefcase,
  Freelance: Briefcase,
  Utilities: Home,
  default: Briefcase,
};

export function RecentTransactions() {
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your last 5 transactions.</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
            <Link href="/transactions">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => {
            const Icon =
              categoryIcons[transaction.category] || categoryIcons.default;
            return (
              <div
                key={transaction.id}
                className="flex items-center"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback
                    className={cn(
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600',
                       'dark:bg-transparent'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category}
                  </p>
                </div>
                <div
                  className={cn(
                    'font-medium',
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  )}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
