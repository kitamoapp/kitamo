
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PhoneInput } from '@/components/ui/phone-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Loader2, ShieldCheck, ShieldOff } from 'lucide-react';
import { PhoneAuthProvider, RecaptchaVerifier, PhoneMultiFactorGenerator, multiFactor } from 'firebase/auth';
import { useFirebase } from '@/hooks/use-firebase';

type MfaSetupState = 'idle' | 'enteringPhone' | 'verifyingCode' | 'enrolling' | 'enrolled';

export function MfaCard() {
    const { user } = useAuth();
    const { auth } = useFirebase();
    const { toast } = useToast();
    const [setupState, setSetupState] = useState<MfaSetupState>('idle');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isMfaEnabled = user?.multiFactor?.enrolledFactors?.length > 0;

    const handleOpenDialog = () => {
        setSetupState('enteringPhone');
    };

    const handleDialogClose = () => {
        setSetupState('idle');
        setPhoneNumber('');
        setVerificationCode('');
        setVerificationId(null);
        setIsSubmitting(false);
    }
    
    const handleSendCode = async () => {
        if (!user || !auth) return;
        setIsSubmitting(true);
        try {
            const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-mfa', {
                'size': 'invisible',
                'callback': () => {},
            });

            const phoneProvider = new PhoneAuthProvider(auth);
            const verId = await phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
            setVerificationId(verId);
            setSetupState('verifyingCode');
        } catch (error: any) {
            toast({
                title: 'Error Sending Code',
                description: error.message || 'Could not send verification code. Please check the number and try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleVerifyCodeAndEnroll = async () => {
        if (!user || !verificationId) return;
        setIsSubmitting(true);
        setSetupState('enrolling');
        try {
            const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
            await multiFactor(user).enroll(multiFactorAssertion, `My Phone`);

            toast({
                title: 'MFA Enabled!',
                description: 'Multi-factor authentication has been successfully set up.',
            });
            handleDialogClose();
        } catch (error: any) {
            toast({
                title: 'Enrollment Failed',
                description: error.message || 'The verification code was incorrect or has expired.',
                variant: 'destructive',
            });
            setSetupState('verifyingCode'); // Go back to let user retry
        } finally {
            setIsSubmitting(false);
        }
    }
    
    const handleDisableMfa = async () => {
        if (!user || !user.multiFactor.enrolledFactors[0]) return;
        setIsSubmitting(true);
        try {
            const mfaInfo = user.multiFactor.enrolledFactors[0];
            await multiFactor(user).unenroll(mfaInfo);
             toast({
                title: 'MFA Disabled',
                description: 'Multi-factor authentication has been turned off.',
            });
        } catch (error: any) {
            toast({
                title: 'Error Disabling MFA',
                description: error.message || 'Could not disable MFA. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Multi-Factor Authentication</CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isMfaEnabled ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="font-semibold text-green-700 dark:text-green-400">MFA is Active</p>
                                    <p className="text-sm text-muted-foreground">Your account is protected with phone verification.</p>
                                </div>
                            </div>
                             <Button variant="destructive" onClick={handleDisableMfa} disabled={isSubmitting} className="mt-4 sm:mt-0">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <ShieldOff className="mr-2 h-4 w-4" />}
                                Disable
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4">
                            <div>
                                <p className="font-semibold">MFA is Inactive</p>
                                <p className="text-sm text-muted-foreground">Protect your account from unauthorized access.</p>
                            </div>
                            <Button onClick={handleOpenDialog} className="mt-4 sm:mt-0">
                                <Smartphone className="mr-2 h-4 w-4" />
                                Enable MFA
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={setupState !== 'idle' && setupState !== 'enrolled'} onOpenChange={(open) => !open && handleDialogClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enable Multi-Factor Authentication</DialogTitle>
                        <DialogDescription>
                            {setupState === 'enteringPhone' && 'Enter your phone number to receive a verification code.'}
                            {setupState === 'verifyingCode' && `We've sent a code to ${phoneNumber}. Please enter it below.`}
                            {setupState === 'enrolling' && 'Enrolling your device...'}
                        </DialogDescription>
                    </DialogHeader>

                    {setupState === 'enteringPhone' && (
                        <div className="space-y-4 py-4">
                            <Label htmlFor="phone">Phone Number</Label>
                            <PhoneInput id="phone" value={phoneNumber} onChange={setPhoneNumber} />
                        </div>
                    )}
                    
                    {setupState === 'verifyingCode' && (
                        <div className="space-y-4 py-4">
                            <Label htmlFor="code">Verification Code</Label>
                            <Input
                                id="code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="123456"
                                maxLength={6}
                            />
                        </div>
                    )}
                    
                     {setupState === 'enrolling' && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    <DialogFooter>
                        {setupState === 'enteringPhone' && (
                             <Button onClick={handleSendCode} disabled={isSubmitting || phoneNumber.length < 10}>
                                {isSubmitting && <Loader2 className="animate-spin" />}
                                Send Code
                            </Button>
                        )}
                         {setupState === 'verifyingCode' && (
                            <Button onClick={handleVerifyCodeAndEnroll} disabled={isSubmitting || verificationCode.length < 6}>
                                {isSubmitting && <Loader2 className="animate-spin" />}
                                Verify & Enable
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div id="recaptcha-container-mfa" />
        </>
    );
}
