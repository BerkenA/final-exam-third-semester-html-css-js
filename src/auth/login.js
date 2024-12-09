import { loginUrl } from "../api/constants";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const loginEndpoint = loginUrl;

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = {
    email,
    password,
  };

  try {
    const response = await fetch(loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed. Please try again.");
    }

    const data = await response.json();

    loginMessage.innerText = "Login successful!";
    loginMessage.style.color = "green";

    const { accessToken } = data.data;
    localStorage.setItem("authToken", accessToken);

    window.location.href = "index.html";
  } catch (error) {
    loginMessage.innerText = error.message;
    loginMessage.style.color = "red";
  }
});
