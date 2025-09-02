
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
import { getFirebaseAuth } from '@/lib/firebase';
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
  const [auth, setAuth] = useState<Auth | null>(null);
  const [mfaState, setMfaState] = useState<MfaState>('idle');
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const authInstance = getFirebaseAuth();
    setAuth(authInstance);

    if (authInstance) {
      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Auth service is not available.");
    
    // Reset MFA state on new login attempt
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
            
            // This reCAPTCHA is invisible and resolves automatically.
            const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {},
            });

            const confirmation = await phoneAuthProvider.verifyPhoneNumber(phoneInfo, recaptchaVerifier);
            setConfirmationResult(confirmation);
            setMfaState('requires_mfa');
        } else {
            setMfaState('error');
            throw error; // Re-throw other errors
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
        setMfaState('requires_mfa'); // Revert to let user try again
        toast({
            title: 'Invalid Code',
            description: 'The MFA code is incorrect. Please try again.',
            variant: 'destructive',
        });
        throw error;
    }
  }

  const signup = async (email: string, password: string, displayName: string) => {
    if (!auth) throw new Error("Auth service is not available.");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        setUser({ ...userCredential.user, displayName });
    }
  };

  const logout = async () => {
    if (!auth) throw new Error("Auth service is not available.");
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
