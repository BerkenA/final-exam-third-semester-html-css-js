import { allListings } from "../api/constants";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (!query) {
    alert("Please enter a search query.");
    return;
  }

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
    searchResults.classList.add("block");
    searchResults.classList.remove("hidden");
    displaySearchResults(data);
  } catch (error) {
    console.error("Error:", error);
    searchResults.innerHTML = `<p>Error fetching search results. Please try again later.</p>`;
  }
});

document.addEventListener("click", (event) => {
  if (!searchResults.contains(event.target) && event.target !== searchInput) {
    searchResults.classList.add("hidden");
    searchResults.classList.remove("block");
  }
});

function displaySearchResults(results) {
  const listings = results.data;
  if (!listings || listings.length === 0) {
    searchResults.innerHTML =
      "<p class='text-center text-deepBlue'>No results found.</p>";
    return;
  }

  const resultItems = listings
    .map(
      (item) => `
        <div class="result-item bg-white text-deepBlue p-6 rounded-lg shadow-md border border-deepBlue mb-4">
          <h3 class="text-xl font-bold text-deepBlue mb-2">${item.title}</h3>
          <img src="${item.media?.[0]?.url || "default-image.jpg"}" alt="${item.title}" class="w-full h-48 object-cover rounded-md mb-4" />
          <p class="text-sm text-deepBlue mb-4">${item.description}</p>
          <a href="/post/listings.html?id=${item.id}" class="text-deepBlue hover:text-deepBlue hover:underline">View Details</a>
        </div>
      `
    )
    .join("");

  searchResults.innerHTML = resultItems;
}
