/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./auth/**/*.{html,js}",
    "./post/**/*.{html,js}",
    "./profile/**/*.{html,js}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./src/js/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F7F0F5",
        gold: "#F1D302",
        black: "#020100",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        bebas: ["Bebas Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
};
