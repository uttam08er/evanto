/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f6eef3",
          100: "#eddee7",
          200: "#dbbdd0",
          300: "#c99cb8",
          400: "#b87aa0",
          500: "#a65988",
          600: "#85476d",
          700: "#633652",
          800: "#422437",
          900: "#21121b",
          950: "#170c13",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
