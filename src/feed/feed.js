import { allListings } from "../api/constants.js";

async function getAllListings() {
  const url = allListings;
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer`,
      },
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    renderListings(data);
    console.log("Fetched Listings:", listings);
  } catch (error) {
    console.error(error);
  }
}

function renderListings(listings) {
  const container = document.querySelector(".mainContainer");
  container.innerHTML = "";

  if (listings && listings.length > 0) {
    listings.forEach((listing) => {
      const listingDiv = document.createElement("div");
      listingDiv.classList.add("listing");
      listingDiv.innerHTML = `
                <h2>${listing.title}</h2>
                <p>${listing.description || "No description provided"}</p>
                <p><strong>Ends At:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
                ${
                  listing.media && listing.media.length > 0
                    ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || "Listing Image"}" style="max-width: 200px;">`
                    : "<p>No image available</p>"
                }
            `;

      container.appendChild(listingDiv);
    });
  } else {
    container.innerHTML = "<p>No listings available.</p>";
  }
}

getAllListings();
