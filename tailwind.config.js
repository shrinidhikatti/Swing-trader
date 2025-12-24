/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // Automatically use dark mode based on system preference
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'trading-green': '#10b981',
        'trading-red': '#ef4444',
      },
    },
  },
  plugins: [],
}
