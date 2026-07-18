// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVDKKDt3FfLv7zgyjWSwHLWSafp5sl3EU",
  authDomain: "dbobat-81ce5.firebaseapp.com",
  projectId: "dbobat-81ce5",
  storageBucket: "dbobat-81ce5.firebasestorage.app",
  messagingSenderId: "215824649278",
  appId: "1:215824649278:web:05adc2f5ecc717513f556f",
  measurementId: "G-RN1HT7GVYW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
