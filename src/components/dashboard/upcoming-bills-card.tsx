
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
import { Bell, Calendar, MoreHorizontal, Repeat, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { SetReminderDialog } from '../transactions/set-reminder-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Edit, Edit2 } from 'lucide-react';
import type { Reminder } from '@/lib/types';
import { EditReminderDialog } from '../transactions/edit-reminder-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';


export function UpcomingBillsCard() {
  const { reminders, deleteReminder } = useReminders();
  const { formatCurrency } = useCurrency();
  const [editingReminder, setEditingReminder] = React.useState<Reminder | null>(null);
  const [deletingReminder, setDeletingReminder] = React.useState<Reminder | null>(null);

  const sortedReminders = React.useMemo(() => {
    return [...reminders]
        .filter(r => new Date(r.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5); // Show up to 5 upcoming bills
  }, [reminders]);

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
  };
  
  const handleDeleteInitiate = (reminder: Reminder) => {
    setDeletingReminder(reminder);
  }

  const handleDeleteConfirm = () => {
    if (deletingReminder) {
      deleteReminder(deletingReminder.id);
    }
    setDeletingReminder(null);
  }

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
    <>
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
              <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(reminder.amount)}</p>
                    <p className="text-xs text-muted-foreground">{reminder.category}</p>
                  </div>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(reminder)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteInitiate(reminder)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>

    {editingReminder && (
      <EditReminderDialog 
        reminder={editingReminder}
        onOpenChange={(open) => {
          if (!open) setEditingReminder(null);
        }}
      />
    )}

    {deletingReminder && (
       <AlertDialog open={!!deletingReminder} onOpenChange={(open) => !open && setDeletingReminder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the reminder for "{deletingReminder.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )}
    </>
  );
}
