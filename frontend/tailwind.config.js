/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        mobile: "550px",
        tab: "900px",
        pc: "1400px",
      },
    },
  },
  plugins: [],
};
