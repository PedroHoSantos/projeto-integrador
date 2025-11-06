import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCNelQnZ7hpzV5O4WnYcSczuRiTM0k_-fA",
    authDomain: "projeto-integrador-429cd.firebaseapp.com",
    projectId: "projeto-integrador-429cd",
    storageBucket: "projeto-integrador-429cd.firebasestorage.app",
    messagingSenderId: "42455592205",
    appId: "1:42455592205:web:8ac18172f497e1d64fd444",
    measurementId: "G-LMX8B55X9C"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
