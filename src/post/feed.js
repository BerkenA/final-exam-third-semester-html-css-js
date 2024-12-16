import { allListings } from "../api/constants.js";

let currentPage = 1;
let sortField = "title";
let sortOrder = "desc";
let limit = 16;

const accessToken = sessionStorage.getItem("authToken");

if (!accessToken) {
  alert("You need to be logged in to see this page. Redirecting to login...");
  window.location.href = "/auth/index.html";
}

async function getAllListings(
  page = 1,
  limit = 16,
  sort = "title",
  sortOrder = "desc"
) {
  try {
    const url = `${allListings}?limit=${limit}&page=${page}&sort=${sort}&sortOrder=${sortOrder}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching listings");
    }

    const data = await response.json();
    renderListings(data.data);
    renderPagination(data.meta);
  } catch (error) {
    console.error("Error:", error);
    document.querySelector(".mainContainer").innerHTML =
      "<p>Failed to load listings.</p>";
  }
}

function updateLimitBasedOnScreenSize() {
  if (window.innerWidth > 1280) {
    limit = 21;
  } else {
    limit = 16;
  }
}

updateLimitBasedOnScreenSize();
window.addEventListener("resize", () => {
  updateLimitBasedOnScreenSize();
  getAllListings(currentPage, limit, sortField, sortOrder);
});

function renderListings(listings) {
  const container = document.querySelector(".mainContainer");
  container.innerHTML = "";

  // Add Tailwind grid classes for responsive layout
  container.classList.add("grid", "grid-cols-1", "gap-4", "xl:grid-cols-3");

  if (listings && listings.length > 0) {
    listings.forEach((listing) => {
      const listingDiv = document.createElement("div");
      listingDiv.classList.add(
        "bg-white",
        "border",
        "shadow-deepBlue",
        "rounded",
        "p-4",
        "flex",
        "items-stretch",
        "gap-x-4",
        "mb-4",
        "shadow-md"
      );

      const image = document.createElement("img");
      image.src =
        listing.media && listing.media.length > 0
          ? listing.media[0].url
          : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
      image.alt =
        listing.media && listing.media.length > 0
          ? listing.media[0].alt || "Listing Image"
          : "No Image";
      image.classList.add("w-48", "h-full", "object-cover");

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("flex", "flex-col", "justify-between", "flex-1");

      const title = document.createElement("h2");
      title.classList.add("font-bold", "text-lg", "mb-2", "text-deepBlue");
      title.textContent = truncateText(listing.title, 20);

      const description = document.createElement("p");
      description.classList.add("mb-1", "text-deepBlue");
      description.innerHTML = `<strong>Description:</strong> ${truncateText(listing.description, 20)}`;

      const tags = document.createElement("p");
      tags.classList.add("mb-1", "text-deepBlue");
      tags.innerHTML = `<strong>Tags:</strong> ${
        listing.tags ? listing.tags.join(", ") : "No tags"
      }`;

      const endsAt = document.createElement("p");
      endsAt.classList.add("mb-1", "text-deepBlue");
      endsAt.innerHTML = `<strong>Ends At:</strong> ${new Date(listing.endsAt).toLocaleString()}`;

      const countdown = document.createElement("p");
      countdown.classList.add("mb-1", "text-red-700");
      countdown.innerHTML = `<strong>Time Left:</strong> <span id="timer-${listing.id}"></span>`;

      const bids = document.createElement("p");
      bids.classList.add("mb-1", "text-deepBlue");
      bids.innerHTML = `<strong>Bids:</strong> ${listing._count.bids}`;

      const link = document.createElement("a");
      link.href = `/post/listings.html?id=${listing.id}`;
      link.classList.add("block");
      link.appendChild(title);
      link.appendChild(description);
      link.appendChild(tags);
      link.appendChild(endsAt);
      link.appendChild(countdown);
      link.appendChild(bids);

      infoDiv.appendChild(link);
      listingDiv.appendChild(image);
      listingDiv.appendChild(infoDiv);
      container.appendChild(listingDiv);

      startCountdown(listing.id, listing.endsAt);
    });
  } else {
    container.innerHTML = "<p>No listings available.</p>";
  }
}

function truncateText(text, maxLength) {
  if (!text) return "No description provided";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function startCountdown(listingId, endTime) {
  const timerElement = document.getElementById(`timer-${listingId}`);
  const endDate = new Date(endTime).getTime();

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = endDate - now;

    if (distance <= 0) {
      clearInterval(interval);
      timerElement.innerHTML = "Auction Ended";
    } else {
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timerElement.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
    }
  }, 1000);
}

function renderPagination(meta) {
  const paginationContainer = document.querySelector(".paginationContainer");
  paginationContainer.innerHTML = "";

  if (!meta || !meta.pageCount) return;

  const { currentPage, pageCount } = meta;

  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.onclick = () => changePage(currentPage - 1);
    paginationContainer.appendChild(prevButton);
  }

  const pageInfo = document.createElement("span");
  pageInfo.textContent = `Page ${currentPage} of ${pageCount}`;
  pageInfo.classList.add("text-deepBlue", "font-bold", "mx-2");
  paginationContainer.appendChild(pageInfo);

  if (currentPage < pageCount) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.onclick = () => changePage(currentPage + 1);
    paginationContainer.appendChild(nextButton);
  }
}

function changePage(page) {
  if (page < 1) return;
  currentPage = page;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  getAllListings(page, limit, sortField, sortOrder);
}

function changeSort(field) {
  sortField = field;
  getAllListings(currentPage, limit, sortField, sortOrder);
}

function changeSortOrder(order) {
  sortOrder = order;
  getAllListings(currentPage, limit, sortField, sortOrder);
}

document.getElementById("sortField").addEventListener("change", (event) => {
  changeSort(event.target.value);
});

document.getElementById("sortOrder").addEventListener("change", (event) => {
  changeSortOrder(event.target.value);
});

updateLimitBasedOnScreenSize();
getAllListings(currentPage, limit, sortField, sortOrder);
