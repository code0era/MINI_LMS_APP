/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#f0f9f9",
          100: "#d9f1f1",
          200: "#b3e2e2",
          300: "#8ccfcf",
          400: "#66bcbc",
          500: "#4db6ac", // The Photography Teal from reference
          600: "#3d918a",
          700: "#2e6d67",
          800: "#1f4845",
          900: "#0f2422",
        },
        surface: {
          DEFAULT: "#ffffff",
          card:    "#ffffff",
          border:  "#f1f5f9",
          muted:   "#94a3b8",
        },
        text: {
          primary: "#334155",
          secondary: "#64748b",
          heading: "#4db6ac",
        },
        accent: {
          DEFAULT: "#ff4b4b", // Live badge red
          light:   "#ffeded",
        },
      },
      fontFamily: {
        sans:   ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        semi:   ["Inter_600SemiBold"],
        bold:   ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
};
