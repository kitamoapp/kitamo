
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    onAuthStateChanged, 
    User, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    updateProfile,
    type Auth,
    RecaptchaVerifier,
    PhoneAuthProvider,
    signInWithPhoneNumber,
    MultiFactorResolver,
    PhoneMultiFactorGenerator,
    ConfirmationResult
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

type MfaState = 'idle' | 'requires_mfa' | 'verifying_mfa' | 'error';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  mfaState: MfaState;
  mfaResolver: MultiFactorResolver | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyMfaCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaState, setMfaState] = useState<MfaState>('idle');
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const { toast } = useToast();
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setMfaState('idle');
    setMfaResolver(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        if (error.code === 'auth/multi-factor-required') {
            const resolver = error.customData.resolver as MultiFactorResolver;
            setMfaResolver(resolver);
            
            const phoneInfo = resolver.hints[0];
            const phoneAuthProvider = new PhoneAuthProvider(auth);

            // This must be initialized only on the client, after the container is available.
            const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {},
            });

            const confirmation = await phoneAuthProvider.verifyPhoneNumber(phoneInfo, recaptchaVerifier);
            setConfirmationResult(confirmation);
            setMfaState('requires_mfa');
        } else {
            setMfaState('error');
            throw error;
        }
    }
  };

  const verifyMfaCode = async (code: string) => {
    if (!confirmationResult || !mfaResolver) {
        throw new Error("MFA verification not ready.");
    }
    setMfaState('verifying_mfa');
    try {
        const credential = PhoneMultiFactorGenerator.assertion(confirmationResult, code);
        await mfaResolver.resolveSignIn(credential);
        setMfaState('idle');
        setMfaResolver(null);
        setConfirmationResult(null);
    } catch (error) {
        setMfaState('requires_mfa');
        toast({
            title: 'Invalid Code',
            description: 'The MFA code is incorrect. Please try again.',
            variant: 'destructive',
        });
        throw error;
    }
  }

  const signup = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        setUser({ ...userCredential.user, displayName });
    }
  };

  const logout = async () => {
    await signOut(auth);
    setMfaState('idle');
    setMfaResolver(null);
    setConfirmationResult(null);
  };

  const value = { user, loading, login, signup, logout, mfaState, mfaResolver, verifyMfaCode };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <div id="recaptcha-container" />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
