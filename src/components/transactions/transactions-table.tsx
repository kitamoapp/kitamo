
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCurrency } from '@/context/currency-context';
import { useTransactions } from '@/context/transaction-context';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { EditTransactionDialog } from './edit-transaction-dialog';
import { useState, useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

export function TransactionsTable() {
  const { formatCurrency } = useCurrency();
  const { transactions, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<string | null>(null);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);


  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDeleteInitiate = (id: string) => {
    setTransactionToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
    }
    setShowDeleteAlert(false);
    setTransactionToDelete(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Analysis</CardTitle>
          <CardDescription>
            The data powering your financial consultation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile View - Card List */}
          <div className="md:hidden">
              <div className="space-y-4">
                  {sortedTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center gap-4 rounded-lg border p-4">
                           <div className="flex-1 space-y-1">
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-muted-foreground">{transaction.category}</p>
                                <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                           </div>
                           <div className="flex flex-col items-end space-y-1">
                               <p className={cn(
                                'font-medium',
                                transaction.type === 'income'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                )}>
                                {transaction.type === 'income' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                                </p>
                                <Badge
                                variant={
                                    transaction.type === 'income' ? 'default' : 'secondary'
                                }
                                className={cn(
                                    'text-xs',
                                    transaction.type === 'income'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300'
                                )}
                                >
                                {transaction.type}
                                </Badge>
                           </div>
                           <div>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                                    Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                    onClick={() => handleDeleteInitiate(transaction.id)}
                                    className="text-red-600"
                                    >
                                    Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                           </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === 'income' ? 'default' : 'secondary'
                        }
                        className={cn(
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300'
                            : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300'
                        )}
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-medium',
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      )}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteInitiate(transaction.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          onOpenChange={(open) => {
            if (!open) {
              setEditingTransaction(null);
            }
          }}
        />
      )}

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              transaction from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteAlert(false);
                setTransactionToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
