import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ag: {
          bg: {
            primary: "#0a0e1a",
            secondary: "#111827",
            elevated: "#1e293b",
            hover: "#253349",
          },
          primary: "#3b82f6",
          "primary-hover": "#2563eb",
          accent: "#06b6d4",
          "accent-hover": "#0891b2",
          profit: "#10b981",
          "profit-dim": "rgba(16,185,129,0.15)",
          loss: "#ef4444",
          "loss-dim": "rgba(239,68,68,0.15)",
          warning: "#f59e0b",
          "warning-dim": "rgba(245,158,11,0.15)",
          text: {
            primary: "#f1f5f9",
            secondary: "#94a3b8",
            muted: "#64748b",
          },
          border: "#1e293b",
          "border-hover": "#334155",
          glow: "rgba(59,130,246,0.15)",
          "glow-accent": "rgba(6,182,212,0.15)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "count-up": "countUp 1s ease-out",
        "draw-line": "drawLine 1.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "gradient-x": "gradientX 3s ease infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(59,130,246,0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(59,130,246,0.4)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      boxShadow: {
        "glow-blue": "0 0 15px rgba(59,130,246,0.3)",
        "glow-cyan": "0 0 15px rgba(6,182,212,0.3)",
        "glow-green": "0 0 15px rgba(16,185,129,0.3)",
        "glow-red": "0 0 15px rgba(239,68,68,0.3)",
        glass: "0 8px 32px rgba(0,0,0,0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #0f172a 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(17,24,39,0.8) 100%)",
        "accent-gradient": "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
