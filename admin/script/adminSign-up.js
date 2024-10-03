import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

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
    const signUpForm = document.getElementById('signUpForm');

    if (signUpForm) {
        signUpForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const agreeTerms = document.getElementById('agree_terms').checked;

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            if (!agreeTerms) {
                alert('You must agree to the terms and conditions.');
                return;
            }

            createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    // Update profile or additional user setup can be done here
                    // For example, setting custom claims
                    return userCredential.user.getIdTokenResult(true);
                })
                .then(idTokenResult => {
                    // Assuming you want to set the admin claim here
                    // This requires admin SDK and is usually done server-side
                    // For now, you can redirect to an admin dashboard or another page
                    alert("acoount created ")
                    window.location.href = 'admin-dashboard.html'; // Redirect to admin dashboard
                })
                .catch(error => {
                    alert(error.message);
                    console.error(error);
                });
        });
    }
});
