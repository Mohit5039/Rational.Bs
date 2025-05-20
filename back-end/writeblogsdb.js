// Import Firebase modules
import { auth, db } from "./firebase.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Initialize Firebase Storage
const storage = getStorage();

// Upload image to Firebase Storage
export async function uploadBlogImage(file) {
  if (!file) return null;

  const imageRef = ref(storage, `blog-images/${Date.now()}_${file.name}`);

  try {
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
}

export async function saveBlogPost({ title, subtitle, content, imageURL, category, keywords, uid }) {
  try {
    const blogRef = collection(db, "blogs");
    await addDoc(blogRef, {
      title,
      subtitle,
      content,
      imageURL, // ✅ fixed key
      category,
      keywords,
      uid: uid || null,
      author: auth.currentUser?.displayName || auth.currentUser?.email || "Unknown",
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error saving blog post:", error);
    return false;
  }
}

