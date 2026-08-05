/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-green': '#0a3d3a',
        'golden': '#c49a2c',
        'golden-light': '#e8d5a3',
        'cream': '#fcf9f2',
        'charcoal': '#1e2b2a',
        'charcoal-light': '#3a4a48',
      }
    },
  },
  plugins: [],
}