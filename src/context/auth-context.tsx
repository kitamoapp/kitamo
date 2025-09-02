
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { 
    onAuthStateChanged, 
    User, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    updateProfile,
    RecaptchaVerifier,
    PhoneAuthProvider,
    MultiFactorResolver,
    PhoneMultiFactorGenerator,
    ConfirmationResult,
    getAuth,
    Auth,
} from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

type MfaState = 'idle' | 'requires_mfa' | 'verifying_mfa' | 'error';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  mfaState: MfaState;
  mfaResolver: MultiFactorResolver | null;
  auth: Auth | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyMfaCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaState, setMfaState] = useState<MfaState>('idle');
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const app = getFirebaseApp();
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) return;
    
    setMfaState('idle');
    setMfaResolver(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        if (error.code === 'auth/multi-factor-required') {
            if (!recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': () => {},
                });
            }
            
            const resolver = error.customData.resolver as MultiFactorResolver;
            setMfaResolver(resolver);
            
            const phoneInfo = resolver.hints[0];
            const phoneAuthProvider = new PhoneAuthProvider(auth);

            const confirmation = await phoneAuthProvider.verifyPhoneNumber(phoneInfo, recaptchaVerifierRef.current);
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
    if (!auth) return;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        setUser({ ...userCredential.user, displayName });
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setMfaState('idle');
    setMfaResolver(null);
    setConfirmationResult(null);
  };

  const value = { user, loading, login, signup, logout, auth, mfaState, mfaResolver, verifyMfaCode };

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
