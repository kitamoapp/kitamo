// This file needs to be in the public directory

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYyluBPuAlZ_Vyw_huoFohAApHfYu4F8U",
  authDomain: "kita-mo-zoojmn.firebaseapp.com",
  projectId: "kita-mo-zoojmn",
  storageBucket: "kita-mo-zoojmn.appspot.com",
  messagingSenderId: "737936337826",
  appId: "1:737936337826:web:9a62121804cd3ac544e0fb",
  measurementId: "G-02KVBEPEVQ"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
