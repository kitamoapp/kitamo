

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
import { MoreHorizontal, Receipt, Trash2, Bookmark, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Checkbox } from '../ui/checkbox';
import { TransactionDetailsDialog } from './transaction-details-dialog';

export function TransactionsTable() {
  const { formatCurrency } = useCurrency();
  const { transactions, deleteTransaction, deleteMultipleTransactions, toggleBookmark } = useTransactions();
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [detailsTransaction, setDetailsTransaction] =
    useState<Transaction | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };
  
  const handleViewDetails = (transaction: Transaction) => {
    setDetailsTransaction(transaction);
  }

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

  const handleSelectRow = (id: string) => {
    setSelectedRows(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
        setSelectedRows(new Set(sortedTransactions.map(t => t.id)));
    } else {
        setSelectedRows(new Set());
    }
  }
  
  const handleDeleteSelected = () => {
    deleteMultipleTransactions(Array.from(selectedRows));
    setSelectedRows(new Set());
    setShowDeleteAlert(false);
  }

  const numSelected = selectedRows.size;

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                A log of your income and expenses.
              </CardDescription>
            </div>
             {numSelected > 0 && (
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteAlert(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ({numSelected})
                </Button>
            )}
        </CardHeader>
        <CardContent>
          {sortedTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center py-10">
                <Receipt className="h-16 w-16 text-muted-foreground/50" />
                <p className="text-muted-foreground">You have no transactions yet.</p>
                <p className="text-sm text-muted-foreground">Click "Add Transaction" to get started.</p>
            </div>
          ) : (
            <>
              {/* Mobile View - Card List */}
              <div className="md:hidden">
                  <div className="space-y-4">
                      {sortedTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center gap-4 rounded-lg border p-4">
                              <Checkbox
                                checked={selectedRows.has(transaction.id)}
                                onCheckedChange={() => handleSelectRow(transaction.id)}
                                aria-label="Select row"
                              />
                              <div className="flex-1 space-y-1">
                                <div className='flex items-center gap-2'>
                                  <button onClick={() => toggleBookmark(transaction.id)} className="flex-shrink-0">
                                      <Bookmark className={cn("h-4 w-4 text-muted-foreground transition-colors", transaction.bookmarked && "fill-amber-400 text-amber-500")} />
                                  </button>
                                  <p className="font-medium">{transaction.description}</p>
                                </div>
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
                                      <DropdownMenuItem onClick={() => handleViewDetails(transaction)}>
                                          <FileText className="mr-2 h-4 w-4" />
                                          View Details
                                      </DropdownMenuItem>
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
                      <TableHead className="w-[50px]">
                        <Checkbox
                           checked={numSelected === sortedTransactions.length && sortedTransactions.length > 0 ? true : (numSelected > 0 ? 'indeterminate' : false)}
                           onCheckedChange={handleSelectAll}
                           aria-label="Select all"
                        />
                      </TableHead>
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
                      <TableRow key={transaction.id} data-state={selectedRows.has(transaction.id) ? "selected" : ""}>
                        <TableCell>
                            <Checkbox
                                checked={selectedRows.has(transaction.id)}
                                onCheckedChange={() => handleSelectRow(transaction.id)}
                                aria-label="Select row"
                            />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className='flex items-center gap-2'>
                            <button onClick={() => toggleBookmark(transaction.id)} className="flex-shrink-0">
                                <Bookmark className={cn("h-4 w-4 text-muted-foreground transition-colors", transaction.bookmarked && "fill-amber-400 text-amber-500")} />
                            </button>
                            {transaction.description}
                          </div>
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
                                <DropdownMenuItem onClick={() => handleViewDetails(transaction)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
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
            </>
          )}
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
      
      {detailsTransaction && (
        <TransactionDetailsDialog 
            transaction={detailsTransaction}
            onOpenChange={(open) => {
                if (!open) {
                    setDetailsTransaction(null);
                }
            }}
        />
      )}

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete 
              {numSelected > 0 ? ` ${numSelected} selected transactions` : ' this transaction'} from your records.
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
            <AlertDialogAction onClick={numSelected > 0 && !transactionToDelete ? handleDeleteSelected : handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
