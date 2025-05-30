import { auth } from './firebase.js'; // Fixed import path
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.querySelector('.back form');
  const loginForm = document.querySelector('.fornt form'); // typo kept from your HTML

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = signupForm.querySelector('input[type="email"]').value;
      const password = signupForm.querySelector('input[name="signup-password"]').value;
      const confirmPassword = signupForm.querySelector('input[name="confirm-password"]').value;

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          window.location.replace("./index.html");  // Fixed path to index.html
          signupForm.reset();
        })
        .catch(error => alert(error.message));
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
         window.location.replace("./index.html");  // Fixed path to index.html
          loginForm.reset();
        })
        .catch(error => alert(error.message));
    });
  }
});