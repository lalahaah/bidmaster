import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "outline-variant": "#454652",
        "tertiary": "#e4c27c",
        "surface-container": "#1e2024",
        "outline": "#908f9d",
        "primary-container": "#002e67",
        "primary-fixed": "#d8e2ff",
        "primary": "#adc7ff",
        "surface-container-lowest": "#0c0e12",
        "on-secondary-container": "#9ab7ff",
        "surface": "#111318",
        "on-surface-variant": "#c6c5d4",
        "on-primary": "#002e68",
        "on-primary-container": "#5a96ff",
        "surface-container-highest": "#333539",
        "tertiary-container": "#3f2d00",
        "background": "#111318",
        "surface-container-high": "#282a2e",
        "surface-container-low": "#1a1c20",
        "on-surface": "#e2e2e8",
        "secondary-container": "#06449e",
        "secondary": "#b0c6ff",
        "on-tertiary-container": "#b29452",
        "on-background": "#e2e2e8",
      },
      fontFamily: {
        headline: ["var(--font-manrope)", "Manrope", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        label: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;
