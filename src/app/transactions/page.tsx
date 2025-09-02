
'use client';

import { AppLayout } from '@/components/app-layout';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { AddTransactionDialog } from '@/components/transactions/add-transaction-dialog';

export default function TransactionsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
            <p className="text-muted-foreground">
              View and manage all your financial activities.
            </p>
          </div>
          <AddTransactionDialog />
        </div>
        <TransactionsTable />
      </div>
    </AppLayout>
  );
}
