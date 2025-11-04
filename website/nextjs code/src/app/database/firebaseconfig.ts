import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Avoid using analytics in SSR environments by default

const firebaseConfig = {
    apiKey: "AIzaSyAdUNzZ_LcGZlKbCQ-IieNKK5oVdNbxrC8",
    authDomain: "aajnvl-c1b21.firebaseapp.com",
    projectId: "aajnvl-c1b21",
    storageBucket: "aajnvl-c1b21.firebasestorage.app",
    messagingSenderId: "767008016970",
    appId: "1:767008016970:web:c4b916051ef5d2adef34b3",
    measurementId: "G-92P5K85LFR"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };