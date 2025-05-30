// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDmcIuNECGnxvDy58Cqp2MFx7KArV5jS4A",
  authDomain: "rationalbs-backend.firebaseapp.com",
  projectId: "rationalbs-backend",
  storageBucket: "rationalbs-backend.firebasestorage.app",
  messagingSenderId: "129821405436",
  appId: "1:129821405436:web:5e645796f0a380aa4aa779",
  measurementId: "G-9L5LVEMDCJ"
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
