import { auth, db } from "./firebase.js";
import {
  doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  currentUser = user;
  await loadContactInfo();
});

const contactFields = {
  email: document.getElementById("contact-email"),
  useLoginEmail: document.getElementById("use-login-email"),
  instagram: document.getElementById("contact-instagram"),
  twitter: document.getElementById("contact-twitter"),
  linkedin: document.getElementById("contact-linkedin"),
};

document.getElementById("saveContactBtn").addEventListener("click", saveContactInfo);

contactFields.useLoginEmail.addEventListener("change", () => {
  contactFields.email.disabled = contactFields.useLoginEmail.checked;
  if (contactFields.useLoginEmail.checked) {
    contactFields.email.value = currentUser?.email || "";
  }
});

async function loadContactInfo() {
  const userDocRef = doc(db, "users", currentUser.uid);
  const userSnap = await getDoc(userDocRef);

  if (!userSnap.exists()) return;

  const data = userSnap.data();
  const contact = data.contact || {};

  // If stored email equals login email, assume checkbox was used
  if (contact.email === currentUser.email) {
    contactFields.useLoginEmail.checked = true;
    contactFields.email.disabled = true;
  }

  contactFields.email.value = contact.email || currentUser.email;
  contactFields.instagram.value = contact.instagram || "";
  contactFields.twitter.value = contact.twitter || "";
  contactFields.linkedin.value = contact.linkedin || "";
}

async function saveContactInfo() {
  const emailToSave = contactFields.useLoginEmail.checked
    ? currentUser.email
    : contactFields.email.value.trim();

  const contactData = {
    email: emailToSave,
    instagram: contactFields.instagram.value.trim(),
    twitter: contactFields.twitter.value.trim(),
    linkedin: contactFields.linkedin.value.trim(),
  };

  try {
    const userDocRef = doc(db, "users", currentUser.uid);
    await updateDoc(userDocRef, { contact: contactData });
    alert("✅ Contact info updated!");
  } catch (err) {
    console.error("❌ Failed to save contact info:", err);
    alert("Failed to update contact info.");
  }
}
