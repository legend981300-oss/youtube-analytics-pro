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
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          yt: "#ff0000",
          "yt-hover": "#cc0000",
        },
        navy: {
          950: "#070a10",
          900: "#0c101c",
          850: "#101626",
          800: "#151d32",
          750: "#1b2540",
          700: "#222f52",
          600: "#2e3f6e",
          500: "#3d5391",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(239, 68, 68, 0.25)",
        "glow-blue": "0 0 25px -5px rgba(59, 130, 246, 0.25)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.15)",
        "card-dark": "0 4px 20px -2px rgba(0, 0, 0, 0.45)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.2s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

