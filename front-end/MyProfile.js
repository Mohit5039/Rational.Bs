import { initProfile, saveUserProfile, uploadProfilePicture, isUsernameTaken } from '/back-end/MyProfiledb.js';

// Section Switching
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

// Write button
document.getElementById('writeBtn').addEventListener('click', () => {
  window.location.href = 'write-options.html';
});

document.addEventListener('DOMContentLoaded', () => {
  initProfile((data) => {
    if (data) {
      document.getElementById('email').value = data.email;
      document.getElementById('username').value = data.username;
      document.getElementById('bio').value = data.bio;
      document.getElementById('profilePicPreview').src = data.photoURL || '/front-end/assests/default-avatar.png';
    }
  });

  document.getElementById('saveProfileBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const bio = document.getElementById('bio').value.trim();
    const photoURL = document.getElementById('profilePicPreview').src;

    if (!username) {
      alert("Username can't be empty.");
      return;
    }

    const taken = await isUsernameTaken(username);
    if (taken) {
      alert('Username already taken!');
      return;
    }

    try {
      await saveUserProfile({ username, bio, photoURL });
      alert('Profile saved successfully!');
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Something went wrong while saving profile.");
    }
  });

  document.getElementById('profilePicInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadProfilePicture(file);
      document.getElementById('profilePicPreview').src = url;
      alert('Profile picture updated!');
    }
  });
});
