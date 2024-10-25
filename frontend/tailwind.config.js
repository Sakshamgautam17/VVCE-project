/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {minHeight: {
      'screen-92': '91vh',
    },},
  },
  plugins: [require("daisyui")],
};
