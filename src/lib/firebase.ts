
'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "kita-mo-zoojmn",
  appId: "1:737936337826:web:9a62121804cd3ac544e0fb",
  storageBucket: "kita-mo-zoojmn.firebasestorage.app",
  apiKey: "AIzaSyDYyluBPuAlZ_Vyw_huoFohAApHfYu4F8U",
  authDomain: "kita-mo-zoojmn.firebaseapp.com",
  measurementId: "G-02KVBEPEVQ",
  messagingSenderId: "737936337826"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const getMessagingInstance = () => {
    if (typeof window !== 'undefined' && "serviceWorker" in navigator) {
        return getMessaging(app);
    }
    return null;
}

const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return null;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        console.log('Notification permission granted.');
        const messaging = getMessagingInstance();
        if (messaging) {
            const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' }); // Replace with your VAPID key
            console.log('FCM Token:', token);
            
            // Listen for foreground messages
            onMessage(messaging, (payload) => {
                console.log('Message received. ', payload);
                // Customize notification here
                new Notification(payload.notification?.title || 'New Notification', {
                    body: payload.notification?.body,
                    icon: '/icons/icon-192x192.png'
                });
            });

            return token;
        }
    } else {
        console.log('Unable to get permission to notify.');
    }
    return null;
};


export { app, auth, requestNotificationPermission, getMessagingInstance };

