import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-rx45gfAQDDyp3VLvoJhlkwkVdxLtfbg",
  authDomain: "b2b-healthcare-246e4.firebaseapp.com",
  projectId: "b2b-healthcare-246e4",
  storageBucket: "b2b-healthcare-246e4.firebasestorage.app",
  messagingSenderId: "730347137183",
  appId: "1:730347137183:web:c316aa9f31602878bb9aaa",
  measurementId: "G-KDH285GKQB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export const db = getFirestore(app);


export { app, analytics, auth };