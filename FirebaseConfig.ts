// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiLF9vsVwy0bZEamudxAzPhcDT1cXSiOI",
  authDomain: "mobile-setup-575ce.firebaseapp.com",
  projectId: "mobile-setup-575ce",
  storageBucket: "mobile-setup-575ce.firebasestorage.app",
  messagingSenderId: "199501057300",
  appId: "1:199501057300:web:e16623a5a785f450fa4601",
  measurementId: "G-8M6GXKTCGT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const analytics = getAnalytics(app);