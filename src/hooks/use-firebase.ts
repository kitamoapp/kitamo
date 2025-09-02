
'use client';

import { app } from '@/lib/firebase';
import { getAuth, type Auth } from 'firebase/auth';
import { getMessaging, type Messaging } from 'firebase/messaging';

// This hook ensures that Firebase services are only initialized on the client side.
export function useFirebase() {
  let auth: Auth | null = null;
  let messaging: Messaging | null = null;

  if (typeof window !== 'undefined') {
    auth = getAuth(app);
    try {
      messaging = getMessaging(app);
    } catch (error) {
      console.error('Firebase Messaging not supported in this browser:', error);
    }
  }

  return { auth, messaging };
}

export const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return null;
    }
    
    // Can't use the hook here, so we have to re-initialize
    const { getMessaging, getToken, onMessage } = await import('firebase/messaging');

    try {
        const messaging = getMessaging(app);
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('Notification permission granted.');
            const token = await getToken(messaging);
            console.log('FCM Token:', token);
            
            onMessage(messaging, (payload) => {
                console.log('Message received. ', payload);
                new Notification(payload.notification?.title || 'New Notification', {
                    body: payload.notification?.body,
                    icon: '/icons/icon-192x192.png'
                });
            });

            return token;
        } else {
            console.log('Unable to get permission to notify.');
        }
    } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
    }
    return null;
};
