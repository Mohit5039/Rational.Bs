// comments.js
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { db } from "/firebase.js";  // Your Firebase config and Firestore init here
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const auth = getAuth();
let currentUser = null;

// Track logged-in user
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  console.log(user ? "User logged in: " + user.email : "No user logged in");
});

// Get blog ID from URL
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get("id");

const submitCommentBtn = document.querySelector('.submit-comment-btn');
const commentTextArea = document.querySelector('.comment-input textarea');

if (submitCommentBtn) {
  submitCommentBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to post a comment.");
      return;
    }

    const commentText = commentTextArea.value.trim();
    if (!commentText) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      await addCommentToBlog(blogId, currentUser.email, commentText);
      commentTextArea.value = "";  // Clear textarea after posting
      await loadComments();        // Refresh comment list
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  });
}

async function addCommentToBlog(blogId, userEmail, text) {
  if (!blogId) {
    throw new Error("Blog ID missing");
  }

  const commentsRef = collection(db, "blogs", blogId, "comments");

  await addDoc(commentsRef, {
    user: userEmail,
    text: text,
    createdAt: serverTimestamp()
  });
}

async function loadComments() {
  if (!blogId) return;

  const commentsRef = collection(db, "blogs", blogId, "comments");
  const q = query(commentsRef, orderBy("createdAt", "desc"));

  try {
    const snapshot = await getDocs(q);
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = "";

    if (snapshot.empty) {
      commentList.innerHTML = "<p>No comments yet.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const comment = doc.data();
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");

      // Safely handle missing createdAt or user fields
      const time = comment.createdAt ? new Date(comment.createdAt.seconds * 1000).toLocaleString() : "Just now";
      const user = comment.user || "Anonymous";

      commentDiv.innerHTML = `
        <p class="comment-author">${user}</p>
        <p class="comment-text">${escapeHtml(comment.text)}</p>
        <p class="comment-time">${time}</p>
      `;

      commentList.appendChild(commentDiv);
    });
  } catch (error) {
    console.error("Error loading comments:", error);
  }
}

// Simple escape function to avoid HTML injection in comments
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function (m) {
    return {
      '&': "&amp;",
      '<': "&lt;",
      '>': "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m];
  });
}

// Load comments on page load
window.addEventListener("DOMContentLoaded", loadComments);
