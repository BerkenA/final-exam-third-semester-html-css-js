import { loginUrl } from "../api/constants";

const loginForm = document.getElementById("loginForm");
const displayError = document.getElementById("errorDiv");
const loginEndpoint = loginUrl;

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = { email, password };

  try {
    const response = await fetch(oginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      let errorMessage = "Login failed. Please try again.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.errors?.[0]?.message || errorMessage;
      } catch (jsonError) {
        console.error("Error parsing error response:", jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const accessToken = data.data.accessToken;
    const name = data.data.name;

    alert("Login successful");
    sessionStorage.setItem("authToken", accessToken);
    sessionStorage.setItem("username", name);
    window.location.href = "../post/index.html";
  } catch (error) {
    displayError.style.display = "block";
    displayError.innerHTML = `<p>${error.message}</p>`;
    console.log(displayError);
  }
});

document.getElementById("registerButton").addEventListener("click", () => {
  window.location.href = "../auth/register.html";
});
