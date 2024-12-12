import { createListing } from "../api/constants";

const listingForm = document.querySelector(".createListingForm");
const accessToken = sessionStorage.getItem("authToken");
const imgPreview = document.getElementById("imagePreview");
const imgInput = document.getElementById("image");

if (!accessToken) {
  alert("You need to be logged in to see this page. Redirecting to login...");
  window.location.href = "/auth/index.html";
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

function submitListing(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  if (
    !formData.get("title") ||
    !formData.get("description") ||
    !formData.get("endsAt")
  ) {
    alert("Please fill out all required fields.");
    return;
  }

  const listingData = {
    title: formData.get("title"),
    description: formData.get("description"),
    tags:
      formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim()) || [],
    media: [
      {
        url: formData.get("image"),
        alt: formData.get("altText") || "",
      },
    ],
    endsAt: formData.get("endsAt"),
  };

  fetch(createListing, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Noroff-API-Key": `1f97b65c-a547-4b91-b53e-37d6788e675b`,
    },
    body: JSON.stringify(listingData),
  })
    .then((response) => {
      if (response.ok) {
        alert("Listing created successfully!");
        window.location.href = "/post/index.html";
      } else {
        return response.json().then((errorData) => {
          throw new Error(errorData.message || "Failed to create listing.");
        });
      }
    })
    .catch((error) => {
      alert(
        "An error occurred while creating the listing. Please try again later."
      );
      console.error("Error creating listing:", error);
    });
}

listingForm.addEventListener("submit", submitListing);
