import { singleListing } from "../api/constants.js";

const accessToken = sessionStorage.getItem("authToken");
const removeBidAmount = document.querySelector(".bidFormContainer");

function getPostIdFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

if (!accessToken) {
  removeBidAmount.style.display = "none";

  const logoutButton = document.querySelector(".logoutButton");
  logoutButton.innerHTML = `
    <a href="/auth/index.html" class="text-gold hover:bg-gold hover:text-deepBlue p-2 rounded" 
    aria-label="click here to login">Login</a>`;
  logoutButton.replaceWith(logoutButton.cloneNode(true));
}

async function getPostById(postId) {
  try {
    const response = await fetch(
      `${singleListing}/${postId}?_seller=true&_bids=true`,
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
    <div class="flex space-x-8 items-center">
      <div class="w-1/3 h-full">
        ${
          listing.media && listing.media.length > 0
            ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || "Listing Image"}" class="w-full h-full object-cover rounded-lg shadow-lg">`
            : "<p>No image available</p>"
        }
      </div>
      <div class="w-2/3">
        <!-- Information Section -->
        <h2 class="text-2xl font-bold text-deepBlue mb-4">${truncateText(listing.title, 25)}</h2>
        <p class="text-lg overflow-hidden mb-4"><strong>Description:</strong> ${truncateText(listing.description, 50)}</p>
        <div class="mb-4"><strong>Tags:</strong> ${listing.tags.join(", ")}</div>
        <p class="mb-4"><strong>Created:</strong> ${new Date(listing.created).toLocaleString()}</p>
        <p class="mb-4"><strong>Ends At:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
        <p class="mb-4"><strong>Bids:</strong> ${listing._count.bids}</p>
        ${
          highestBid !== null
            ? `<p class="mb-4"><strong>Highest Bid:</strong> ${highestBid}</p>`
            : "<p>No bids placed yet.</p>"
        }
      </div>
    </div>
  `;
      renderBids(listing.bids);
    }

    function renderBids(bids) {
      const bidsContainer = document.querySelector(".bidsContainer");
      if (bids && bids.length > 0) {
        const sortedBids = bids.sort((a, b) => a.amount - b.amount);

        const bidList = sortedBids
          .map(
            (bid) => `
              <li class="p-6 mb-6 bg-white shadow-md rounded-lg space-y-4">
                <div class="flex items-center space-x-4">
                  <img src="${bid.bidder.banner.url}" alt="Avatar" class="h-12 w-12 rounded-full">
                </div>
                <div class="space-y-2">
                  <strong>By:</strong> ${bid.bidder.name}
                </div>
                <div class="space-y-2">
                  <strong>Bid Amount:</strong> ${bid.amount}<i class="fa-solid fa-dollar-sign" style="color: #039b6d;"></i>
                </div>
                <div class="space-y-2">
                  <em><strong>Placed On:</strong></em> ${new Date(bid.created).toLocaleString()}
                </div>
              </li>
            `
          )
          .join("");
        bidsContainer.innerHTML = `<ul class="space-y-6">${bidList}</ul>`;
      } else {
        bidsContainer.innerHTML = "<p>No bids available.</p>";
      }
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

    alert("Bid placed successfully!");
  } catch (error) {
    console.error("Error placing bid:", error);
    alert("Error placing bid. Please try again later.");
  }
}

const postId = getPostIdFromQuery();
getPostById(postId);

document.getElementById("bidForm").addEventListener("submit", async (event) => {
  await handleBidSubmission(event, postId);
  location.reload();
});
