import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"]
      },
      colors: {
        background: "#F8F9FB",
        foreground: "#0F172A"
      },
      boxShadow: {
        soft: "0 10px 30px -16px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
