import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyC2wvXptdBPBNjaCg7Bf0KYjd0JeQGPhc8",

    authDomain: "pet-track-60415.firebaseapp.com",

    projectId: "pet-track-60415",

    storageBucket: "pet-track-60415.firebasestorage.app",

    messagingSenderId: "253959148339",

    appId: "1:253959148339:web:e6fb6490c45f2d7666a446"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);