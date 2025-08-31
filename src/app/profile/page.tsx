
'use client';

import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSubscription } from '@/hooks/use-subscription';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Trash2, CreditCard, PlusCircle, Edit, Landmark, Wallet } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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


// For demonstration, we'll have a list of valid codes.
// In a real app, these would come from your user database.
const VALID_REFERRAL_CODES = ['ALICECODE', 'BOBCODE', 'CHARLIECODE'];

interface BasePaymentMethod {
    id: string;
    type: 'Card' | 'Bank' | 'Wallet';
}

interface CardPaymentMethod extends BasePaymentMethod {
    type: 'Card';
    last4: string;
    expiry: string;
    brand: string;
    cardNumber?: string;
}

interface BankPaymentMethod extends BasePaymentMethod {
    type: 'Bank';
    last4: string;
    bankName: string;
    accountNumber?: string;
    routingNumber?: string;
}

interface WalletPaymentMethod extends BasePaymentMethod {
    type: 'Wallet';
    provider: string;
    email: string;
}

export type PaymentMethod = CardPaymentMethod | BankPaymentMethod | WalletPaymentMethod;


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
}).and(z.union([
    cardSchema.extend({ type: z.literal('Card') }),
    bankSchema.extend({ type: z.literal('Bank') }),
    walletSchema.extend({ type: z.literal('Wallet') }),
]));

const baseDefaultValues = {
  type: 'Card' as const,
  cardNumber: '',
  expiry: '',
  cvc: '',
  accountNumber: '',
  routingNumber: '',
  bankName: '',
  provider: '',
  email: '',
};

export default function ProfilePage() {
  const { currentTier } = useSubscription();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for forms
  const [accountInfo, setAccountInfo] = useState({
    fullName: 'User',
    email: 'user@example.com',
  });
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [referralCode, setReferralCode] = useState('');
  const [hasReferralCode, setHasReferralCode] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(`https://picsum.photos/100/100`);

  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
      { id: 'card-1', type: 'Card', last4: '4242', expiry: '12/26', brand: 'Visa', cardNumber: '4242424242424242' }
  ]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showDeletePaymentAlert, setShowDeletePaymentAlert] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<string | null>(null);

  const paymentForm = useForm<any>({
    resolver: (data, context, options) => {
        const type = data.type;
        if (type === 'Card') return zodResolver(cardSchema.extend({ type: z.literal('Card') }))(data, context, options);
        if (type === 'Bank') return zodResolver(bankSchema.extend({ type: z.literal('Bank') }))(data, context, options);
        if (type === 'Wallet') return zodResolver(walletSchema.extend({ type: z.literal('Wallet') }))(data, context, options);
        return zodResolver(paymentMethodSchema)(data, context, options);
    },
    defaultValues: baseDefaultValues,
  });
  
  const paymentType = paymentForm.watch('type');

  useEffect(() => {
    let defaultValues = { ...baseDefaultValues };

    if (editingPaymentMethod) {
      defaultValues.type = editingPaymentMethod.type;
      
      switch (editingPaymentMethod.type) {
        case 'Card':
          defaultValues.cardNumber = editingPaymentMethod.cardNumber || '';
          defaultValues.expiry = editingPaymentMethod.expiry || '';
          break;
        case 'Bank':
          defaultValues.accountNumber = editingPaymentMethod.accountNumber || '';
          defaultValues.routingNumber = editingPaymentMethod.routingNumber || '';
          defaultValues.bankName = editingPaymentMethod.bankName || '';
          break;
        case 'Wallet':
          defaultValues.provider = editingPaymentMethod.provider || '';
          defaultValues.email = editingPaymentMethod.email || '';
          break;
      }
    }
    paymentForm.reset(defaultValues);
  }, [editingPaymentMethod, paymentForm]);


  const handleAccountInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAccountInfo(prev => ({ ...prev, [id]: value }));
  }
  
  const handlePasswordInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordInfo(prev => ({ ...prev, [id]: value }));
  }


  const handleSaveReferralCode = () => {
    const code = referralCode.trim().toUpperCase();
    if (code === '') {
        toast({
            title: 'Error',
            description: 'Please enter a referral code.',
            variant: 'destructive'
        })
        return;
    }

    if (VALID_REFERRAL_CODES.includes(code)) {
      setHasReferralCode(true);
      toast({
          title: 'Success!',
          description: 'Your referral code has been applied.'
      })
    } else {
       toast({
            title: 'Invalid Code',
            description: 'The referral code you entered is not valid. Please check and try again.',
            variant: 'destructive'
        })
    }
  }

  const handleSaveChanges = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your account information has been saved.',
    });
  }

  const handleUpdatePassword = () => {
    if (!passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      });
      return;
    }
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Password Updated',
      description: 'Your password has been changed successfully.',
    });
    setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
  }

  const handleAvatarChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newAvatarSrc = URL.createObjectURL(file);
      setAvatarSrc(newAvatarSrc);
      toast({
        title: 'Photo updated',
        description: 'Your new profile picture is now displayed.',
      });
    }
  };

  const handleRemovePhoto = () => {
    setAvatarSrc(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    toast({
      title: 'Photo Removed',
      description: 'Your profile picture has been removed.',
    });
  }

  const handleOpenPaymentDialog = (method: PaymentMethod | null) => {
    setEditingPaymentMethod(method);
    setShowPaymentDialog(true);
  }

  const handlePaymentFormSubmit = (values: any) => {
    let newOrUpdatedMethod: PaymentMethod;
    const id = editingPaymentMethod ? editingPaymentMethod.id : `payment-${Date.now()}`;

    switch (values.type) {
        case 'Card':
            newOrUpdatedMethod = {
                id,
                type: 'Card',
                last4: values.cardNumber.slice(-4),
                expiry: values.expiry,
                brand: values.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
                cardNumber: values.cardNumber,
            };
            break;
        case 'Bank':
            newOrUpdatedMethod = {
                id,
                type: 'Bank',
                last4: values.accountNumber.slice(-4),
                bankName: values.bankName,
                accountNumber: values.accountNumber,
                routingNumber: values.routingNumber
            };
            break;
        case 'Wallet':
            newOrUpdatedMethod = {
                id,
                type: 'Wallet',
                provider: values.provider,
                email: values.email,
            };
            break;
        default:
            toast({ title: 'Error', description: 'Invalid payment type.', variant: 'destructive'});
            return;
    }
    
    if (editingPaymentMethod) {
      setPaymentMethods(prev => prev.map(p => p.id === id ? newOrUpdatedMethod : p));
       toast({
          title: 'Payment Method Updated',
          description: `Your ${newOrUpdatedMethod.type} details have been updated.`
      });
    } else {
      setPaymentMethods(prev => [...prev, newOrUpdatedMethod]);
       toast({
          title: 'Payment Method Added',
          description: `Your ${newOrUpdatedMethod.type} has been successfully added.`
      });
    }

    paymentForm.reset(baseDefaultValues);
    setShowPaymentDialog(false);
    setEditingPaymentMethod(null);
  }

  const handleDeletePaymentInitiate = (id: string) => {
    setPaymentMethodToDelete(id);
    setShowDeletePaymentAlert(true);
  }

  const handleDeletePaymentConfirm = () => {
    if (paymentMethodToDelete) {
        setPaymentMethods(prev => prev.filter(p => p.id !== paymentMethodToDelete));
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
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your account details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage
                      src={avatarSrc || undefined}
                      alt="User avatar"
                      data-ai-hint="person portrait"
                    />
                    <AvatarFallback>{accountInfo.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                   <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-1 right-1 h-8 w-8 rounded-full"
                    onClick={handleAvatarChangeClick}
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change photo</span>
                  </Button>
                </div>
                <CardTitle className="text-2xl">{accountInfo.fullName}</CardTitle>
                <CardDescription>{accountInfo.email}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                 {avatarSrc && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive w-full mb-4"
                        onClick={handleRemovePhoto}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Photo
                    </Button>
                )}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Current Plan</p>
                  <Badge
                    className={cn(
                      'text-lg',
                      currentTier.name === 'Platinum' &&
                        'border-sky-500 text-sky-500',
                      currentTier.name === 'Gold' &&
                        'border-amber-500 text-amber-500',
                      currentTier.name === 'Silver' &&
                        'border-slate-500 text-slate-500',
                       currentTier.name === 'Bronze' && 'border-yellow-700 text-yellow-700'
                    )}
                    variant="outline"
                  >
                    {currentTier.name}
                  </Badge>
                </div>
                <Button className="mt-4 w-full" onClick={() => router.push('/subscriptions')}>
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal details here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={accountInfo.fullName} onChange={handleAccountInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={accountInfo.email} onChange={handleAccountInfoChange} />
                </div>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                    Manage your saved payment methods for subscriptions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {paymentMethods.map(method => (
                        <div key={method.id} className="flex items-center justify-between rounded-lg border p-4">
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
                            <div className='flex items-center gap-2'>
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
                    <Button variant="outline" className="w-full" onClick={() => handleOpenPaymentDialog(null)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add New Payment Method
                    </Button>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referral Code</CardTitle>
                <CardDescription>
                  If you received a referral code after signing up, you can enter it here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="referral-code">Your Upline's Code</Label>
                  <Input 
                    id="referral-code"
                    placeholder="Enter referral code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    disabled={hasReferralCode} 
                  />
                </div>
                <Button onClick={handleSaveReferralCode} disabled={hasReferralCode}>
                    {hasReferralCode ? 'Code Applied' : 'Save Code'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password for better security.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={passwordInfo.currentPassword} onChange={handlePasswordInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={passwordInfo.newPassword} onChange={handlePasswordInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={passwordInfo.confirmPassword} onChange={handlePasswordInfoChange} />
                </div>
                <Button onClick={handleUpdatePassword}>Update Password</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>

     <Dialog
        open={showPaymentDialog}
        onOpenChange={(isOpen) => {
          setShowPaymentDialog(isOpen);
          if (!isOpen) {
            setEditingPaymentMethod(null);
            paymentForm.reset(baseDefaultValues);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPaymentMethod ? 'Edit' : 'Add'} Payment Method</DialogTitle>
            <DialogDescription>
              {editingPaymentMethod ? 'Update your payment details.' : 'Select a payment type and enter the details.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handlePaymentFormSubmit)} className="space-y-4">
              <FormField
                control={paymentForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                          field.onChange(value);
                          paymentForm.reset({ ...baseDefaultValues, type: value }); // Reset form to clear irrelevant fields
                      }}
                      value={field.value}
                      disabled={!!editingPaymentMethod} // Prevent changing type when editing
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
                    control={paymentForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9101 1121" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-2">
                      <FormField
                        control={paymentForm.control}
                        name="expiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiration</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                       <FormField
                        control={paymentForm.control}
                        name="cvc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
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
                        control={paymentForm.control}
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
                        control={paymentForm.control}
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
                        control={paymentForm.control}
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
                      control={paymentForm.control}
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
                      control={paymentForm.control}
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
                  <Button type="button" variant="outline" onClick={() => {
                      paymentForm.reset(baseDefaultValues);
                      setEditingPaymentMethod(null);
                      setShowPaymentDialog(false);
                    }}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">{editingPaymentMethod ? 'Save Changes' : 'Add Method'}</Button>
              </DialogFooter>
            </form>
          </Form>
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
