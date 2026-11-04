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
        "fade-in": "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-up": "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "float-drift-1": "floatDrift1 14s ease-in-out infinite",
        "float-drift-2": "floatDrift2 18s ease-in-out infinite",
        "shimmer-sweep": "shimmerSweep 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        floatDrift1: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(25px, -18px) scale(1.05)" },
        },
        floatDrift2: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-20px, 20px) scale(0.96)" },
        },
        shimmerSweep: {
          "0%": { transform: "translateX(-150%) skewX(-20deg)" },
          "100%": { transform: "translateX(250%) skewX(-20deg)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
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
