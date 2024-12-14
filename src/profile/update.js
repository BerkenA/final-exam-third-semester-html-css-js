import { singleProfile } from "../api/constants";

const accessToken = sessionStorage.getItem("authToken");
const profileName = new URLSearchParams(window.location.search).get("name");
const updateProfileForm = document.getElementById("updateProfileForm");

if (!accessToken) {
  alert(
    "You need to be logged in to update your profile. Redirecting to login..."
  );
  window.location.href = "/auth/index.html";
}

if (!profileName) {
  alert("No profile name found in URL. Redirecting to login...");
  window.location.href = "/auth/index.html";
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

        document.getElementById("bio").value = profile.bio || "";
        document.getElementById("avatar").value = profile.avatar.url || "";
        document.getElementById("banner").value = profile.banner.url || "";
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

function submitUpdateProfile(event) {
  event.preventDefault();

  const formData = new FormData(updateProfileForm);

  const updatedData = {
    bio: formData.get("bio"),
    avatar: {
      url: formData.get("avatar"),
      alt: "",
    },
    banner: {
      url: formData.get("banner"),
      alt: "",
    },
  };

  fetch(`${singleProfile}${profileName}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Noroff-API-Key": "1f97b65c-a547-4b91-b53e-37d6788e675b",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (response.ok) {
        alert("Profile updated successfully!");
        window.location.href = `/profile/index.html?name=${profileName}`;
      } else {
        return response.json().then((errorData) => {
          throw new Error(errorData.message || "Failed to update profile.");
        });
      }
    })
    .catch((error) => {
      alert("An error occurred while updating the profile.");
      console.error("Error updating profile:", error);
    });
}

updateProfileForm.addEventListener("submit", submitUpdateProfile);
