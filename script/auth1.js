import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBE__SBRzTZNGcJEniAsatYcPXngnhm8jc",
    authDomain: "as-trader-dcb91.firebaseapp.com",
    projectId: "as-trader-dcb91",
    storageBucket: "as-trader-dcb91.appspot.com",
    messagingSenderId: "739845039000",
    appId: "1:739845039000:web:94f9c484d0739186a701ed",
    measurementId: "G-GH221RHLJP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        user.getIdToken(true).then((idToken) => {
            setCookie('authToken', idToken, 1/24);
            console.log("hiii check")
        }).catch((error) => {
            console.error('Error refreshing token:', error);
        });
    } else {
        window.location.href = '/sign-in.html';
    }
});

export async function refreshAuthToken() {
    const user = auth.currentUser;
    if (user) {
        try {
            const idToken = await user.getIdToken(true);
            setCookie('authToken', idToken, 1/24); 
            console.log("hiii check 2")
        } catch (error) {
            console.error('Error refreshing token:', error);
            window.location.href = '/sign-in.html';
        }
    }
}
