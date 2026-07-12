import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZy3u67hCjxPifbPuiu7-3SJF6G7LrbII",
  authDomain: "quito-care.firebaseapp.com",
  projectId: "quito-care",
  storageBucket: "quito-care.firebasestorage.app",
  messagingSenderId: "852676741117",
  appId: "1:852676741117:web:d3feaa403f279b339dbb94"
};


const appFirebase = initializeApp(firebaseConfig);
export const authFirebase = getAuth(appFirebase);
export const dbFirebase = getFirestore(appFirebase);

export default appFirebase;