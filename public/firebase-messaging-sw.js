/* global importScripts, firebase */

// Scripts for firebase and firebase-messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const params = new URLSearchParams(self.location.search);
const firebaseConfig = {
  apiKey: params.get("apiKey") || "",
  authDomain: params.get("authDomain") || "",
  projectId: params.get("projectId") || "",
  storageBucket: params.get("storageBucket") || "",
  messagingSenderId: params.get("messagingSenderId") || "",
  appId: params.get("appId") || "",
};

if (!firebaseConfig.apiKey) {
  console.warn("[firebase-sw] Missing Firebase config; background messaging disabled.");
} else {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.apps.length ? firebase.messaging() : null;

if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image || '/logo192.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
