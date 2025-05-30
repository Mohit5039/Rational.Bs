// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCTTrHJGCb2P3rLY8v4SWzC-N06HlO5sLg",
  authDomain: "rationalbs-e7f49.firebaseapp.com",
  projectId: "rationalbs-e7f49",
  storageBucket: "rationalbs-e7f49.firebasestorage.app",
  messagingSenderId: "903057451953",
  appId: "1:903057451953:web:b024c943ca2560c30d6b90",
  measurementId: "G-2CW0JQ00SN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth and firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
// export auth and firestore 
export const storage = getStorage(app); 
export { signOut };
