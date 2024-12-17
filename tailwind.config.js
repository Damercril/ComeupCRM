/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0A0F1C',
          lighter: '#141B2D',
        },
        accent: {
          DEFAULT: '#38BDF8',
          light: '#0EA5E9',
          success: '#22C55E',
          warning: '#F59E0B',
        },
        text: {
          primary: '#E4E8F1',
          secondary: '#94A3B8',
        }
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0A0F1C 0%, #141B2D 100%)',
        'gradient-accent': 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
        'gradient-success': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        'gradient-warning': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(56, 189, 248, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)',
        'neumorphic': '20px 20px 60px #090d19, -20px -20px 60px #0b111f',
        'neumorphic-inset': 'inset 20px 20px 60px #090d19, inset -20px -20px 60px #0b111f',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
};