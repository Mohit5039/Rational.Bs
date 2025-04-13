// read-blogs.js
import { db } from "/back-end/firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Step 1: Get Blog ID from URL
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get("id");
console.log("Blog ID in URL:", blogId); 
if (!blogId) {
  console.error("No blog ID found in URL.");
} else {
  fetchBlog(blogId);
}

// Step 2: Fetch blog from Firestore
async function fetchBlog(id) {
  try {
    const docRef = doc(db, "blogs", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const blogData = docSnap.data();
      displayBlog(blogData);
    } else {
      console.log("No such blog!");
    }
  } catch (error) {
    console.error("Error fetching blog:", error);
  }
}

// Step 3: Populate the Blog Reading Page
function displayBlog(data) {
  document.querySelector(".blog-title").textContent = data.title || "";
  document.querySelector(".blog-subtitle").textContent = data.subtitle || "";
  document.querySelector(".blog-content").innerHTML = data.content || "";
  if (data.imageURL) {
    document.getElementById("coverImage").src = data.imageURL;  // Set the image URL here
  }


  document.querySelector(".author-name").textContent = data.author || "Anonymous";
  
  const dateElement = document.querySelector(".date");
  if (data.createdAt && data.createdAt.seconds) {
    const date = new Date(data.createdAt.seconds * 1000);
    dateElement.textContent = date.toLocaleDateString();
  }
   else {
    dateElement.textContent = "Unknown Date";
  }

  // Category and keywords
  document.getElementById("category").textContent = data.category || "Others";
  document.getElementById("keywords").textContent = (data.keywords || []).join(", ");
}
