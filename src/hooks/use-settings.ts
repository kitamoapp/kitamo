
'use client';

import { useState, useEffect, useCallback } from 'react';

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
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        // Merge stored settings with defaults to avoid errors if new settings are added
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

  const updateSetting = useCallback((setting: Setting, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  }, []);

  return { settings, updateSetting, isLoaded };
}
