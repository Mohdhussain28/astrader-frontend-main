import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const baseUrl = "https://astrader-backend-ccth.onrender.com";


function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

document.getElementById('signInForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const uid = userCredential.user.uid;
            userCredential.user.getIdToken().then(token => {
                setCookie('authToken', token, 7); // Save token for 7 days
                setCookie('uid', uid, 7); // Save UID for 7 days
                window.location.href = 'dashboard.html';
            });
        }).catch(error => {
            console.error('Full error object:', error);  // Log the error object

            let errorMessage;
            switch (error.code) {
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No user found with this email.';
                    break;
                case 'auth/invalid-login-credentials':
                    errorMessage = 'Invalid login credentials.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network problem. Please try again.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Please try again later.';
                    break;
                default:
                    errorMessage = `An unexpected error occurred: ${error.message}`;
            }
            alert(errorMessage);
        });
});



document.getElementById('forgotPasswordLink').addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;

    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/request-password-reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Password reset email sent to ${result.maskedEmail}`);
            window.location.href = 'index.html'
        } else {
            alert(`Error: ${result.error}`);
            window.location.href = 'index.html'
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
        window.location.href = 'index.html'
    }
});


