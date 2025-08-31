
'use client';

import { useState } from 'react';
import { PlusCircle, Edit, Trash2, CreditCard, Landmark, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePaymentMethods } from '@/context/payment-method-context';
import type { PaymentMethod, PaymentMethodValues } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PaymentMethodForm } from '@/components/payment-method-form';

export function PaymentMethodsCard() {
  const { toast } = useToast();
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = usePaymentMethods();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showDeletePaymentAlert, setShowDeletePaymentAlert] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<string | null>(null);

  const handleOpenPaymentDialog = (method: PaymentMethod | null) => {
    setEditingPaymentMethod(method);
    setShowPaymentDialog(true);
  }

  const handlePaymentFormSubmit = (values: PaymentMethodValues) => {
    if (editingPaymentMethod) {
      updatePaymentMethod(editingPaymentMethod.id, values);
      toast({
          title: 'Payment Method Updated',
          description: `Your ${values.type} details have been updated.`
      });
    } else {
      addPaymentMethod(values);
      toast({
          title: 'Payment Method Added',
          description: `Your ${values.type} has been successfully added.`
      });
    }
    setShowPaymentDialog(false);
    setEditingPaymentMethod(null);
  }

  const handleDeletePaymentInitiate = (id: string) => {
    setPaymentMethodToDelete(id);
    setShowDeletePaymentAlert(true);
  }

  const handleDeletePaymentConfirm = () => {
    if (paymentMethodToDelete) {
        deletePaymentMethod(paymentMethodToDelete);
        toast({
            title: 'Payment Method Removed',
            description: 'The selected payment method has been deleted.'
        });
    }
    setShowDeletePaymentAlert(false);
    setPaymentMethodToDelete(null);
  }

  const getPaymentMethodIcon = (type: PaymentMethod['type']) => {
      switch (type) {
          case 'Card': return <CreditCard className="h-6 w-6" />;
          case 'Bank': return <Landmark className="h-6 w-6" />;
          case 'Wallet': return <Wallet className="h-6 w-6" />;
          default: return <CreditCard className="h-6 w-6" />;
      }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your saved payment methods for subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map(method => (
            <div key={method.id} className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 rounded-lg border p-4">
              <div className="flex items-center gap-4">
                {getPaymentMethodIcon(method.type)}
                <div>
                  {method.type === 'Card' && <p className="font-semibold">{method.brand} ending in {method.last4}</p>}
                  {method.type === 'Card' && <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>}
                  {method.type === 'Bank' && <p className="font-semibold">{method.bankName} ending in {method.last4}</p>}
                  {method.type === 'Bank' && <p className="text-sm text-muted-foreground">Bank Account</p>}
                  {method.type === 'Wallet' && <p className="font-semibold">{method.provider}</p>}
                  {method.type === 'Wallet' && <p className="text-sm text-muted-foreground">{method.email}</p>}
                </div>
              </div>
              <div className='flex items-center gap-2 flex-shrink-0'>
                <Button variant="ghost" size="icon" onClick={() => handleOpenPaymentDialog(method)}>
                  <Edit className="h-4 w-4" />
                  <span className='sr-only'>Edit Card</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeletePaymentInitiate(method.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className='sr-only'>Remove Card</span>
                </Button>
              </div>
            </div>
          ))}
          {paymentMethods.length === 0 && (
            <div className="text-center text-muted-foreground py-6">
              You have no saved payment methods.
            </div>
          )}
          <Button variant="outline" className="w-full" onClick={() => handleOpenPaymentDialog(null)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Payment Method
          </Button>
        </CardContent>
      </Card>
      <Dialog
        open={showPaymentDialog}
        onOpenChange={(isOpen) => {
          setShowPaymentDialog(isOpen);
          if (!isOpen) {
            setEditingPaymentMethod(null);
          }
        }}
      >
        <DialogContent>
            <PaymentMethodForm 
                editingMethod={editingPaymentMethod}
                onSubmit={handlePaymentFormSubmit}
                onCancel={() => {
                    setShowPaymentDialog(false);
                    setEditingPaymentMethod(null);
                }}
            />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeletePaymentAlert} onOpenChange={setShowDeletePaymentAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove this payment method.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePaymentConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
