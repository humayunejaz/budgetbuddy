// Import the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config object from console
const firebaseConfig = {
    apiKey: "AIzaSyAciqYUiZE0-EO4OL6k69DFC-JFzaEGUhM",
    authDomain: "budgetbuddy-43bdb.firebaseapp.com",
    projectId: "budgetbuddy-43bdb",
    storageBucket: "budgetbuddy-43bdb.firebasestorage.app",
    messagingSenderId: "65146645077",
    appId: "1:65146645077:web:a8ec151083acbddb3382dc"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
