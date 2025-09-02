
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

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
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export { app };
