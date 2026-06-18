/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1e5896",
          dark: "#083769",
          light: "#55a7ff",
          muted: "#e8f0f9",
          subtle: "rgba(30, 88, 150, 0.1)",
        },
        ink: { DEFAULT: "#252525", secondary: "#404a5d", muted: "#8a93a3", placeholder: "#949ba9" },
        bg: "#f8f8f9",
        splash: "#000810",
        surface: { DEFAULT: "#ffffff", muted: "#f3f4f7" },
        line: { DEFAULT: "#f0f0f0", strong: "#eaeaea", input: "#d0d5dd" },
        success: { DEFAULT: "#009933", muted: "#e6f5ec", subtle: "rgba(0, 153, 51, 0.1)" },
        warning: { DEFAULT: "#ffae00", muted: "#fff7e6", subtle: "rgba(255, 174, 0, 0.1)" },
        danger: { DEFAULT: "#e02d3c", muted: "#fdeaec", subtle: "rgba(224, 45, 60, 0.1)" },
      },
      fontFamily: {
        sans: ["Outfit"],
      },
    },
  },
  plugins: [],
};
