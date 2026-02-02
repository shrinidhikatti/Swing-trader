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
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-source-sans)', 'sans-serif'],
      },
      colors: {
        'trading-green': '#10b981',
        'trading-red': '#ef4444',
        'navy': {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#1A2942',
          950: '#0A1628',
        },
        'gold': {
          50: '#FBF8F2',
          100: '#F5EDDB',
          200: '#EBD9B4',
          300: '#DFC285',
          400: '#D4AF37',
          500: '#C19B2C',
          600: '#B8860B',
          700: '#967109',
          800: '#75590A',
          900: '#5C460A',
        },
      },
    },
  },
  plugins: [],
}
