// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDfof2tqfm74fq3Z4vFQxx3GqqIAlqQiUA",
  authDomain: "ebuddy-technical-test-e1ad6.firebaseapp.com",
  projectId: "ebuddy-technical-test-e1ad6",
  storageBucket: "ebuddy-technical-test-e1ad6.firebasestorage.app",
  messagingSenderId: "259957412466",
  appId: "1:259957412466:web:cab50fda58edba16f568eb",
  measurementId: "G-DD8HVE6S0D"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);