importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

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
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Background Message received. ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
