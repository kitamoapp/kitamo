import { AppLayout } from '@/components/app-layout';
import { AddTransactionDialog } from '@/components/transactions/add-transaction-dialog';
import { TransactionsTable } from '@/components/transactions/transactions-table';

export default function TransactionsPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <AddTransactionDialog />
      </div>
      <div className="mt-6">
        <TransactionsTable />
      </div>
    </AppLayout>
  );
}
