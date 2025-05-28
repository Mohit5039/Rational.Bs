import {
  initProfile,
  saveUserProfile,
  uploadProfilePicture,
  isUsernameTaken
} from '/back-end/MyProfiledb.js';

// Handle sidebar section switching
document.querySelectorAll('.sidebar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const sectionToShow = btn.getAttribute('data-section');
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('visible');
    });
    document.getElementById(`${sectionToShow}-section`).classList.add('visible');
  });
});

// Load user data on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initProfile((data) => {
    if (!data) return alert("User not signed in.");

    document.getElementById('email').value = data.email;
    document.getElementById('username').value = data.username;
    document.getElementById('bio').value = data.bio;
    document.getElementById('profilePicPreview').src = data.photoURL || '/front-end/assests/default-avatar.png';
  });

  // Handle save
  document.getElementById('saveProfileBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const bio = document.getElementById('bio').value.trim();
    const photoURL = document.getElementById('profilePicPreview').src;

    if (!username) return alert("Username can't be empty");

    const taken = await isUsernameTaken(username);
    if (taken) return alert("Username already taken");

    try {
      await saveUserProfile({ username, bio, photoURL });
      alert("Profile saved!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save profile.");
    }
  });

  // Handle profile picture upload
  document.getElementById('profilePicInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadProfilePicture(file);
        document.getElementById('profilePicPreview').src = url;
        alert("Profile picture updated!");
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Failed to upload picture.");
      }
    }
  });
});
