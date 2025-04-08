/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'umbrella-primary': '#3366CC',
        'umbrella-secondary': '#FF9900',
        'umbrella-danger': '#CC3333',
        'umbrella-success': '#33CC66',
        'umbrella-warning': '#FFCC00',
      },
    },
  },
  plugins: [],
}; 