import { registerUrl } from "../api/constants";

const registrationForm = document.getElementById("registrationForm");

//Function for creating a new user
function createUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;

  const confirmPasswordInput = document.getElementById("confirmPassword");
  const confirmPasswordValue = confirmPasswordInput.value;

  if (password !== confirmPasswordValue) {
    alert("Oops, the passwords doesn't match!");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name: name,
    email: email,
    password: password,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(registerUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorResponse) => {
          throw new Error(errorResponse.errors[0].message);
        });
      }
      return response.json;
    })
    .then((result) => {
      window.alert("Registration was successful");
      window.location.href = "/auth/index.html";
    })
    .catch((error) => {
      console.error(error);
      window.alert("Oops, there was an error: ", error);
    });
}

//Eventlistener for the register button
registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();
  createUser();
});