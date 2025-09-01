
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';
import { requestNotificationPermission } from '@/lib/firebase';

export type Setting = 
  | 'biometricLogin'
  | 'emailNotifications'
  | 'pushNotifications';

export type Settings = Record<Setting, boolean>;

const LOCAL_STORAGE_KEY = 'kitamo-settings';
const BIOMETRIC_PROMPT_SEEN_KEY = 'hasSeenBiometricPrompt';

const defaultSettings: Settings = {
  biometricLogin: false,
  emailNotifications: true,
  pushNotifications: false, // Default to false until user enables it
};

export function useSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);


  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      const promptSeen = window.localStorage.getItem(BIOMETRIC_PROMPT_SEEN_KEY);
      const initialSettings = item ? { ...defaultSettings, ...JSON.parse(item) } : defaultSettings;

      setSettings(initialSettings);
      
      if (!initialSettings.biometricLogin && !promptSeen) {
        setShowBiometricPrompt(true);
      }
    } catch (error) {
      console.error('Error reading settings from localStorage', error);
      setSettings(defaultSettings);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  const setBiometricPromptSeen = () => {
    try {
        window.localStorage.setItem(BIOMETRIC_PROMPT_SEEN_KEY, 'true');
    } catch(error) {
        console.error('Error saving to localStorage', error);
    }
  }


  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
        // Also remove the prompt seen key if biometrics is enabled.
        if (settings.biometricLogin) {
            window.localStorage.removeItem(BIOMETRIC_PROMPT_SEEN_KEY);
        }
      } catch (error) {
        console.error('Error saving settings to localStorage', error);
      }
    }
  }, [settings, isLoaded]);

  const setupBiometrics = useCallback(async (): Promise<boolean> => {
    try {
        // This is a mock challenge. In a real app, this should come from the server.
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        // WebAuthn user.id must be an ArrayBuffer.
        const userId = uuidv4();
        const userIdBuffer = new TextEncoder().encode(userId);

        const credential = await navigator.credentials.create({
            publicKey: {
                challenge,
                rp: { name: 'KitaMo', id: window.location.hostname },
                user: {
                    id: userIdBuffer,
                    name: 'user@example.com',
                    displayName: 'User',
                },
                pubKeyCredParams: [{ type: 'public-key', alg: -7 }], // ES256
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    userVerification: 'required',
                },
                timeout: 60000,
            }
        });
        
        console.log('Biometric credential created:', credential);
        
        toast({
            title: 'Biometric Login Enabled',
            description: 'You can now use biometrics to sign in next time.',
        });
        setSettings(prev => ({...prev, biometricLogin: true}));
        return true;

    } catch (error) {
        console.error('WebAuthn Error:', error);
        toast({
            variant: 'destructive',
            title: 'Biometric Setup Failed',
            description: 'Could not set up biometric login. Your device may not support it or you may have cancelled the request.',
        });
        setSettings(prev => ({...prev, biometricLogin: false}));
        return false;
    }
  }, [toast]);


  const updateSetting = useCallback(async (setting: Setting, value: boolean): Promise<void> => {
    if (setting === 'biometricLogin') {
      if (value) {
        await setupBiometrics();
      } else {
        setSettings(prev => ({...prev, biometricLogin: false}));
        toast({
            title: 'Biometric Login Disabled',
            description: 'You will need to use your password to sign in.',
        });
      }
    } else if (setting === 'pushNotifications') {
      if (value) {
        const token = await requestNotificationPermission();
        if (token) {
            setSettings(prev => ({ ...prev, pushNotifications: true }));
            toast({
                title: 'Notifications Enabled',
                description: 'You will now receive push notifications.',
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Notification Permission Denied',
                description: 'Please enable notifications in your browser settings.',
            });
        }
      } else {
        setSettings(prev => ({...prev, pushNotifications: false}));
        toast({
            title: 'Notifications Disabled',
            description: 'You will no longer receive push notifications.',
        });
      }
    }
    else {
        setSettings(prev => ({ ...prev, [setting]: value }));
        toast({
            title: 'Settings Updated',
            description: 'Your preferences have been saved.',
        });
    }
  }, [setupBiometrics, toast]);

  return { settings, updateSetting, isLoaded, setupBiometrics, showBiometricPrompt, setShowBiometricPrompt, setBiometricPromptSeen };
}
