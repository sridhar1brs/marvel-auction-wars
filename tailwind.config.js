/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        marvel: {
          red: '#E62429',
          darkRed: '#960b10',
          gold: '#FFD700',
          cosmic: '#A855F7',
          cyan: '#06B6D4',
          dark: '#0B0D13',
          darker: '#060709',
          card: '#121620',
          border: '#232A3B',
        }
      },
      fontFamily: {
        marvel: ['Outfit', 'Bebas Neue', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'glow-red': '0 0 25px rgba(230, 36, 41, 0.45)',
        'glow-gold': '0 0 25px rgba(255, 215, 0, 0.45)',
        'glow-blue': '0 0 25px rgba(6, 182, 212, 0.45)',
        'glow-cosmic': '0 0 35px rgba(168, 85, 247, 0.65)',
        'card-elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cosmic-spin': 'spin 12s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        }
      }
    },
  },
  plugins: [],
}
