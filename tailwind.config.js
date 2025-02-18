module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#fafafa',
        surface: '#ffffff',
        'text-primary': '#1a1a1a',
        'text-secondary': '#4a4a4a',
        primary: {
          DEFAULT: '#6366f1',
          light: '#818cf8'
        },
        success: '#22c55e',
        error: '#ef4444'
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale': 'scale 0.15s ease-in-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      ringOffsetWidth: {
        '2': '2px',
      }
    },
  },
  plugins: [],
}