const logoutBtn = document.getElementById('logoutBtn');
const modalOverlay = document.getElementById('modalOverlay');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');
const logoutPassword = document.getElementById('logoutPassword');

logoutBtn.addEventListener('click', () => {
  logoutPassword.value = "";
  modalOverlay.classList.add('show');
  modalOverlay.querySelector('.modal').classList.add('show');
});

cancelLogout.addEventListener('click', () => {
  modalOverlay.classList.remove('show');
  modalOverlay.querySelector('.modal').classList.remove('show');
});

confirmLogout.addEventListener('click', () => {
  if (logoutPassword.value === "Sudhanshu100@112") {
    alert("Logout successful!");
    window.location.href = 'login.html';
  } else {
    alert("Incorrect password!");
  }
});
