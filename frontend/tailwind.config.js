/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        surface: "#1E293B",
        surface2: "#273449",
        accent: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
        },
        border: "rgba(255,255,255,0.08)",
        borderStrong: "rgba(255,255,255,0.14)",
        text: {
          primary: "#FFFFFF",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        xl2: "1rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(59,130,246,0.35), 0 8px 40px -8px rgba(59,130,246,0.45)",
        panel: "0 20px 60px -20px rgba(0,0,0,0.5)",
        bubble: "0 4px 24px -8px rgba(59,130,246,0.4)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        float: "float 4s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
        "gradient-x": "gradient-x 6s ease infinite",
      },
    },
  },
  plugins: [],
};
