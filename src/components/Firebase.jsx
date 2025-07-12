import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArth-gVWMsFi7DYw-6Kbq3HeK6LCl9AHw",
  authDomain: "watch-6ac1d.firebaseapp.com",
  projectId: "watch-6ac1d",
  storageBucket: "watch-6ac1d.firebasestorage.app",
  messagingSenderId: "673386467273",
  appId: "1:673386467273:web:a5e767956c1391af9f2218",
  measurementId: "G-BDQJH5VQZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔐 Auth və Google provider-i export et
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();