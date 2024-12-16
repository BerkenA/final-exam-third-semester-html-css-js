import { singleProfile } from "../api/constants";

const accessToken = sessionStorage.getItem("authToken");
const profileName = sessionStorage.getItem("username");
const profileContainer = document.getElementById("profileContainer");
const listingsContainer = document.getElementById("listingsContainer");

if (!accessToken || !profileName) {
  alert("You need to be logged in to view this page. Redirecting to login...");
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
        profileContainer.innerHTML = `
          <h2 class="text-3xl font-bold text-deepBlue mb-4">${profile.name}</h2>
          <div class="relative mb-6 w-full">
            <img 
              src="${profile.banner.url}" 
              alt="${profile.banner.alt}" 
              class="w-full h-48 object-cover rounded-lg"
            >
            <img 
              src="${profile.avatar.url}" 
              alt="${profile.avatar.alt}" 
              class="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-24 h-24 rounded-full border-4 border-white"
            >
          </div>
          <div class="mb-4 text-deepBlue">
            <p><strong>Email:</strong> ${profile.email}</p>
            <p><strong>Bio:</strong> ${profile.bio || "No bio available"}</p>
            <p><strong>Credits:</strong> ${profile.credits}<i class="fa-solid fa-dollar-sign ml-1" style="color: #039b6d;"></i></p>
            <p><strong>Listings:</strong> ${profile._count.listings}</p>
            <p><strong>Wins:</strong> ${profile._count.wins}</p>
          </div>
          <div>
            <button 
              id="updateProfileBtn" 
              class="mt-4 px-4 py-2 bg-deepBlue text-gold rounded hover:bg-deepBlue"
            >
              Update Profile
            </button>
          </div>
        `;
        document
          .getElementById("updateProfileBtn")
          .addEventListener("click", () => {
            window.location.href = `/profile/update.html?name=${profileName}`;
          });
        fetchAllListingsByProfile();
      } else {
        alert("Failed to load profile data.");
      }
    })
    .catch((error) => {
      alert("An error occurred while fetching the profile data.");
      console.error("Error fetching profile data:", error);
    });
}

function fetchAllListingsByProfile() {
  const username = sessionStorage.getItem("username");
  if (!username) {
    alert(
      "No username found in session storage. Redirecting to the homepage..."
    );
    window.location.href = "/post/index.html";
    return;
  }

  fetch(`${singleProfile}${username}/listings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Noroff-API-Key": "1f97b65c-a547-4b91-b53e-37d6788e675b",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.data && data.data.length > 0) {
        listingsContainer.innerHTML += `
          <h3 class="text-xl font-bold text-deepBlue mb-4">Listings by ${username}</h3>
          <ul class="space-y-4">
            ${data.data
              .map(
                (listing) => `
                  <li class="bg-white p-4 rounded-lg shadow border border-gray-300">
                  <a href="/post/listings.html?id=${listing.id}">
                    <h4 class="text-lg font-semibold text-deepBlue">${listing.title}</h4>
                    <p class="text-deepBlue">${listing.description}</p>
                    <p class="text-deepBlue"><span class="font-bold">Ends at:</span> ${new Date(
                      listing.endsAt
                    ).toLocaleString()}</p>
                    <p class="text-deepBlue"><span class="font-bold">Bids:</span> ${listing._count.bids}</p>
                    <img src="${listing.media[0].url}" alt="${listing.media[0].alt}" class="mt-4 rounded max-w-[200px]">
                    </a>
                    <br>
                    <button 
                      class="bg-deepBlue text-gold px-4 py-2 rounded mt-4 hover:bg-gold hover:text-deepBlue transition"
                      onclick="location.href='/profile/edit-listing.html?id=${listing.id}'">
                      Edit
                    </button>
                  </li>
                `
              )
              .join("")}
          </ul>
        `;
      } else {
        listingsContainer.innerHTML = `<p class="text-gray-700">No listings found for this profile.</p>`;
      }
    })
    .catch((error) => {
      listingsContainer.innerHTML = `<p class="text-red-600">Failed to load listings.</p>`;
      console.error("Error fetching listings:", error);
    });
}

fetchProfileData();
