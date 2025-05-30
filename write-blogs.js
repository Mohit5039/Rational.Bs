import { uploadBlogImage, saveBlogPost } from "./writeblogsdb.js";
import { auth } from "./firebase.js";  // Ensure correct import for Firebase Auth

document.addEventListener("DOMContentLoaded", function () {
  // --- Keyword Tagging ---
  const keywordInput = document.getElementById("keyword-input");
  const keywordBox = document.getElementById("keyword-box");
  let keywords = [];

  if (keywordInput && keywordBox) {
    keywordInput.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && keywordInput.value.trim() !== "") {
        e.preventDefault();
        const keyword = keywordInput.value.trim().toLowerCase();

        if (keywords.length >= 10) {
          alert("You can only add up to 10 keywords.");
          return;
        }

        if (!keywords.includes(keyword)) {
          keywords.push(keyword);
          const tag = document.createElement("span");
          tag.textContent = keyword;

          const closeBtn = document.createElement("span");
          closeBtn.textContent = "×";
          closeBtn.className = "keyword-x";

          closeBtn.addEventListener("click", () => {
            keywords = keywords.filter(k => k !== keyword);
            keywordBox.removeChild(tag);
          });

          tag.className = "keyword-tag";
          tag.appendChild(closeBtn);
          keywordBox.appendChild(tag);
        }
        keywordInput.value = "";
      }
    });
  }

  // --- Image Upload Preview ---
  const imageInput = document.getElementById("image-upload");
  const imageDisplayContainer = document.getElementById("image-display-container");

  if (imageInput && imageDisplayContainer) {
    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
          const img = document.createElement("img");
          img.src = event.target.result;
          img.alt = "Uploaded Image";
          img.classList.add("uploaded-image");

          imageDisplayContainer.innerHTML = "";
          imageDisplayContainer.appendChild(img);
        };

        reader.readAsDataURL(file);
      }
    });
  }

  // --- Toggle Dark/Light Mode ---
  document.getElementById("mode-toggle").addEventListener("click", function() {
    const writingArea = document.getElementById("writing-area-container");

    // Force toggle between the two modes
    const isDarkMode = writingArea.classList.contains("dark-mode");

    // Remove both classes first
    writingArea.classList.remove("dark-mode");
    writingArea.classList.remove("light-mode");

    // Then add the appropriate class
    if (isDarkMode) {
      // Was dark, switching to light
      writingArea.classList.add("light-mode");
      this.textContent = "Dark Mode";
    } else {
      // Was light or neutral, switching to dark
      writingArea.classList.add("dark-mode");
      this.textContent = "Light Mode";
    }

    // Debug output
    console.log("Current classes:", writingArea.className);
  });

  // --- Blog Publishing ---
  const publishBtn = document.getElementById("publish-btn");
  const titleInput = document.getElementById("blog-title");
  const subtitleInput = document.getElementById("blog-subtitle");
  const contentInput = document.getElementById("writing-area");
  const categorySelect = document.getElementById("categorySelect");

  if (publishBtn && titleInput && subtitleInput && contentInput && categorySelect && imageInput && keywordBox) {
    function getKeywords() {
      const tags = keywordBox.querySelectorAll(".keyword-tag");
      return Array.from(tags).map(tag => tag.firstChild.textContent.trim());
    }

    publishBtn.addEventListener("click", async () => {
      const title = titleInput.value.trim();
      const subtitle = subtitleInput.value.trim();
      const content = contentInput.value.trim(); // Check this content value
      const category = categorySelect.value;
      const keywords = getKeywords();
      const imageFile = imageInput.files[0];

      console.log("Title:", title);
      console.log("Content:", content); // Log content to check its value

      if (!title || !content) {
        alert("Title and content are required.");
        return;
      }

      let imageURL = null;
      if (imageFile) {
        imageURL = await uploadBlogImage(imageFile);
        if (!imageURL) {
          alert("Image upload failed.");
          return;
        }
      }

      // Get the current authenticated user
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to publish a blog.");
        return;
      }

      const success = await saveBlogPost({
        title,
        subtitle,
        content,
        imageURL,
        category,
        keywords,
        uid: user.uid // Use the actual UID of the logged-in user
      });

      if (success) {
        alert("Blog published successfully!");
        // Reset form or redirect
      } else {
        alert("Failed to save blog.");
      }
    });
  } else {
    console.error("One or more required elements are missing from the HTML.");
  }
});
