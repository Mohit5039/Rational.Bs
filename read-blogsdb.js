import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

function loadBlogFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");
  if (blogId) {
    fetchBlog(blogId);
  } else {
    console.error("No blog ID found in URL.");
  }
}

async function fetchBlog(id) {
  try {
    const docRef = doc(db, "blogs", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const blogData = docSnap.data();

      // Fetch user profile for username
      let username = null;
      if (blogData.uid) {
        const userRef = doc(db, "users", blogData.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          username = userData.username || userData.email || null;
        }
      }

      displayBlog(blogData, username);
    } else {
      console.error("No blog found with this ID.");
    }
  } catch (error) {
    console.error("Error fetching blog:", error);
  }
}

function displayBlog(data, username) {
  document.querySelector(".blog-title").textContent = data.title || "";
  document.querySelector(".blog-subtitle").textContent = data.subtitle || "";

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

  const authorSpan = document.querySelector(".author-name");
  if (data.uid) {
    const displayName = username || "Unknown Author";
    authorSpan.innerHTML = `<a href="PublicProfile.html?uid=${data.uid}" class="author-link">${displayName}</a>`;
  } else {
    authorSpan.textContent = data.author || "Anonymous";
  }

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

window.addEventListener("DOMContentLoaded", loadBlogFromURL);
