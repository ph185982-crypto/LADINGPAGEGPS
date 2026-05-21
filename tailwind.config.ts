import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:    "#0F172A",
        ink2:   "#1E293B",
        cta:    "#10B981",
        ctaHov: "#059669",
        bg:     "#F8FAFC",
        card:   "#FFFFFF",
        warn:   "#FEF3C7",
        warnB:  "#F59E0B",
        line:   "#E5E7EB",
        mute:   "#64748B",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,.04), 0 8px 24px rgba(15,23,42,.06)",
        card: "0 1px 2px rgba(15,23,42,.04), 0 12px 32px rgba(15,23,42,.08)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        ping2:    "ping2 2.2s cubic-bezier(0,0,.2,1) infinite",
        floaty:   "floaty 6s ease-in-out infinite",
        hudPop:   "hudPop 6s ease-in-out infinite",
      },
      keyframes: {
        ping2: {
          "0%":       { transform: "scale(1)",   opacity: ".7" },
          "80%,100%": { transform: "scale(2.2)", opacity: "0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-6px)" },
        },
        hudPop: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-3px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
