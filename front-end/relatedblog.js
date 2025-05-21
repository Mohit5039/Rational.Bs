import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const db = getFirestore();

const urlParams = new URLSearchParams(window.location.search);
const currentBlogId = urlParams.get("id");

const relatedBlogsContainer = document.getElementById("related-blogs");

async function fetchRelatedBlogs(category) {
  if (!category) return [];

  const blogsRef = collection(db, "blogs");
  const q = query(blogsRef, where("category", "==", category));
  const querySnapshot = await getDocs(q);

  const relatedBlogs = [];
  querySnapshot.forEach(doc => {
    if (doc.id !== currentBlogId) {
      relatedBlogs.push({ id: doc.id, ...doc.data() });
    }
  });

  return relatedBlogs;
}

async function loadRelatedBlogs() {
  if (!currentBlogId) return;

  // Fetch all blogs to find current blog's category
  const allBlogsSnapshot = await getDocs(collection(db, "blogs"));
  let currentCategory = null;

  for (const doc of allBlogsSnapshot.docs) {
    if (doc.id === currentBlogId) {
      currentCategory = doc.data().category;
      break;
    }
  }

  if (!currentCategory) {
    relatedBlogsContainer.innerHTML = "<p>No related blogs found.</p>";
    return;
  }

  const relatedBlogs = await fetchRelatedBlogs(currentCategory);

  if (relatedBlogs.length === 0) {
    relatedBlogsContainer.innerHTML = "<p>No related blogs found.</p>";
    return;
  }

  // Clear previous content
  relatedBlogsContainer.innerHTML = "";

  // Create cards with image URLs and click handler
  relatedBlogs.forEach(blog => {
    const card = document.createElement("div");
    card.classList.add("related-blog-card");
    card.style.cursor = "pointer";  // pointer cursor on hover

    // Use blog.imageURL or fallback to default image
    const imageUrl = blog.imageURL || "default-image.jpg";

    card.innerHTML = `
    <img src="${imageUrl}" alt="${blog.title}" class="related-blog-image" />
    <p class="related-blog-title">${blog.title}</p>
  `;
  
  card.onclick = () => {
    window.location.href = `read-blogs.html?id=${blog.id}`;
};
  
    relatedBlogsContainer.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", loadRelatedBlogs);
