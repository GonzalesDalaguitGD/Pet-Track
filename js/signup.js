import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const signupForm = document.getElementById("signupForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const message = document.getElementById("signupMessage");

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


/* REGISTRATION */

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    message.textContent = "";
    message.style.color = "";


    const name = fullName.value.trim();
    const userEmail = email.value.trim();
    const userPassword = password.value;
    const confirm = confirmPassword.value;


    /* CHECK PASSWORD */

    if (userPassword !== confirm) {

        message.textContent = "Passwords do not match.";

        message.style.color = "#e53935";

        return;
    }


    /* PASSWORD LENGTH */

    if (userPassword.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        message.style.color = "#e53935";

        return;
    }


    try {

        message.textContent = "Creating your account...";
        message.style.color = "#1597c8";


        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                userEmail,
                userPassword
            );


        const user = userCredential.user;


        /* SAVE USER NAME */

        await updateProfile(user, {
            displayName: name
        });


        message.textContent =
            "Account created successfully!";

        message.style.color = "#2e7d32";


        /* GO TO DASHBOARD */

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1000);


    } catch (error) {

        console.error(error);


        if (error.code === "auth/email-already-in-use") {

            message.textContent =
                "This email is already registered.";

        } else if (error.code === "auth/invalid-email") {

            message.textContent =
                "Please enter a valid email address.";

        } else if (error.code === "auth/weak-password") {

            message.textContent =
                "Password is too weak.";

        } else {

            message.textContent =
                "Something went wrong. Please try again.";

        }

        message.style.color = "#e53935";

    }

});