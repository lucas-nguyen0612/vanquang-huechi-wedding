import type { Config } from "tailwindcss";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export default {
  // Dark is the default — no class-based dark mode toggle
  darkMode: [],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // JL-Tools Background Tokens
        "bg-primary": "#0a0a0f",
        "bg-secondary": "#12121a",
        "bg-tertiary": "#1a1a2e",
        "bg-elevated": "#22223a",

        // JL-Tools Neon Accent Tokens
        "neon-green": "#00ff88",
        "neon-pink": "#ff0080",
        "neon-blue": "#00d4ff",
        "neon-purple": "#8b5cf6",
        "neon-yellow": "#ffdd00",
        "neon-orange": "#ff6b00",

        // JL-Tools Streak Colors (Tailwind text utilities)
        "streak-cold": "#606070",
        "streak-warm": "#ffdd00",
        "streak-hot": "#ff6b00",
        "streak-pink": "#ff0080",

        // shadcn/ui — updated for dark theme
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
