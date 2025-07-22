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
          background: "rgba(0, 0, 0, 0.05)",
          foreground: "#1F2937",
          default: {
            50: "rgba(148, 163, 184, 0.1)",
            100: "rgba(148, 163, 184, 0.2)",
            200: "rgba(148, 163, 184, 0.3)",
            300: "rgba(148, 163, 184, 0.4)",
            400: "rgba(148, 163, 184, 0.5)",
            500: "rgba(148, 163, 184, 0.6)",
            DEFAULT: "rgba(148, 163, 184, 0.2)",
            foreground: "#1F2937",
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
            foreground: "#1F2937",
          },
          focus: "#006FEE",
        },
      },
    },
  })],
}