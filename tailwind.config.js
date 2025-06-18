/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:  "#0e0e11",
        card:"#1a1a1f",
        accent:"#2970ff"
      }
    },
  },
  plugins: [],
};
