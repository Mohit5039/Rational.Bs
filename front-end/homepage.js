import { auth } from "/back-end/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Tab switching
const buttons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        buttons.forEach(btn => btn.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(tab).classList.add('active');
    });
});

// Profile dropdown
document.addEventListener("DOMContentLoaded", function () {
    const profileIcon = document.getElementById("profileIcon");
    const profileDropdown = document.getElementById("profileDropdown");

    if (profileIcon) {
        profileIcon.addEventListener("click", function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle("show");
        });

        document.addEventListener("click", function (e) {
            if (!e.target.closest(".profile-container")) {
                profileDropdown.classList.remove("show");
            }
        });
    }

    const writeBtn = document.getElementById("writeBtn");

if (writeBtn) {
    onAuthStateChanged(auth, (user) => {
        writeBtn.addEventListener("click", () => {
            if (user) {
                window.location.href = "write-options.html";
            } else {
                alert("Please log in to write content.");
            }
        });
    });
}

    // Auth state listener
    onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed. User is:", user);
        if (user) {
            document.querySelector(".logged-in-elements").style.display = "flex";
            document.querySelector(".logged-out-elements").style.display = "none";
        } else {
            document.querySelector(".logged-in-elements").style.display = "none";
            document.querySelector(".logged-out-elements").style.display = "flex";
        }
    });
});


