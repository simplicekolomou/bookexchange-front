import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBH3CkA3KpxJeemZXzyXgMtdFnt6khNQm0",
    authDomain: "bookexchange-72fca.firebaseapp.com",
    projectId: "bookexchange-72fca",
    storageBucket: "bookexchange-72fca.firebasestorage.app",
    messagingSenderId: "182208953302",
    appId: "1:182208953302:web:4b8d2bae1fc5ff72538277",
    measurementId: "G-CZ75JJSYN3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);