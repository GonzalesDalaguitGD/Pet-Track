import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");

const password =
    document.getElementById("password");

const message =
    document.getElementById("loginMessage");

const togglePassword =
    document.getElementById("togglePassword");


/* SHOW / HIDE PASSWORD */

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.textContent = "Hide";

    } else {

        password.type = "password";

        togglePassword.textContent = "Show";

    }

});


/* LOGIN */

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    message.textContent = "Logging in...";
    message.style.color = "#1597c8";


    const userEmail = email.value.trim();

    const userPassword = password.value;


    try {

        await signInWithEmailAndPassword(
            auth,
            userEmail,
            userPassword
        );


        message.textContent =
            "Login successful!";

        message.style.color = "#2e7d32";

   setTimeout(() => {
    window.location.href = "../dashboard/dashboard.html";
}, 700);

    } catch (error) {

        console.error(error);


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            message.textContent =
                "Incorrect email or password.";

        } else if (
            error.code ===
            "auth/user-not-found"
        ) {

            message.textContent =
                "No account found with this email.";

        } else if (
            error.code ===
            "auth/wrong-password"
        ) {

            message.textContent =
                "Incorrect password.";

        } else if (
            error.code ===
            "auth/invalid-email"
        ) {

            message.textContent =
                "Please enter a valid email.";

        } else {

            message.textContent =
                "Unable to log in. Please try again.";

        }

        message.style.color = "#e53935";

    }

});