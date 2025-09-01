
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { PaymentMethod, PaymentMethodValues } from '@/lib/types';


const cardSchema = z.object({
  cardNumber: z.string().regex(/^[0-9]{16}$/, 'Please enter a valid 16-digit card number.'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Please use MM/YY format.'),
  cvc: z.string().regex(/^[0-9]{3,4}$/, 'Please enter a valid CVC.'),
});

const bankSchema = z.object({
    accountNumber: z.string().min(8, 'Account number is too short.'),
    routingNumber: z.string().min(8, 'Routing number is too short.'),
    bankName: z.string().min(1, 'Please enter the bank name.'),
});

const walletSchema = z.object({
    provider: z.string().min(1, 'Please select a provider.'),
    email: z.string().email('Please enter a valid email address.'),
});

const paymentMethodSchema = z.object({
  type: z.enum(['Card', 'Bank', 'Wallet']),
  autoPay: z.boolean(),
}).and(z.union([
    cardSchema.extend({ type: z.literal('Card') }),
    bankSchema.extend({ type: z.literal('Bank') }),
    walletSchema.extend({ type: z.literal('Wallet') }),
]));

export const baseDefaultValues: PaymentMethodValues = {
  type: 'Card',
  cardNumber: '',
  expiry: '',
  cvc: '',
  accountNumber: '',
  routingNumber: '',
  bankName: '',
  provider: '',
  email: '',
  autoPay: true,
};

interface PaymentMethodFormProps {
    editingMethod?: PaymentMethod | null;
    onSubmit: (values: PaymentMethodValues) => void;
    onCancel: () => void;
    isSubscriptionContext?: boolean;
}

export function PaymentMethodForm({ editingMethod, onSubmit, onCancel, isSubscriptionContext = false }: PaymentMethodFormProps) {
  const form = useForm<PaymentMethodValues>({
    resolver: (data, context, options) => {
        const type = data.type;
        const baseSchema = z.object({ type: z.enum(['Card', 'Bank', 'Wallet']), autoPay: z.boolean() });
        if (type === 'Card') return zodResolver(baseSchema.extend(cardSchema.shape).extend({ type: z.literal('Card') }))(data, context, options);
        if (type === 'Bank') return zodResolver(baseSchema.extend(bankSchema.shape).extend({ type: z.literal('Bank') }))(data, context, options);
        if (type === 'Wallet') return zodResolver(baseSchema.extend(walletSchema.shape).extend({ type: z.literal('Wallet') }))(data, context, options);
        return zodResolver(paymentMethodSchema)(data, context, options);
    },
    defaultValues: baseDefaultValues,
  });
  
  const paymentType = form.watch('type');

  useEffect(() => {
    let defaultValues: PaymentMethodValues = { ...baseDefaultValues };

    if (editingMethod) {
      defaultValues.type = editingMethod.type;
      defaultValues.autoPay = editingMethod.autoPay;
      
      switch (editingMethod.type) {
        case 'Card':
          // For security, we don't repopulate the full card number, only non-sensitive details
          defaultValues.expiry = editingMethod.expiry || '';
          break;
        case 'Bank':
          defaultValues.accountNumber = `••••••••${editingMethod.last4}`;
          defaultValues.bankName = editingMethod.bankName || '';
          break;
        case 'Wallet':
          defaultValues.provider = editingMethod.provider || '';
          defaultValues.email = editingMethod.email || '';
          break;
      }
    }
    form.reset(defaultValues);
  }, [editingMethod, form]);

  const handleSubmit = (values: PaymentMethodValues) => {
    onSubmit(values);
    form.reset(baseDefaultValues);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{editingMethod ? 'Edit' : 'Add'} Payment Method</DialogTitle>
        <DialogDescription>
          { isSubscriptionContext 
            ? "To continue, please add a payment method to your account."
            : (editingMethod ? 'Update your payment details.' : 'Select a payment type and enter the details.')
          }
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                      field.onChange(value);
                      form.reset({ ...baseDefaultValues, type: value as PaymentMethod['type'] }); // Reset form to clear irrelevant fields
                  }}
                  value={field.value}
                  disabled={!!editingMethod} // Prevent changing type when editing
                >
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a payment type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Bank">Bank Account</SelectItem>
                        <SelectItem value="Wallet">Digital Wallet</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {paymentType === 'Card' && (
            <>
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 9101 1121" {...field} autoComplete="cc-number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <FormField
                    control={form.control}
                    name="expiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} autoComplete="cc-exp" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                    <FormField
                    control={form.control}
                    name="cvc"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                            <Input placeholder="123" {...field} autoComplete="cc-csc" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              </div>
            </>
          )}

          {paymentType === 'Bank' && (
              <>
                <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl><Input placeholder="e.g. Bank of America" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl><Input placeholder="Your account number" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                    <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl><Input placeholder="Your routing number" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </>
          )}

          {paymentType === 'Wallet' && (
              <>
                <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Wallet Provider</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="PayPal">PayPal</SelectItem>
                            <SelectItem value="GCash">GCash</SelectItem>
                            <SelectItem value="Venmo">Venmo</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Wallet Email or Phone</FormLabel>
                        <FormControl><Input placeholder="Associated email or phone" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </>
          )}

          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
                </Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {isSubscriptionContext ? 'Save and Continue' : (editingMethod ? 'Save Changes' : 'Add Method')}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
