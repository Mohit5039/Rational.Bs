


function goBack() {
    window.history.back();
  }

  const modeToggleBtn = document.getElementById('mode-toggle');

function updateModeText(isLight) {
  modeToggleBtn.textContent = isLight ? 'Dark Mode' : 'Light Mode';
}

modeToggleBtn.addEventListener('click', () => {
  const isLightMode = document.body.classList.toggle('light-mode');
  updateModeText(isLightMode);
});

// Initialize button text based on current mode
updateModeText(document.body.classList.contains('light-mode'));




