
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BellRing, CalendarIcon, Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useReminders } from '@/context/reminder-context';
import { useTransactions } from '@/context/transaction-context';
import { getSmartSuggestion } from '@/ai/flows/smart-suggestion-flow';
import { expenseCategories } from '@/lib/categories';

const formSchema = z.object({
  title: z.string().min(1, 'Please enter a title for the reminder.'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0.'),
  category: z.string().min(1, 'Please select a category.'),
  date: z.date({ required_error: 'Please select a date.' }),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly']),
});

export function SetReminderDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { addReminder } = useReminders();
  const { transactions } = useTransactions();
  const [isFetchingSuggestion, setIsFetchingSuggestion] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      amount: 0,
      category: '',
      date: new Date(),
      recurrence: 'none',
    },
  });

  const titleValue = form.watch('title');
  const [debouncedTitle] = useDebounce(titleValue, 500);

  const availableCategories = useMemo(() => {
    return expenseCategories;
  }, []);

  const fetchSuggestion = useCallback(async (title: string) => {
    if (title.length < 5) return;
    setIsFetchingSuggestion(true);
    try {
      const suggestion = await getSmartSuggestion({
        title,
        transactions,
      });
      if (suggestion) {
        if (suggestion.category && availableCategories.some(c => c.value === suggestion.category)) {
          form.setValue('category', suggestion.category, { shouldValidate: true });
        }
        if (suggestion.amount) {
          form.setValue('amount', suggestion.amount, { shouldValidate: true });
        }
      }
    } catch (error) {
      console.error('Failed to fetch smart suggestion:', error);
    } finally {
      setIsFetchingSuggestion(false);
    }
  }, [transactions, form, availableCategories]);

  useEffect(() => {
    if (debouncedTitle) {
      fetchSuggestion(debouncedTitle);
    }
  }, [debouncedTitle, fetchSuggestion]);

  // Clear category when title changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title') {
        form.setValue('category', '', { shouldValidate: false });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    addReminder({
      ...values,
      id: crypto.randomUUID(),
      date: values.date.toISOString(),
    });

    toast({
      title: 'Reminder Set!',
      description: `You will be reminded to "${values.title}".`,
    });
    form.reset({
      title: '',
      amount: 0,
      category: '',
      date: new Date(),
      recurrence: 'none',
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BellRing className="-ml-1 mr-2 h-4 w-4" />
          Set Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set a Reminder</DialogTitle>
          <DialogDescription>
            Schedule a reminder for a future expense. We'll suggest details based on your past transactions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input placeholder="e.g., Pay rent" {...field} />
                    </FormControl>
                    {isFetchingSuggestion && (
                      <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              <div className="flex items-center">
                                <cat.icon className="mr-2 h-4 w-4" />
                                {cat.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

             <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Reminder Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurrence</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recurrence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Does not repeat</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save Reminder</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
