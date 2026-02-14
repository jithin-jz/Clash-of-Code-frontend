import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported in this browser.');
    return null;
  }

  console.log('Attempting to register service worker and get FCM token...');
  try {
    // Explicitly register the service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    console.log('Service Worker registered successfully:', registration.scope);
    
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
        console.error('VITE_FIREBASE_VAPID_KEY is missing from environment variables!');
        return null;
    }
    console.log('Using VAPID key (first 10 chars):', vapidKey.substring(0, 10));

    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log('FCM Token generated successfully.');
      return currentToken;
    } else {
      console.warn('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token: ', err);
    if (err.code === 'messaging/permission-blocked') {
        console.error('Notification permission was blocked by the browser.');
    } else if (err.code === 'messaging/invalid-vapid-key') {
        console.error('The provided VAPID key is invalid.');
    }
    return null;
  }
};


export const onMessageListener = (callback) => onMessage(messaging, callback);


export default messaging;
