/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      fontFamily: {
        sans: ["FolhaGrafico", "Arial", "sans-serif"],
        serif: ["FolhaTexto", "Georgia", "serif"],
        headline: ["FolhaII", "Georgia", "serif"],
      },
      colors: {
        folha: {
          default: "#0078a4",
          hover: "#4ca5c5",
        },
      },
    },
  },
  plugins: [],
};
