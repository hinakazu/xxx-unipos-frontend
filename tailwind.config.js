const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          background: "rgba(255, 255, 255, 0.1)",
          foreground: "#11181C",
          default: {
            50: "rgba(255, 255, 255, 0.05)",
            100: "rgba(255, 255, 255, 0.1)",
            200: "rgba(255, 255, 255, 0.2)",
            300: "rgba(255, 255, 255, 0.3)",
            400: "rgba(255, 255, 255, 0.4)",
            500: "rgba(255, 255, 255, 0.5)",
            DEFAULT: "rgba(255, 255, 255, 0.1)",
            foreground: "#11181C",
          },
          primary: {
            50: "#e6f1fe",
            100: "#cce3fd",
            200: "#99c7fb",
            300: "#66aaf9",
            400: "#338ef7",
            500: "#006FEE",
            600: "#005bc4",
            700: "#004493",
            800: "#002e62",
            900: "#001731",
            DEFAULT: "#006FEE",
            foreground: "#FFFFFF",
          },
          focus: "#006FEE",
        },
      },
    },
  })],
}