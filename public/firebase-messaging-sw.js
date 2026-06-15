importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBH3CkA3KpxJeemZXzyXgMtdFnt6khNQm0",
    authDomain: "bookexchange-72fca.firebaseapp.com",
    projectId: "bookexchange-72fca",
    storageBucket: "bookexchange-72fca.firebasestorage.app",
    messagingSenderId: "182208953302",
    appId: "1:182208953302:web:4b8d2bae1fc5ff72538277",
    measurementId: "G-CZ75JJSYN3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Reçu en arrière-plan', payload);
    const notificationTitle = payload.notification?.title || 'Nouveau message';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/vite.svg'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});