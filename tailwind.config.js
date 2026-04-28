/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg:     '#0d1117',
          panel:  '#161b27',
          card:   '#1e2436',
          border: '#2e3449',
        },
      },
    },
  },
  plugins: [],
};
