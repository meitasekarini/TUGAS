import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnR9hkrx7lC6ZHcrTcz0VMGi3SFALxs5Q",
  authDomain: "ujikom-c75fc.firebaseapp.com",
  projectId: "ujikom-c75fc",
  storageBucket: "ujikom-c75fc.firebasestorage.app",
  messagingSenderId: "238291199261",
  appId: "1:238291199261:web:06758982fac657455a2df4",
  measurementId: "G-Z1XWY4H4BP"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
