/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        teal: {
          50: '#e8f9f9',
          100: '#c0f0f0',
          200: '#237395',
          300: '#4dcfcf',
          400: '#2bbfbf',
          500: '#1a9999',
          600: '#1a7a7a',
          700: '#1a5a5a',
          800: '#1a3a3a',
          900: '#0f2525',
        },
        wheat: '#F5DEB3',
        gold: '#8a6a2a',
      },
    },
  },
  plugins: [],
};

