
'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Target, Sparkles, Loader2 } from 'lucide-react';
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
import { expenseCategories } from '@/lib/categories';
import { useBudgets } from '@/context/budget-context';
import { ScrollArea } from '../ui/scroll-area';
import { useCurrency } from '@/context/currency-context';
import { useTransactions } from '@/context/transaction-context';
import { createBudget } from '@/ai/flows/create-budget-flow';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  budgets: z.record(z.coerce.number().min(0, 'Budget must be a positive number.')),
});

export function SetBudgetDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { budgets, setBudget } = useBudgets();
  const { currency } = useCurrency();
  const { transactions } = useTransactions();
  const [isGenerating, setIsGenerating] = useState(false);

  const canUseSmartBudget = true;

  const defaultValues = expenseCategories.reduce((acc, category) => {
    acc[category.value] = budgets[category.value] || 0;
    return acc;
  }, {} as Record<string, number>);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budgets: defaultValues,
    },
  });

  useEffect(() => {
    // Reset form values if budgets context or currency changes
    const newDefaults = expenseCategories.reduce((acc, category) => {
      acc[category.value] = budgets[category.value] || 0;
      return acc;
    }, {} as Record<string, number>);

    form.reset({ budgets: newDefaults });
  }, [budgets, currency, form, open]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    Object.entries(values.budgets).forEach(([category, amount]) => {
      // Only set budgets that have a value
      if (amount > 0) {
        setBudget(category, amount);
      }
    });

    toast({
      title: 'Budgets Updated!',
      description: 'Your new spending limits have been saved.',
    });
    setOpen(false);
  }

  const handleSmartBudget = async () => {
    setIsGenerating(true);
    try {
      const result = await createBudget({ transactions });
      const newBudgets = { ...form.getValues().budgets };
      
      let budgetsSet = 0;
      result.budget.forEach(item => {
        if(form.getValues().budgets.hasOwnProperty(item.category)) {
          newBudgets[item.category] = item.amount;
          budgetsSet++;
        }
      });
      
      form.setValue('budgets', newBudgets);

      if (budgetsSet > 0) {
         toast({
          title: 'Smart Budget Generated!',
          description: 'Your personalized budget has been filled in. Review and save.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Could Not Generate Budget',
          description: 'Not enough transaction data to create a budget. Add more expenses and try again.',
        });
      }

    } catch (error) {
      console.error("Error generating smart budget", error);
       toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to generate smart budget. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Target className="-ml-1 mr-2 h-4 w-4" />
          Set Budgets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Monthly Budgets</DialogTitle>
          <DialogDescription>
            Define spending limits for each category. Or, let AI create a budget for you based on your history.
          </DialogDescription>
        </DialogHeader>

        {canUseSmartBudget ? (
           <Button onClick={handleSmartBudget} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Smart Budget with AI
          </Button>
        ) : (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Unlock Smart Budgets!</AlertTitle>
            <AlertDescription>
              Upgrade to a paid plan to automatically generate a budget with AI.
            </AlertDescription>
          </Alert>
        )}

       
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-72 pr-6">
              <div className="space-y-4">
                {expenseCategories.map((category) => (
                  <FormField
                    key={category.value}
                    control={form.control}
                    name={`budgets.${category.value}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <category.icon className="h-4 w-4" />
                              {category.label}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="w-32"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button type="submit">Save Budgets</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    
