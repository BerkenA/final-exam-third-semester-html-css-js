import { allListings } from "../api/constants.js";

let currentPage = 1;
let sortField = "title";
let sortOrder = "desc";
let limit = 10;

async function getAllListings(
  page = 1,
  limit = 10,
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

function renderListings(listings) {
  const container = document.querySelector(".mainContainer");
  container.innerHTML = "";

  if (listings && listings.length > 0) {
    listings.forEach((listing) => {
      const listingDiv = document.createElement("div");
      listingDiv.classList.add("listing");

      const image =
        listing.media && listing.media.length > 0
          ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || "Listing Image"}" style="max-width: 300px;">`
          : "<p>No image available</p>";

      const tags = listing.tags ? listing.tags.join(", ") : "No tags";

      listingDiv.innerHTML = `
        <h2>${listing.title}</h2>
        <p><strong>Description:</strong> ${listing.description || "No description provided"}</p>
        <p><strong>Tags:</strong> ${tags}</p>
        <p><strong>Ends At:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
        ${image}
        <p><strong>Bids:</strong> ${listing._count.bids}</p>
        <p><strong>Created:</strong> ${new Date(listing.created).toLocaleString()}</p>
        <p><strong>Last Updated:</strong> ${new Date(listing.updated).toLocaleString()}</p>
      `;

      container.appendChild(listingDiv);
    });
  } else {
    container.innerHTML = "<p>No listings available.</p>";
  }
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

getAllListings(currentPage, limit, sortField, sortOrder);
