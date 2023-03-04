import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "windows-xp-messenger.firebaseapp.com",
  projectId: "windows-xp-messenger",
  storageBucket: "windows-xp-messenger.appspot.com",
  messagingSenderId: "873270336944",
  appId: "1:873270336944:web:b72cfbb05667a607258a75",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
