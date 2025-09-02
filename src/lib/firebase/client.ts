
'use client';

import { getFirebaseApp } from '@/lib/firebase';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

export const requestNotificationPermission = async (): Promise<string | null> => {
  const isMessagingSupported = await isSupported();
  if (typeof window !== 'undefined' && isMessagingSupported) {
    try {
      const app = getFirebaseApp();
      const messaging = getMessaging(app);
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // IMPORTANT: Replace this with your actual VAPID key from the Firebase console.
        // Go to Project settings > Cloud Messaging > Web configuration > Generate key pair
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
            console.error("VAPID key not found. Please set NEXT_PUBLIC_FIREBASE_VAPID_KEY in your .env file.");
            return null;
        }

        const token = await getToken(messaging, { vapidKey });
        return token;
      } else {
        console.log('Unable to get permission to notify.');
        return null;
      }
    } catch (error) {
      console.error(
        'An error occurred while requesting notification permission.',
        error
      );
      return null;
    }
  }
  return null;
};
