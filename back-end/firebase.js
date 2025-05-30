// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD2rTf_-JuxVRFzjQNbVgKVGt1Xpw8N9Vk",
  authDomain: "rationalbs.firebaseapp.com",
  projectId: "rationalbs",
  storageBucket: "rationalbs.firebasestorage.app",
  messagingSenderId: "396181592463",
  appId: "1:396181592463:web:0db136e788e0f5238e13fa",
  measurementId: "G-3LNY2ECE4Q"
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
