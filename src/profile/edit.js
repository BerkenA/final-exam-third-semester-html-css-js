import { allListings } from "../api/constants";

const form = document.querySelector(".createListingForm");
const deleteButton = document.getElementById("deleteButton");
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");
const accessToken = sessionStorage.getItem("authToken");

if (!accessToken || !listingId) {
  alert("You need to be logged in to edit a listing");
  window.location.href = "/auth/index.html";
}

function fetchListingDetails() {
  fetch(`${allListings}/${listingId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": "1f97b65c-a547-4b91-b53e-37d6788e675b",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        document.getElementById("title").value = data.data.title;
        document.getElementById("description").value = data.data.description;
        document.getElementById("tags").value = data.data.tags?.join(", ");

        if (data.data.media?.length) {
          document.getElementById("altText").value = data.data.media[0].alt;
          document.getElementById("image").value = data.data.media[0].url;
        }
      } else {
        console.error("No data found");
      }
    })
    .catch((error) => {
      console.error("Error fetching listing details:", error);
    });
}

function updateListing(event) {
  event.preventDefault();
  const updatedData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    tags: document
      .getElementById("tags")
      .value.split(",")
      .map((tag) => tag.trim()),
    media: [
      {
        url: document.getElementById("image").value,
        alt: document.getElementById("altText").value,
      },
    ],
  };

  fetch(`${allListings}/${listingId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": "1f97b65c-a547-4b91-b53e-37d6788e675b",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to update");
      alert("Listing updated successfully.");
      window.location.href = "/profile/index.html";
    })
    .catch(console.error);
}

function deleteListing() {
  if (confirm("Are you sure you want to delete this listing?")) {
    fetch(`${allListings}/${listingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": "1f97b65c-a547-4b91-b53e-37d6788e675b",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete listing");
        alert("Listing deleted successfully.");
        window.location.href = "/profile/index.html";
      })
      .catch(console.error);
  }
}

form.addEventListener("submit", updateListing);
deleteButton.addEventListener("click", deleteListing);

fetchListingDetails();
