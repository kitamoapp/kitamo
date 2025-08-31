
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';

export type Setting = 
  | 'biometricLogin'
  | 'emailNotifications'
  | 'pushNotifications';

export type Settings = Record<Setting, boolean>;

const LOCAL_STORAGE_KEY = 'kitamo-settings';

const defaultSettings: Settings = {
  biometricLogin: false,
  emailNotifications: true,
  pushNotifications: true,
};

export function useSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        const storedSettings = JSON.parse(item);
        setSettings({ ...defaultSettings, ...storedSettings });
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error reading settings from localStorage', error);
      setSettings(defaultSettings);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings to localStorage', error);
      }
    }
  }, [settings, isLoaded]);

  const setupBiometrics = useCallback(async (): Promise<boolean> => {
    try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const credential = await navigator.credentials.create({
            publicKey: {
                challenge,
                rp: { name: 'KitaMo', id: window.location.hostname },
                user: {
                    id: uuidv4() as any,
                    name: 'user@example.com',
                    displayName: 'User',
                },
                pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    userVerification: 'required',
                },
                timeout: 60000,
            }
        });
        
        console.log('Credential created:', credential);
        
        toast({
            title: 'Biometric Login Enabled',
            description: 'You can now use biometrics to sign in next time.',
        });
        return true;

    } catch (error) {
        console.error('WebAuthn Error:', error);
        toast({
            variant: 'destructive',
            title: 'Biometric Setup Failed',
            description: 'Could not set up biometric login. Your device may not support it or you may have cancelled the request.',
        });
        return false;
    }
  }, [toast]);


  const updateSetting = useCallback(async (setting: Setting, value: boolean): Promise<void> => {
    if (setting === 'biometricLogin' && value === true) {
        // If enabling biometrics, trigger the setup process
        const success = await setupBiometrics();
        if (success) {
            setSettings(prev => ({ ...prev, [setting]: true }));
        }
    } else {
        // For all other cases (including disabling biometrics), just update the state
        setSettings(prev => ({ ...prev, [setting]: value }));
        if (setting !== 'biometricLogin') {
            toast({
                title: 'Settings Updated',
                description: 'Your preferences have been saved.',
            });
        } else if (setting === 'biometricLogin' && value === false) {
             toast({
                title: 'Biometric Login Disabled',
                description: 'You will need to use your password to sign in.',
            });
        }
    }
  }, [setupBiometrics, toast]);

  return { settings, updateSetting, isLoaded, setupBiometrics };
}
