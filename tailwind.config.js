/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark museum theme
        'museum-dark': '#0a0a0f',
        'museum-panel': '#12121a',
        'museum-border': '#2a2a3a',
        // Flame/candle colors
        'flame-orange': '#ff8c00',
        'flame-yellow': '#ffd700',
        'flame-red': '#ff4500',
        // Accent
        'gold': '#d4af37',
        'gold-light': '#f0d978',
      },
      boxShadow: {
        'flame': '0 0 10px #ff8c00, 0 0 20px #ff8c00, 0 0 30px #ff4500',
        'flame-subtle': '0 0 5px #ff8c00, 0 0 10px #ff8c0066',
        'glow-gold': '0 0 10px #d4af37, 0 0 20px #d4af3766',
      },
      animation: {
        'flicker': 'flicker 0.5s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%': { opacity: '0.8', transform: 'scale(1)' },
          '100%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #ff8c00, 0 0 10px #ff8c0066' },
          '50%': { boxShadow: '0 0 15px #ff8c00, 0 0 25px #ff8c0088' },
        },
      },
    },
  },
  plugins: [],
}
