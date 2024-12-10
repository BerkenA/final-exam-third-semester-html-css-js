import { singleListing } from "../api/constants.js";

function getPostIdFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

async function getPostById(postId) {
  const postUrl = `${singleListing}/${postId}?includeDetails=true`;
  try {
    const response = await fetch(postUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Post not found.");
    }

    const data = await response.json();

    function renderPost(listing) {
      const container = document.querySelector(".postContainer");
      container.innerHTML = `
            <h1>${listing.title}</h1>
            <p>${listing.description || "No description provided"}</p>
            <div><strong>Tags:</strong> ${listing.tags.join(", ")}</div>
            <p><strong>Created:</strong> ${new Date(listing.created).toLocaleString()}</p>
            <p><strong>Ends At:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
            <p><strong>Bids:</strong> ${listing._count.bids}</p>
            ${
              listing.media && listing.media.length > 0
                ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || "Listing Image"}" style="max-width: 300px;">`
                : "<p>No image available</p>"
            }
          `;
    }
    renderPost(data.data);
  } catch (error) {
    console.error("Error fetching post:", error);
    document.querySelector(".postContainer").innerHTML =
      "<p>Failed to load post details.</p>";
  }
}

const postId = getPostIdFromQuery();
getPostById(postId);
