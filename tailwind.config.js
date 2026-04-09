/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charcoal paper theme
        'paper-dark': '#1a1814',
        'paper-mid': '#252220',
        'paper-light': '#2d2a26',
        'pencil': '#c4b8a4',
        'pencil-light': '#d9cdb8',
        'pencil-faint': '#6b6358',
        'chalk-white': '#e8e0d0',
        'chalk-gold': '#c9a227',
        // Legacy support
        'museum-dark': '#1a1814',
        'museum-panel': '#252220',
        'museum-border': '#3d3830',
        'gold': '#c9a227',
        'gold-light': '#d9b84a',
        'gold-dim': '#8b7a4a',
        'flame-orange': '#d47230',
        'flame-yellow': '#d9b84a',
      },
      fontFamily: {
        'sketch': ['Amatic SC', 'Caveat', 'cursive'],
        'hand': ['Caveat', 'cursive'],
      },
      borderRadius: {
        'sketch': '255px 15px 225px 15px / 15px 225px 15px 255px',
        'sketch-alt': '15px 225px 15px 255px / 255px 15px 225px 15px',
        'sketch-2': '225px 15px 255px 15px / 15px 255px 15px 225px',
      },
      boxShadow: {
        'chalk': '0 0 10px rgba(201, 162, 39, 0.3)',
        'chalk-strong': '0 0 15px rgba(201, 162, 39, 0.5)',
        'watercolor': '0 0 20px rgba(212, 114, 48, 0.3)',
      },
      animation: {
        'scribble': 'scribble 3s ease-in-out infinite',
        'scribble-fast': 'scribble 0.5s ease-in-out infinite',
        'sketch-wobble': 'sketch-wobble 2s ease-in-out infinite',
        'pencil-flicker': 'pencil-flicker 1.5s ease-in-out infinite',
        'chalk-pulse': 'chalk-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        scribble: {
          '0%': { borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' },
          '25%': { borderRadius: '15px 225px 15px 255px / 255px 15px 225px 15px' },
          '50%': { borderRadius: '225px 15px 255px 15px / 15px 255px 15px 225px' },
          '75%': { borderRadius: '15px 255px 15px 225px / 225px 15px 255px 15px' },
          '100%': { borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' },
        },
        'sketch-wobble': {
          '0%, 100%': { transform: 'rotate(-0.5deg) scale(1)' },
          '25%': { transform: 'rotate(0.3deg) scale(1.01)' },
          '50%': { transform: 'rotate(-0.3deg) scale(0.99)' },
          '75%': { transform: 'rotate(0.5deg) scale(1)' },
        },
        'pencil-flicker': {
          '0%, 100%': { opacity: '0.85', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.1)' },
        },
        'chalk-pulse': {
          '0%, 100%': { opacity: '0.4', boxShadow: '0 0 5px rgba(201, 162, 39, 0.3)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 15px rgba(201, 162, 39, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
