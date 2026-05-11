import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        card: "var(--card)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-secondary": "var(--accent-secondary)",
        danger: "var(--danger)",
        warning: "var(--warning)",
        border: "var(--border)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "SFMono-Regular"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0, 0, 0, 0.28)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.04)"
      }
    }
  },
  plugins: [typography]
};

export default config;
