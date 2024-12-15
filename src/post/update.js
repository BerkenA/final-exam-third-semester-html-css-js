import { allListings } from "../api/constants";

const allListingsForm = document.querySelector(".updateListingForm");
const accessToken = sessionStorage.getItem("authToken");
const listingId = new URLSearchParams(window.location.search).get("id");
const imgPreview = document.getElementById("imagePreview");
const imgInput = document.getElementById("image");

if (!accessToken) {
  alert("You need to be logged in to see this page. Redirecting to login...");
  window.location.href = "/auth/index.html";
}

if (!listingId) {
  alert("No listing ID found. Redirecting to the homepage...");
  window.location.href = "/feed/index.html";
}

function fetchListingData() {
  fetch(`${allListings}/${listingId}`, {
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
        const listing = data.data;
        document.getElementById("title").value = listing.title || "";
        document.getElementById("description").value =
          listing.description || "";
        document.getElementById("tags").value = listing.tags.join(", ") || "";
        document.getElementById("image").value = listing.media[0]?.url || "";
        document.getElementById("altText").value = listing.media[0]?.alt || "";
      } else {
        alert("Failed to load listing data.");
      }
    })
    .catch((error) => {
      alert("An error occurred while fetching the listing data.");
      console.error("Error fetching listing data:", error);
    });
}

function previewImage() {
  imgPreview.innerHTML = `
    <label for="preview">
      Image preview:
    </label>
    <img src="${imgInput.value}" id="preview" alt="preview" style="width: 100%">`;

  if (imgInput.value.length > 13) {
    imgPreview.style.display = "flex";
  } else {
    imgPreview.style.display = "none";
  }
}

imgInput.addEventListener("input", previewImage);

function submitUpdateListing(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const updatedData = {
    title: formData.get("title"),
    description: formData.get("description"),
    tags:
      formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim()) || [],
    media: [
      {
        url: formData.get("image") || "",
        alt: formData.get("altText") || "",
      },
    ],
  };

  fetch(`${allListings}/${listingId}`, {
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
        alert("Listing updated successfully!");
        window.location.href = "/post/index.html";
      } else {
        return response.json().then((errorData) => {
          throw new Error(errorData.message || "Failed to update listing.");
        });
      }
    })
    .catch((error) => {
      alert(
        "An error occurred while updating the listing. Please try again later."
      );
      console.error("Error updating listing:", error);
    });
}

allListingsForm.addEventListener("submit", submitUpdateListing);
fetchListingData();
