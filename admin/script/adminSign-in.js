import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {

    const signInForm = document.getElementById('signInForm');

    if (signInForm) {
        signInForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                setCookie('authToken', await userCredential.user.getIdToken(), 7);
                window.location.href = 'pages/edit-packages.html'
            } catch (error) {
                alert(error.message);
                console.error(error);
            }
        });
    }
});

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}
