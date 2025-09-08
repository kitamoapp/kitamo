
'use client';

import * as React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Bell,
  Wallet,
} from 'lucide-react';
import { DayPicker, type DateFormatter } from 'react-day-picker';
import { format, isSameDay } from 'date-fns';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useTransactions } from '@/context/transaction-context';
import type { Transaction, Reminder } from '@/lib/types';
import { useCurrency } from '@/context/currency-context';
import { useReminders } from '@/context/reminder-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

const formatDay: DateFormatter = (day) => day.getDate().toString();

export function FinancialCalendar() {
  const { transactions } = useTransactions();
  const { reminders } = useReminders();
  const { formatCurrency } = useCurrency();

  const [month, setMonth] = React.useState(new Date());
  const [selectedDay, setSelectedDay] = React.useState<Date>(new Date());

  const dailyData = React.useMemo(() => {
    const data: Record<string, { income: number; expense: number, reminders: Reminder[] }> = {};
    
    transactions.forEach(t => {
      const day = format(new Date(t.date), 'yyyy-MM-dd');
      if (!data[day]) data[day] = { income: 0, expense: 0, reminders: [] };
      if (t.type === 'income') data[day].income += t.amount;
      else data[day].expense += t.amount;
    });

    reminders.forEach(r => {
        const day = format(new Date(r.date), 'yyyy-MM-dd');
        if (!data[day]) data[day] = { income: 0, expense: 0, reminders: [] };
        data[day].reminders.push(r);
    })

    return data;
  }, [transactions, reminders]);

  const selectedDayDetails = React.useMemo(() => {
    const dayKey = format(selectedDay, 'yyyy-MM-dd');
    return {
        transactions: transactions.filter(t => isSameDay(new Date(t.date), selectedDay)),
        reminders: reminders.filter(r => isSameDay(new Date(r.date), selectedDay))
    }
  }, [selectedDay, transactions, reminders]);

  const DayWithDetails = ({ date, displayMonth }: { date: Date; displayMonth: Date }) => {
    const dayKey = format(date, 'yyyy-MM-dd');
    const data = dailyData[dayKey];

    const hasReminders = data?.reminders.length > 0;
    const hasTransactions = data?.income > 0 || data?.expense > 0;
    const isToday = isSameDay(date, new Date());
    const isSelected = isSameDay(date, selectedDay);
    const isThisMonth = date.getMonth() === displayMonth.getMonth();

    return (
      <div
        className={cn(
          'h-full w-full relative p-2 flex flex-col justify-between text-left',
          !isThisMonth && 'text-muted-foreground opacity-50',
          isSelected && 'bg-primary/10'
        )}
      >
        <div className={cn(
            'flex items-center justify-center h-6 w-6 rounded-full text-sm absolute top-1 right-1',
            isToday && 'bg-primary text-primary-foreground',
         )}>
            {format(date, 'd')}
        </div>
        
        {hasTransactions || hasReminders ? (
          <div className="space-y-1 mt-6">
            {data.expense > 0 && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                    <TrendingDown className="h-3 w-3" /> 
                    {formatCurrency(data.expense)}
                </div>
            )}
            {data.income > 0 && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    {formatCurrency(data.income)}
                </div>
            )}
            {hasReminders && (
                 <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Bell className="h-3 w-3" /> 
                    {data.reminders.length} Reminder{data.reminders.length > 1 ? 's' : ''}
                </div>
            )}
          </div>
        ) : (
            <div className="h-12"></div>
        )}
      </div>
    );
  };
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <DayPicker
          month={month}
          onMonthChange={setMonth}
          onDayClick={setSelectedDay}
          formatters={{ formatDay }}
          selected={selectedDay}
          showOutsideDays
          className="w-full"
          classNames={{
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4 w-full',
            table: 'w-full border-collapse',
            head_row: 'flex border-b',
            head_cell: 'w-full text-muted-foreground rounded-md font-normal text-sm pb-2',
            row: 'flex w-full mt-2 gap-2',
            cell: 'flex-1 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 h-28 border rounded-md',
            day: cn(
              buttonVariants({ variant: 'ghost' }),
              'h-full w-full p-0 font-normal aria-selected:opacity-100'
            ),
            day_selected:
              'bg-primary/10 text-primary-foreground hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary',
            day_today: 'text-accent-foreground',
            day_outside: 'text-muted-foreground opacity-50',
            day_disabled: 'text-muted-foreground opacity-50',
            day_range_middle:
              'aria-selected:bg-accent aria-selected:text-accent-foreground',
            day_hidden: 'invisible',
          }}
          components={{
            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
            IconRight: () => <ChevronRight className="h-4 w-4" />,
            DayContent: DayWithDetails,
          }}
        />
      </div>

      <div className="md:col-span-1">
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle>{format(selectedDay, 'MMMM d, yyyy')}</CardTitle>
                <CardDescription>Events for this day</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96">
                    <div className="space-y-6 pr-4">
                        {selectedDayDetails.reminders.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2"><Bell className="h-4 w-4" /> Reminders</h4>
                                 <ul className="space-y-3">
                                  {selectedDayDetails.reminders.map(reminder => (
                                    <li key={`reminder-${reminder.id}`} className="flex justify-between items-center text-sm">
                                      <span>{reminder.title}</span>
                                      <span className="font-medium">{formatCurrency(reminder.amount)}</span>
                                    </li>
                                  ))}
                                </ul>
                            </div>
                        )}

                        {selectedDayDetails.transactions.length > 0 && selectedDayDetails.reminders.length > 0 && <Separator />}

                        {selectedDayDetails.transactions.length > 0 && (
                             <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2"><Wallet className="h-4 w-4" /> Transactions</h4>
                                <ul className="space-y-3">
                                  {selectedDayDetails.transactions.map(t => (
                                    <li key={`txn-${t.id}`} className="flex justify-between items-center text-sm">
                                      <div>
                                        <p>{t.description}</p>
                                        <p className='text-xs text-muted-foreground'>{t.category}</p>
                                      </div>
                                      <span className={cn(
                                        'font-medium',
                                        t.type === 'income' ? 'text-green-600' : 'text-destructive'
                                      )}>{formatCurrency(t.amount)}</span>
                                    </li>
                                  ))}
                                </ul>
                            </div>
                        )}

                        {selectedDayDetails.transactions.length === 0 && selectedDayDetails.reminders.length === 0 && (
                             <div className="text-center text-muted-foreground pt-10">
                                <p>No events for this day.</p>
                             </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
