/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nhl-blue': '#003366',
        'nhl-red': '#CC0000',
        'nhl-gold': '#FFD700',
      }
    },
  },
  plugins: [],
}
