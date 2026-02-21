/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        headline: ['"Playfair Display"', "serif"],
        body: ['"Crimson Pro"', "serif"],
      },
      colors: {
        editorial: {
          50: "#faf9f6",
          100: "#f0ede6",
          200: "#ddd8cb",
          300: "#c4bbaa",
          400: "#a89c86",
          500: "#8d7f6a",
          600: "#756758",
          700: "#5e5248",
          800: "#4e443d",
          900: "#433b36",
          950: "#2a2420",
        },
      },
    },
  },
  plugins: [],
};
