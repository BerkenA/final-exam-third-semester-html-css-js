const logoutButton = document.querySelector(".logoutButton");

function logout() {
  sessionStorage.removeItem("authToken");
  alert("You have been logged out!");
  window.location.href = "/auth/index.html";
}

document.addEventListener("click", logout);
