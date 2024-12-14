import { allListings } from "../api/constants";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const mainContainer = document.querySelector(".mainContainer");
const hideWhenSearched = document.querySelector(".hideSearch");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (!query) {
    alert("Please enter a search query.");
    return;
  }

  mainContainer.innerHTML = "";
  hideWhenSearched.innerHTML = "";

  try {
    const response = await fetch(`${allListings}/search?q=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": "1f97b65c-a547-4b91-b53e-37d6788e675b",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch search results.");
    }

    const data = await response.json();
    displaySearchResults(data);
  } catch (error) {
    console.error("Error:", error);
    searchResults.innerHTML = `<p>Error fetching search results. Please try again later.</p>`;
  }
});

function displaySearchResults(results) {
  const listings = results.data;
  if (!listings || listings.length === 0) {
    searchResults.innerHTML = "<p>No results found.</p>";
    return;
  }

  const resultItems = listings
    .map(
      (item) => `
          <div class="result-item">
            <h3>${item.title}</h3>
            <img src="${item.media?.[0]?.url || "default-image.jpg"}" alt="${item.title}" />
            <p>${item.description}</p>
            <a href="/post/listings.html?id=${item.id}">View Details</a>
          </div>
        `
    )
    .join("");

  searchResults.innerHTML = resultItems;
}
