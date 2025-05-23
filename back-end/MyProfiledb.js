import { auth, db, storage } from './firebase.js';
import {
  doc, setDoc, getDoc, query, collection, where, getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

// Debug: Confirm script is loaded
console.log("✅ MyProfileDB.js loaded");

// Detect Current User and Fetch Profile
export function initProfile(callback) {
  onAuthStateChanged(auth, async (user) => {
    console.log("👤 Auth check:", user);
    if (user) {
      const uid = user.uid;
      const email = user.email;
      const profileDoc = doc(db, "users", uid);
      let data = {
        email,
        username: "",
        bio: "",
        photoURL: ""
      };

      try {
        const snap = await getDoc(profileDoc);

        if (snap.exists()) {
          const profile = snap.data();
          data.username = profile.username || "";
          data.bio = profile.bio || "";
          data.photoURL = profile.photoURL || "";
          console.log("📥 Profile data loaded:", data);
        } else {
          const randomUsername = await generateRandomUsername();
        data.username = randomUsername;
        console.log("🆕 Generated username:", randomUsername);
        }

        callback(data);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        callback(null);
      }
    } else {
      console.warn("⚠️ No user signed in.");
      callback(null);
    }
  });
}

// Save or Update Profile Info
export async function saveUserProfile({ username = "", bio = "", photoURL = "" }) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not logged in");
  }

  const uid = user.uid;
  const profileRef = doc(db, "users", uid);

  try {
    const currentDoc = await getDoc(profileRef);
    const existingData = currentDoc.exists() ? currentDoc.data() : {};

    const updatedData = {
      username: username || existingData.username || "",
      bio: bio || existingData.bio || "",
      photoURL: photoURL || existingData.photoURL || "",
      email: user.email
    };

    await setDoc(profileRef, updatedData, { merge: true });

    console.log("✅ Profile saved/updated:", updatedData);
  } catch (error) {
    console.error("❌ Failed to save profile:", error);
    throw error;
  }
}

// Check Username Uniqueness
export async function isUsernameTaken(username) {
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);

  const currentUser = auth.currentUser;

  for (const docSnap of querySnapshot.docs) {
    if (docSnap.id !== currentUser.uid) {
      console.warn("⚠️ Username already taken:", username);
      return true;
    }
  }

  console.log("✅ Username is unique:", username);
  return false;
}

// Upload Profile Picture
export async function uploadProfilePicture(file) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not logged in");
  }

  try {
    console.log("📤 Uploading image:", file.name);

    const storageRef = ref(storage, `profilePics/${user.uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    console.log("✅ Image uploaded. URL:", downloadURL);

    // Only update photoURL while preserving existing username and bio
    const currentDoc = await getDoc(doc(db, "users", user.uid));
    const existingData = currentDoc.exists() ? currentDoc.data() : {};

    await saveUserProfile({
      username: existingData.username || "",
      bio: existingData.bio || "",
      photoURL: downloadURL
    });

    return downloadURL;
  } catch (error) {
    console.error("❌ Error during image upload:", error);
    throw error;
  }
}

// Generate random username like user0001, user0002...
async function generateRandomUsername() {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const count = usersSnapshot.size + 1;
  const randomUsername = "user" + count.toString().padStart(4, '0');
  return randomUsername;
}
