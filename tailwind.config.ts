import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        mono:    ["var(--font-mono)"],
      },
      colors: {
        // Dark theme
        void:    "#080a0f",
        panel:   "#0d1117",
        surface: "#131920",
        border:  "#1c2535",
        muted:   "#2a3a52",
        dim:     "#4a6080",
        soft:    "#8aa0bc",
        text:    "#dce8f5",
        bright:  "#f0f6ff",
        amber:   "#f0a030",
        "amber-dim": "#7a5018",
        "amber-glow": "rgba(240,160,48,0.15)",
        green:   "#3dd68c",
        red:     "#f05060",

        // Light theme overrides (applied via CSS vars)
        lbg:     "#f4f6f9",
        lpanel:  "#ffffff",
        lborder: "#dde3ec",
        ltext:   "#1a2535",
        ldim:    "#6a7f99",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-up":   "slideUp 0.35s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "scan":       "scan 8s linear infinite",
        "blink":      "blink 1.2s step-end infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scan:    { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100vh)" } },
        blink:   { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
      backgroundImage: {
        "grid-dark": "linear-gradient(rgba(28,37,53,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(28,37,53,0.5) 1px, transparent 1px)",
        "grid-light": "linear-gradient(rgba(200,210,225,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(200,210,225,0.6) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "32px 32px",
      },
    },
  },
  plugins: [],
};

export default config;
