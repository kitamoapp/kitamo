
'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

export { app, auth };
