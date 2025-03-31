/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,ts,tsx}", "./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        anime: {
          purple: "#b388ff",
          pink: "#ff93c1",
          blue: "#93c1ff",
          mint: "#93ffd8",
          lavender: "#d8b3ff",
          background: "#f3e5ff",
          darkPurple: "#6a1b9a",
          darkBackground: "#2d1b3e",
        },
      },
    },
  },
  plugins: [],
};
