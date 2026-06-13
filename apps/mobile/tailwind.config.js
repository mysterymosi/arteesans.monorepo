/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1e5896", light: "#55a7ff", muted: "#e8f0f9" },
        ink: { DEFAULT: "#252525", secondary: "#404a5d", muted: "#8a93a3" },
        bg: "#f8f8f9",
        splash: "#000810",
        surface: { DEFAULT: "#ffffff", muted: "#f3f4f7" },
        line: { DEFAULT: "#f0f0f0", strong: "#eaeaea" },
        success: { DEFAULT: "#009933", muted: "#e6f5ec" },
        warning: { DEFAULT: "#ffae00", muted: "#fff7e6" },
        danger: { DEFAULT: "#e02d3c", muted: "#fdeaec" },
      },
      fontFamily: {
        sans: ["Outfit"],
      },
    },
  },
  plugins: [],
};
