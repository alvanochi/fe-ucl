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
          100: "#e0f2f1", // lebih terang
          200: "#b2dfdb", // agak lebih terang
          300: "#80cbc4", // sedikit lebih gelap
          400: "#4db6ac", // lebih gelap
          500: "#126e63", // warna utama
          600: "#126e63", // lebih gelap
          700: "#0c3b38", // lebih gelap
          800: "#0a2d2a", // lebih gelap
          900: "#081e1c", // paling gelap
        },
        secondary: {
          100: "#fff4e1", // lebih terang
          200: "#ffe5b3", // agak lebih terang
          300: "#ffd27f", // sedikit lebih gelap
          400: "#ffb74d", // lebih gelap
          500: "#fda31c", // warna utama
          600: "#e68800", // lebih gelap
          700: "#b45f00", // lebih gelap
          800: "#805800", // lebih gelap
          900: "#4e3900", // paling gelap
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
        "color-primary": "#F4F6FF",
        "color-primary-light": "#F4F6FF",
        "color-primary-dark": "#0c3b38",
        "color-secondary": "#126e63",
        "color-gray": "#333",
        "color-white": "#fff",
        "color-blob": "#b45f00",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), rotateY],
};
