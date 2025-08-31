
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useReminders } from '@/context/reminder-context';
import { useCurrency } from '@/context/currency-context';
import { Bell, Calendar, Repeat } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { SetReminderDialog } from '../transactions/set-reminder-dialog';

export function UpcomingBillsCard() {
  const { reminders } = useReminders();
  const { formatCurrency } = useCurrency();

  const sortedReminders = React.useMemo(() => {
    return [...reminders]
        .filter(r => new Date(r.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5); // Show up to 5 upcoming bills
  }, [reminders]);

  if (sortedReminders.length === 0) {
    return (
       <Card className="flex flex-col items-center justify-center text-center p-6 bg-muted/40">
        <CardHeader>
           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4">
            <Bell className="h-6 w-6 text-primary" />
           </div>
          <CardTitle>No Upcoming Bills</CardTitle>
          <CardDescription>
            You have no reminders set for the future. Set a reminder to stay on top of your bills.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <SetReminderDialog />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Bills & Subscriptions</CardTitle>
        <CardDescription>
          A look at your scheduled payments for the near future.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {sortedReminders.map(reminder => (
            <li key={reminder.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-5 w-5 text-muted-foreground"/>
                </div>
                <div>
                    <p className="font-semibold">{reminder.title}</p>
                    <p className="text-sm text-muted-foreground">
                        Due {formatDistanceToNow(new Date(reminder.date), { addSuffix: true })}
                        {reminder.recurrence !== 'none' && (
                            <span className='ml-2 inline-flex items-center gap-1'>
                                <Repeat className="h-3 w-3"/>
                                {reminder.recurrence}
                            </span>
                        )}
                    </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{formatCurrency(reminder.amount)}</p>
                <p className="text-xs text-muted-foreground">{reminder.category}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
