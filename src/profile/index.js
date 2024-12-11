import { singleProfile } from "../api/constants";

const accessToken = sessionStorage.getItem("authToken");
const profileName = sessionStorage.getItem("username");
const profileContainer = document.querySelector("#profileContainer");

if (!accessToken) {
  alert("You need to be logged in to view this page. Redirecting to login...");
  window.location.href = "/auth/index.html";
}

if (!profileName) {
  alert("No profile name found in URL. Redirecting to the homepage...");
  window.location.href = "/post/index.html";
}

function fetchProfileData() {
  fetch(`${singleProfile}${profileName}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Noroff-API-Key": "1f97b65c-a547-4b91-b53e-37d6788e675b",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.data) {
        const profile = data.data;
        profileContainer.innerHTML = `
          <h2>${profile.name}</h2>
          <div>
          <button id="updateProfileBtn">Update Profile</button>
          </div>
          <p>Email: ${profile.email}</p>
          <p>Bio: ${profile.bio || "No bio available"}</p>
          <p>Credits: ${profile.credits}</p>
          <p>Listings: ${profile._count.listings}</p>
          <p>Wins: ${profile._count.wins}</p>
          
          <div>
            <h3>Avatar:</h3>
            <img src="${profile.avatar.url}" alt="${profile.avatar.alt}" style="max-width: 150px;">
          </div>

          <div>
            <h3>Banner:</h3>
            <img src="${profile.banner.url}" alt="${profile.banner.alt}" style="max-width: 100%; height: auto;">
          </div>
        `;
        document
          .getElementById("updateProfileBtn")
          .addEventListener("click", () => {
            window.location.href = `/profile/update.html?name=${profileName}`;
          });
      } else {
        alert("Failed to load profile data.");
      }
    })
    .catch((error) => {
      alert("An error occurred while fetching the profile data.");
      console.error("Error fetching profile data:", error);
    });
}

fetchProfileData();
