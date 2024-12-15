export default async function router(pathname = window.location.pathname) {
  switch (pathname) {
    case "/":
    case "/index.html":
      await import("/src/post/index.js");
      break;

    case "/post/":
    case "/post/index.html":
      await import("/src/post/feed.js");
      break;

    case "/auth/index.html":
    case "/auth/":
      await import("/src/auth/login.js");
      break;

    case "/auth/register.html":
    case "/auth/register/":
      await import("/src/auth/register.js");
      break;

    case "/profile/":
    case "/profile/index.html":
      await import("/src/profile/index.js");
      break;

    case "/profile/update.html":
      await import("/src/profile/update.js");
      break;

    case "/profile/edit-listing.html":
      await import("/src/profile/edit.js");
      break;

    case "/post/create-listing.html":
      await import("/src/post/create-listings.js");
      break;

    case "/post/listings.html":
      await import("/src/post/singlepost.js");
      break;

    default:
      await import("/src/router/not-found.js");
  }
}
