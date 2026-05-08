import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-space)", "system-ui", "sans-serif"]
      },
      colors: {
        background: "#060a12",
        foreground: "#e2e8f0"
      },
      boxShadow: {
        soft: "0 4px 24px rgba(0,0,0,0.6)"
      }
    }
  },
  plugins: []
};

export default config;
