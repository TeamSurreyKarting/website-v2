import type { Config } from "tailwindcss";

import tailwindcss_animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      colors: {
        "ts-blue": {
          DEFAULT: "#123047",
          50: "#3081BF",
          100: "#2D79B3",
          200: "#266697",
          300: "#20557E",
          400: "#194262",
          500: "#123047",
          600: "#0E2739",
          700: "#0B1E2D",
          800: "#07131C",
          900: "#04101C",
          950: "#000D1B",
        },
        "ts-gold": {
          DEFAULT: "#FCC133",
          50: "#FEE9A4",
          100: "#FDE598",
          200: "#FDDD7E",
          300: "#FDD465",
          400: "#FCCB4C",
          500: "#FCC133",
          600: "#FBB310",
          700: "#E49C03",
          800: "#C18203",
          900: "#9E6802",
          950: "#8C5B02",
        },
        sidebar: {
          DEFAULT: "ts-blue-950 text-white",
          border: "ts-blue-400",
          accent: "ts-blue-700",
          "accent-foreground": "ts-blue-700",
          ring: "ts-blue-500",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcss_animate],
} satisfies Config;
