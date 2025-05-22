// Section Switching
document.querySelectorAll('.sidebar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Highlight active button
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show corresponding section
    const sectionToShow = btn.getAttribute('data-section');
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('visible');
    });
    document.getElementById(`${sectionToShow}-section`).classList.add('visible');
  });
});

// Write button click
document.getElementById('writeBtn').addEventListener('click', () => {
  window.location.href = 'write-options.html';
});
