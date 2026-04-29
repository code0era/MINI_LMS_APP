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
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        surface: {
          DEFAULT: "#0f172a",
          card:    "#1e293b",
          border:  "#334155",
          muted:   "#475569",
        },
        accent: {
          DEFAULT: "#f59e0b",
          light:   "#fcd34d",
        },
        success: "#22c55e",
        error:   "#ef4444",
        warning: "#f59e0b",
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
