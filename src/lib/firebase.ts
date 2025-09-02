
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
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


// Initialize Firebase on the client side
const getFirebaseApp = (): FirebaseApp | null => {
    if (typeof window === 'undefined') {
        return null; 
    }
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
};

const app = getFirebaseApp();
let auth: Auth | null = null;

const getFirebaseAuth = (): Auth | null => {
    if (!app) return null;
    if (!auth) {
        auth = getAuth(app);
    }
    return auth;
}


const getMessagingInstance = () => {
    // Check for browser environment and service worker support
    if (typeof window !== 'undefined' && "serviceWorker" in navigator) {
        try {
            if (!app) return null;
            return getMessaging(app);
        } catch (error) {
            console.error("Firebase Messaging not supported in this browser:", error);
            return null;
        }
    }
    return null;
}

const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return null;
    }

    const messaging = getMessagingInstance();
    if (!messaging) {
        return null;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            // The VAPID key is managed by Firebase App Hosting, so it's not needed here.
            const token = await getToken(messaging);
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
        } else {
            console.log('Unable to get permission to notify.');
        }
    } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
    }
    return null;
};


export { app, getFirebaseAuth, requestNotificationPermission, getMessagingInstance };
