import { db } from "../back-end/firebase.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(param);
  console.log(`[DEBUG] URL param ${param}:`, value);
  return value;
}

async function loadPublicProfile(uid) {
  console.log("[DEBUG] loadPublicProfile called with uid:", uid);
  if (!uid) {
    alert("No user specified.");
    return;
  }

  try {
    // Get user document
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      alert("User not found.");
      console.error("[ERROR] User document not found for uid:", uid);
      return;
    }
    const userData = userSnap.data();
    console.log("[DEBUG] User data fetched:", userData);

    // Set profile info
    document.getElementById("profile-photo").src =
      userData.photoURL || "default-profile.png";
    document.getElementById("profile-username").textContent =
      userData.username || "Unknown User";
    document.getElementById("profile-bio").textContent = userData.bio || "";

    // Render contact info
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = ""; // clear
    const contact = userData.contact || {};
    console.log("[DEBUG] Contact info:", contact);

    function addContactItem(name, url, displayText) {
      console.log(`[DEBUG] Adding contact item: ${name} - ${url}`);
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = displayText;
      li.appendChild(a);
      contactList.appendChild(li);
    }

    // Email
    if (contact.email) {
      addContactItem("email", `mailto:${contact.email}`, contact.email);
    }

    // Instagram username to URL
    if (contact.instagram) {
      let instaUsername = contact.instagram.trim();
      if (instaUsername.startsWith("@")) {
        instaUsername = instaUsername.slice(1);
      }
      addContactItem("instagram", `https://instagram.com/${instaUsername}`, "Instagram");
    }

    // Twitter username to URL
    if (contact.twitter) {
      let twitterUsername = contact.twitter.trim();
      if (twitterUsername.startsWith("@")) {
        twitterUsername = twitterUsername.slice(1);
      }
      addContactItem("twitter", `https://twitter.com/${twitterUsername}`, "Twitter");
    }

    // LinkedIn username/url
    if (contact.linkedin) {
      let linkedinUrl = contact.linkedin.trim();
      if (!linkedinUrl.startsWith("http")) {
        linkedinUrl = `https://linkedin.com/in/${linkedinUrl}`;
      }
      addContactItem("linkedin", linkedinUrl, "LinkedIn");
    }

    // Fetch blogs by this user
    const blogsContainer = document.getElementById("blogs-container");
    blogsContainer.innerHTML = "Loading blogs...";
    console.log("[DEBUG] Fetching blogs for user:", uid);

    const blogsQuery = query(
      collection(db, "blogs"),
      where("uid", "==", uid),
      
    );

    const blogsSnap = await getDocs(blogsQuery);

    if (blogsSnap.empty) {
      blogsContainer.innerHTML = "<p>No blogs published yet.</p>";
      console.log("[DEBUG] No blogs found for user:", uid);
      return;
    }

    blogsContainer.innerHTML = "";
    blogsSnap.forEach((doc) => {
      const blog = doc.data();
      console.log("[DEBUG] Blog fetched:", blog.title);
      const card = document.createElement("div");
      card.className = "blog-card";
      card.innerHTML = `
        <h3>${blog.title || "Untitled"}</h3>
        <p>${(blog.subtitle || blog.content || "").slice(0, 120)}...</p>
        <button onclick="location.href='read-blogs.html?id=${doc.id}&type=blogs'">Read</button>
      `;
      blogsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("[ERROR] Error loading public profile:", error);
    alert("Failed to load profile data.");
  }
}

window.onload = () => {
  const uid = getQueryParam("uid");
  loadPublicProfile(uid);
};
