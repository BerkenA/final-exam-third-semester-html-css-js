import { singleListing } from "../api/constants.js";

const accessToken = sessionStorage.getItem("authToken");
const removeBidAmount = document.querySelector(".bidFormContainer");

console.log(removeBidAmount);

function getPostIdFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

if (!accessToken) {
  removeBidAmount.style.display = "none";
}

async function getPostById(postId) {
  try {
    const response = await fetch(
      `${singleListing}/${postId}?includeDetails=true&_bids=true&_seller=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Post not found.");
    }

    const data = await response.json();
    const highestBid =
      data.data.bids && data.data.bids.length > 0
        ? Math.max(...data.data.bids.map((bid) => bid.amount))
        : null;

    function renderPost(listing) {
      function truncateText(text, maxLength) {
        if (!text) return "No description provided";
        return text.length > maxLength
          ? text.substring(0, maxLength) + "..."
          : text;
      }

      const container = document.querySelector(".postContainer");
      container.innerHTML = `
            <h2>${truncateText(listing.title, 25)}</h2>
            <p><strong>Description:</strong> ${truncateText(listing.description, 25)}</p>
            <div><strong>Tags:</strong> ${listing.tags.join(", ")}</div>
            <p><strong>Created:</strong> ${new Date(listing.created).toLocaleString()}</p>
            <p><strong>Ends At:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
            <p><strong>Bids:</strong> ${listing._count.bids}</p>
            ${
              highestBid !== null
                ? `<p><strong>Highest Bid:</strong> ${highestBid}</p>`
                : "<p>No bids placed yet.</p>"
            }
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

async function handleBidSubmission(event, postId) {
  event.preventDefault();

  const bidAmount = parseFloat(document.getElementById("bidAmount").value);

  if (isNaN(bidAmount) || bidAmount <= 0) {
    document.getElementById("bidError").style.display = "block";
    return;
  }

  try {
    const bidData = { amount: bidAmount };
    const response = await fetch(`${singleListing}/${postId}/bids`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": `1f97b65c-a547-4b91-b53e-37d6788e675b`,
      },
      body: JSON.stringify(bidData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error placing bid:", data.errors);
      alert(`Error placing bid: ${data.errors[0].message}`);
      return;
    }

    console.log("Bid placed successfully:", data);
    alert("Bid placed successfully!");
  } catch (error) {
    console.error("Error placing bid:", error);
    alert("Error placing bid. Please try again later.");
  }
}

const postId = getPostIdFromQuery();
getPostById(postId);

document.getElementById("bidForm").addEventListener("submit", (event) => {
  handleBidSubmission(event, postId);
});
