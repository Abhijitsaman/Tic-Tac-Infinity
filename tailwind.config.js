/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
      },
      colors: {
        background: {
          DEFAULT: "#020617",
          secondary: "#0F172A",
          tertiary: "#111827",
        },
        primary: "#8B5CF6",
        secondary: "#06B6D4",
        accent: "#EC4899",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
