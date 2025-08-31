
'use client';

import { AppLayout } from '@/components/app-layout';
import { TransactionsTable } from '@/components/transactions/transactions-table';

export default function TransactionsPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <TransactionsTable />
      </div>
    </AppLayout>
  );
}
