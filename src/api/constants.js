export const mainUrl = "https://v2.api.noroff.dev";

export const authUrl = `${mainUrl}/auth`;

export const auctionUrl = `${mainUrl}/auction`;

export const registerUrl = `${authUrl}/register`;

export const loginUrl = `${authUrl}/login`;

export const allListings = `${auctionUrl}/listings`;

export const currentListings = `${allListings}?_active=true`;

export const singleListing = `${allListings}/`;

export const createListing = allListings;

export const allProfiles = `${auctionUrl}/profiles`;

export const singleProfile = `${allProfiles}/`;
