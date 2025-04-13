// Import Firestore from firebase.js (already initialized)
import { db } from "./firebase.js"; // No need to initialize Firebase here

import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Create blog card HTML
function createBlogCard(blog) {
  const card = document.createElement("div");
  card.className = "blog-card";
  card.innerHTML = `
    <img src="${blog.imageURL}" class="blog-bg" alt="Blog Cover" />

    <div class="overlay">
      <div class="blog-content">
        <h3 class="blog-title">${blog.title}</h3>
        <p class="blog-excerpt">${blog.subtitle || "..."}</p>
       <button class="read-more-btn">Read More</button>

      </div>
      <div class="blog-footer">
        <span>by ${blog.author || "Unknown"}</span>
        <span class="category-badge">${blog.category}</span>
      </div>
    </div>
  `;
  const readMoreButton = card.querySelector(".read-more-btn");
  readMoreButton.addEventListener("click", () => {
    console.log("Read More clicked for blog:", blog.id); // Debug log
    goToBlogPage(blog.id);
  });

  return card;
}

function goToBlogPage(blogId) {
  window.location.href = `read-blogs.html?id=${blogId}`; // Navigates to the blog page with the blog ID in the URL
}

// Helper to find container by heading
function getCategoryContainer(category) {
  const allSections = document.querySelectorAll(".blog-section");
  for (let section of allSections) {
    const heading = section.querySelector(".section-heading");
    if (heading && heading.textContent.toLowerCase().includes(category.toLowerCase())) {
      return section.querySelector(".blog-scroll-container");
    }
  }
  return null;
}

// Fetch and render blogs
async function loadBlogs() {
  const latestBlogsContainer = document.getElementById("latest-blogs");
  if (!latestBlogsContainer) return;

  latestBlogsContainer.innerHTML = ""; // Clear any existing content

  const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const blog = doc.data();
     blog.id = doc.id; 

    console.log("Blog data:", blog);
    const card = createBlogCard(blog);

    const latestCard = createBlogCard(blog);
    const categoryCard = createBlogCard(blog);
    
    // 1. Add to Latest Blogs section
    latestBlogsContainer.appendChild(latestCard);
    

    // 2. Add to Category section
    const category = blog.category || "Other Blogs";
    const categoryContainer = getCategoryContainer(category);
    if (categoryContainer) {
      categoryContainer.appendChild(card);
    }
  });
}



// Load blogs on DOM ready
document.addEventListener("DOMContentLoaded", loadBlogs);

window.goToBlogPage = function(blogId) {
  console.log("Redirecting to blog with ID:", blogId); // Debug log
  window.location.href = `read-blogs.html?id=${blogId}`;
};
