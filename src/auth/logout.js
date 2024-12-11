const logoutButton = document.querySelector(".logoutButton");

function logout() {
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("username");
  alert("You have been logged out!");
  window.location.href = "/index.html";
}

logoutButton.addEventListener("click", logout);
