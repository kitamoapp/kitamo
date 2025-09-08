
'use client';

import { AppLayout } from '@/components/app-layout';
import { FinancialCalendar } from '@/components/calendar/financial-calendar';

export default function CalendarPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Calendar</h1>
          <p className="text-muted-foreground">
            A day-by-day view of your transactions and upcoming bills.
          </p>
        </div>
        <FinancialCalendar />
      </div>
    </AppLayout>
  );
}
