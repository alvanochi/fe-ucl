/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

const rotateY = plugin(function ({ addUtilities }) {
  addUtilities({
    ".rotate-y-180": {
      transform: "rotateY(180deg)",
    },
    ".-rotate-y-180": {
      transform: "rotateY(-180deg)",
    },
  });
});

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        liquid: "url('/img/sidebar_bg.jpeg')",
        motion: "url('/img/login_bg.png')",
      },
      colors: {
        primary: {
          100: "#f2e5ff",
          200: "#f1e3ff",
          300: "#d4aaff",
          400: "#b871ff",
          500: "#9b39ff",
          600: "#7f00ff",
          700: "#6300c6",
          800: "#47008e",
          900: "#2a0055",
        },
        secondary: {
          100: "#fce6ff",
          200: "#fbe3ff",
          300: "#f4abfe",
          400: "#ed73fd",
          500: "#e53bfd",
          600: "#de03fc",
          700: "#ad02c4",
          800: "#7b028c",
          900: "#4a0154",
        },
        success: {
          100: "#e6f8e6",
          200: "#b4ebb3",
          300: "#82de80",
          400: "#4fd04d",
          500: "#36c933",
          600: "#04bc00",
          700: "#039600",
          800: "#027100",
          900: "#013800",
        },
        info: {
          100: "#e5f6ff",
          200: "#e3f5ff",
          300: "#aae0ff",
          400: "#71ccff",
          500: "#39b7ff",
          600: "#00a3ff",
          700: "#007fc6",
          800: "#005b8e",
          900: "#003655",
        },
        danger: {
          100: "#ffe5e5",
          200: "#ffe3e3",
          300: "#ffaaaa",
          400: "#ff7171",
          500: "#ff3939",
          600: "#ff5e5e",
          700: "#c60000",
          800: "#8e0000",
          900: "#550000",
        },
        "color-primary": "#01051e",
        "color-primary-light": "#020726",
        "color-primary-dark": "#010417",
        "color-secondary": "#bd00ff",
        "color-gray": "#333",
        "color-white": "#fff",
        "color-blob": "#A427DF",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), rotateY],
};
