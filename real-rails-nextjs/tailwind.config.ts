import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "sans-serif"] },
      colors: {
        "rr-bg":      "#030712",
        "rr-surface": "#0B1117",
        "rr-surface2":"#0F1A24",
        "rr-cyan":    "#38BDF8",
        "rr-indigo":  "#818CF8",
        "rr-border":  "#1F2937",
        "rr-text":    "#E2E8F0",
        "rr-muted":   "#64748B",
      },
    },
  },
  plugins: [],
};
export default config;
