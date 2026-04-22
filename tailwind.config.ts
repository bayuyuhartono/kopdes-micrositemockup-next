import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50:  "#f3f8f4",
          100: "#e4f0e7",
          200: "#c6dece",
          300: "#9dc4a8",
          400: "#6ea37e",
          500: "#4d8760",
          600: "#3a6e4c",
          700: "#2e593d",
          800: "#254830",
          900: "#1c3824",
        },
      },
    },
  },
  plugins: [],
};

export default config;
