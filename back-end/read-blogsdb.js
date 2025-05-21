// read-blogs.js
import { db } from "/back-end/firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Step 1: Get Blog ID from URL
function loadBlogFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");
  if (blogId) {
    fetchBlog(blogId);
  } else {
    console.error("No blog ID found in URL.");
  }
}



// Step 2: Fetch blog from Firestore by ID
async function fetchBlog(id) {
  try {
    const docRef = doc(db, "blogs", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const blogData = docSnap.data();
      displayBlog(blogData);
    } else {
      console.error("No blog found with this ID.");
    }
  } catch (error) {
    console.error("Error fetching blog:", error);
  }
}

// Step 3: Populate the blog page with fetched data
function displayBlog(data) {
  document.querySelector(".blog-title").textContent = data.title || "";
  document.querySelector(".blog-subtitle").textContent = data.subtitle || "";
 // Convert newlines to paragraphs for better formatting:
 if (data.content) {
  const paragraphs = data.content.split('\n').filter(p => p.trim() !== '');
  const formattedContent = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  document.querySelector(".blog-content").innerHTML = formattedContent;
} else {
  document.querySelector(".blog-content").innerHTML = "";
}

  if (data.imageURL) {
    document.getElementById("coverImage").src = data.imageURL;
  }

  document.querySelector(".author-name").textContent = data.author || "Anonymous";

  const dateElement = document.querySelector(".date");
  if (data.createdAt && data.createdAt.seconds) {
    const date = new Date(data.createdAt.seconds * 1000);
    dateElement.textContent = date.toLocaleDateString();
  } else {
    dateElement.textContent = "Unknown Date";
  }

  document.getElementById("category").textContent = data.category || "Others";
  document.getElementById("keywords").textContent = (data.keywords || []).join(", ");
}
// Simple escape function to avoid HTML injection if content is plain text:
function escapeHtml(text) {
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



// Add a comment to Firestore under the blog's subcollection
export async function addCommentToBlog(blogId, user, commentText) {
  const commentRef = collection(db, "blogs", blogId, "comments");
  await addDoc(commentRef, {
    user: user.email,
    text: commentText,
    createdAt: new Date()
  });
}

// Fetch comments for a blog
export async function fetchComments(blogId) {
  const commentRef = collection(db, "blogs", blogId, "comments");
  const q = query(commentRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
}

window.addEventListener("DOMContentLoaded", loadBlogFromURL);
