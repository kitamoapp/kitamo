
'use client';

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

const firebaseConfig = {
  projectId: "kita-mo-zoojmn",
  appId: "1:737936337826:web:9a62121804cd3ac544e0fb",
  storageBucket: "kita-mo-zoojmn.firebasestorage.app",
  apiKey: "AIzaSyDYyluBPuAlZ_Vyw_huoFohAApHfYu4F8U",
  authDomain: "kita-mo-zoojmn.firebaseapp.com",
  measurementId: "G-02KVBEPEVQ",
  messagingSenderId: "737936337826"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
