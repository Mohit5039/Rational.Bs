import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

let currentUserUid = null;

// Load writings on auth
onAuthStateChanged(auth, (user) => {
  if (!user) return;
  currentUserUid = user.uid;
  loadWritings("blogs"); // default tab
});

// Tab switching
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const type = btn.getAttribute("data-type");
    loadWritings(type);
  });
});

// Load writings by type
async function loadWritings(type) {
  const container = document.getElementById("writingsContainer");
  container.innerHTML = "Loading...";

  try {
    const q = query(
      collection(db, type),
      where("uid", "==", currentUserUid)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      container.innerHTML = `<p>No ${type} published yet.</p>`;
      return;
    }

    container.innerHTML = "";
    snap.forEach(docSnap => {
      const data = docSnap.data();
      const shortText =
        data.description?.slice(0, 100) ||
        data.subtitle?.slice(0, 100) ||
        data.content?.slice(0, 100) ||
        "";

      const card = document.createElement("div");
      card.className = "writing-card";
      card.innerHTML = `
        <h3>${data.title || "Untitled"}</h3>
        <p>${shortText}...</p>
        <div class="card-actions">
          <button onclick="location.href='read-blogs.html?id=${docSnap.id}&type=${type}'">Read</button>
          <button class="delete-btn" data-id="${docSnap.id}" data-type="${type}">Delete</button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Failed to load writings:", err);
    container.innerHTML = "<p>Error loading data.</p>";
  }
}

// Delete handler
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-btn")) return;

  const id = e.target.getAttribute("data-id");
  const type = e.target.getAttribute("data-type");
  const confirmed = confirm("Are you sure you want to delete this writing?");
  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, type, id));
    alert("Deleted successfully.");
    loadWritings(type);
  } catch (err) {
    console.error("❌ Delete failed:", err);
    alert("Failed to delete. Please try again.");
  }
});
