// Import the necessary Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBE__SBRzTZNGcJEniAsatYcPXngnhm8jc",
    authDomain: "as-trader-dcb91.firebaseapp.com",
    projectId: "as-trader-dcb91",
    storageBucket: "as-trader-dcb91.appspot.com",
    messagingSenderId: "739845039000",
    appId: "1:739845039000:web:94f9c484d0739186a701ed",
    measurementId: "G-GH221RHLJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./firebase-messaging-sw.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}

// Request permission and get token
const requestPermissionAndGetToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');

            const token = await getToken(messaging, { vapidKey: 'BMzL2kOQyuarR_9ipC99JZbfCqJLx8Pyhqo26ihKIxI-NN1fz3o7Cn58uK1jicWDguPh259_oPZWi9YZCwnhO5Q' });
            console.log(token)
            if (token) {
                console.log('FCM Token:', token);
                // Optionally, send the token to your server
                // const response = await fetch('/save-token', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ token: token, userId: 'admin-user-id' })
                // });
                // console.log('Token sent to server:', response.status);
            } else {
                console.log('No registration token available.');
            }
        } else {
            console.log('Notification permission denied.');
        }
    } catch (err) {
        console.error('Unable to get permission to notify.', err);
    }
};

requestPermissionAndGetToken();

// Handle incoming messages (foreground)
onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    new Notification(notificationTitle, notificationOptions);
});
