
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
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
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
import { PaymentMethodForm, baseDefaultValues } from '@/components/payment-method-form';
import type { PaymentMethod, PaymentMethodValues } from '@/lib/types';
import { usePaymentMethods } from '@/context/payment-method-context';


// For demonstration, we'll have a list of valid codes.
// In a real app, these would come from your user database.
const VALID_REFERRAL_CODES = ['ALICECODE', 'BOBCODE', 'CHARLIECODE'];

export default function ProfilePage() {
  const { currentTier } = useSubscription();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    paymentMethods, 
    addPaymentMethod, 
    updatePaymentMethod, 
    deletePaymentMethod 
  } = usePaymentMethods();

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

  // State for payment methods dialog
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showDeletePaymentAlert, setShowDeletePaymentAlert] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<string | null>(null);

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
