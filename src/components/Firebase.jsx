import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArth-gVWMsFi7DYw-6Kbq3HeK6LCl9AHw",
  authDomain: "watch-6ac1d.firebaseapp.com",
  projectId: "watch-6ac1d",
  storageBucket: "watch-6ac1d.firebasestorage.app", // bu kısmı değiştirmedik
  messagingSenderId: "673386467273",
  appId: "1:673386467273:web:a5e767956c1391af9f2218",
  measurementId: "G-BDQJH5VQZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);
