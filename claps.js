import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase
const auth = getAuth();
const db = getFirestore();

// Blog ID from URL
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get("id");

// DOM Elements
const clapBtn = document.querySelector(".clap-btn");
const clapCountSpan = document.getElementById("clap-count");

let currentUser = null;

// Load total claps
async function loadTotalClaps() {
  const clapsRef = collection(db, "blogs", blogId, "claps");
  const snapshot = await getDocs(clapsRef);
  let total = 0;
  snapshot.forEach(doc => {
    total += doc.data().count || 0;
  });
  clapCountSpan.textContent = total;
}

// Auth state tracking
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    console.log("User logged in:", user.email);
  } else {
    console.log("User not logged in");
  }
});

// Clap button logic
if (clapBtn) {
  clapBtn.addEventListener("click", async () => {
    if (!currentUser) {
      alert("You must be logged in to clap.");
      return;
    }

    const userId = currentUser.uid;
    const userClapRef = doc(db, "blogs", blogId, "claps", userId);
    const docSnap = await getDoc(userClapRef);

    let currentCount = 0;
    if (docSnap.exists()) {
      currentCount = docSnap.data().count || 0;
    }

    if (currentCount >= 3) {
      alert("You can clap up to 3 times only.");
      return;
    }

    await setDoc(userClapRef, { count: currentCount + 1 }, { merge: true });
    await loadTotalClaps(); // Update count
  });
}

// Initial load
window.addEventListener("DOMContentLoaded", loadTotalClaps);
