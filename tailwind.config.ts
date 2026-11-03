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
          yt: "#ff0033",
          "yt-hover": "#e6002e",
        },
        navy: {
          950: "#030712",
          900: "#070b16",
          850: "#0c1122",
          800: "#11182c",
          750: "#17223b",
          700: "#1e2c4c",
          600: "#2a3b66",
          500: "#3d5391",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 35px -5px rgba(225, 29, 72, 0.35)",
        "glow-brand": "0 0 40px -5px rgba(225, 29, 72, 0.45)",
        "glow-blue": "0 0 35px -5px rgba(59, 130, 246, 0.35)",
        "glow-purple": "0 0 35px -5px rgba(168, 85, 247, 0.35)",
        "glow-cyan": "0 0 35px -5px rgba(6, 182, 212, 0.35)",
        card: "0 8px 30px -4px rgba(0, 0, 0, 0.12)",
        "card-dark": "0 10px 35px -5px rgba(0, 0, 0, 0.55)",
        "inner-bevel": "inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
        "inner-subtle": "inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
