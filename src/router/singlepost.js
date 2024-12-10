import { singleListing } from "../api/constants.js";

// Function to get post ID from the URL (assuming it's passed as a query parameter)
function getPostIdFromQuery() {
  const urlParams = new URLSearchParams(window.location.search); // Get query parameters from the URL
  return urlParams.get("id"); // Get the value of 'id' query parameter
}

async function getPostById(postId) {
  // Add query parameters to the URL if needed
  const postUrl = `${singleListing}/${postId}?includeDetails=true`; // Adding query param "includeDetails=true"
  try {
    const response = await fetch(postUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response is OK
    if (!response.ok) {
      throw new Error("Post not found.");
    }

    const data = await response.json();

    // Nested renderPost function
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

    // Call the nested renderPost function to render the post
    renderPost(data.data);
  } catch (error) {
    console.error("Error fetching post:", error);
    document.querySelector(".postContainer").innerHTML =
      "<p>Failed to load post details.</p>";
  }
}

// Call the function to fetch the post
const postId = getPostIdFromQuery(); // Get post ID from query parameters
getPostById(postId);

console.log(postId); // Log the ID for debugging
