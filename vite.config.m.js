import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  appType: "mpa", // Multi-Page App
  base: "", // Adjust if you deploy to a subdirectory (e.g., '/myapp/')
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        login: resolve(__dirname, "./auth/index.html"),
        register: resolve(__dirname, "./auth/register/index.html"),
        profile: resolve(__dirname, "./profile/index.html"),
        update: resolve(__dirname, "./profile/update.html"),
        edit: resolve(__dirname, "./profile/edit-listing.html"),
        create: resolve(__dirname, "./post/create-listing.html"),
        master: resolve(__dirname, "./post/index.html"),
        listing: resolve(__dirname, "./post/listings.html"),
      },
    },
  },
  server: {
    open: true, // Automatically open the app in the browser
    port: 3000, // Customize the port if needed
  },
});
