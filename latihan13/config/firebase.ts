import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoDOHxbWLGcaX5JTN7oF2Fae-IK3XSEhU",
  authDomain: "bioskop-8c8e6.firebaseapp.com",
  projectId: "bioskop-8c8e6",
  storageBucket: "bioskop-8c8e6.firebasestorage.app",
  messagingSenderId: "404895168185",
  appId: "1:404895168185:web:705e073a7c7558c4a70d68",
  measurementId: "G-LTQZE0JKFJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
