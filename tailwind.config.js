export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C6A049", // your dark gold
          light: "#D4AF37",
          dark: "#8C6E1E",
        },
      },
	  fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
		display: ["Bebas Neue", "sans-serif"],
      },

    },
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
};