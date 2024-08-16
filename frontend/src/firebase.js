// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-e9acc.firebaseapp.com",
  projectId: "real-estate-e9acc",
  storageBucket: "real-estate-e9acc.appspot.com",
  messagingSenderId: "239629259004",
  appId: "1:239629259004:web:9c1cb6f9c3814c217c4779",
  measurementId: "G-1X927RXW7J",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
