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
          500: "#ff0033",
          600: "#e6002e",
          700: "#cc0029",
          yt: "#ff0033",
          "yt-hover": "#e6002e",
        },
        // Linear/Vercel Obsidian Dark Palette
        navy: {
          950: "#090a0f", // Main canvas background
          900: "#0c0d12", // Primary surface/panels
          850: "#101116", // Card surface
          800: "#15161d", // Card hover
          750: "#1e202a", // Border hover
          700: "#262935", // Borders
          600: "#3d4255",
          500: "#5c6380",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "SFMono-Regular",
          "Consolas",
          '"Liberation Mono"',
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.25)",
        "card-dark": "0 8px 32px -4px rgba(0, 0, 0, 0.6)",
        "inner-bevel": "inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "inner-subtle": "inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
