/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0fe',
          100: '#d2e3fc',
          500: '#1a73e8',
          600: '#1557b0',
        },
        secondary: {
          50: '#e6f4ea',
          500: '#34a853',
        },
        warning: {
          50: '#fef7e0',
          500: '#f9ab00',
        },
        danger: {
          50: '#fce8e6',
          500: '#ea4335',
        }
      },
    },
  },
  plugins: [],
}