/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    screens: {
      'mobile': '375px',
      'tablet': '768px',
      'desktop': '1024px',
      'wide': '1440px',
    },
    extend: {
      colors: {
        'bg-primary': '#0A0E1A',
        'bg-secondary': '#111827',
        'accent-cyan': '#00D4FF',
        'accent-violet': '#7B61FF',
        'accent-gold': '#F0C040',
        'text-primary': '#FFFFFF',
        'text-secondary': 'rgba(255, 255, 255, 0.7)',
        'text-muted': 'rgba(255, 255, 255, 0.5)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Bricolage Grotesque', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'h1': ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['24px', { lineHeight: '1.4', fontWeight: '700' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '24px',
        '6': '32px',
        '7': '48px',
        '8': '64px',
        '9': '96px',
      },
      backdropBlur: {
        'glass-sm': '12px',
        'glass': '16px',
        'glass-lg': '20px',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #00D4FF, #7B61FF)',
        'gradient-text': 'linear-gradient(90deg, #00D4FF, #7B61FF)',
        'gradient-ring': 'conic-gradient(from 0deg, #00D4FF, #7B61FF, #00D4FF)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-ring': 'spin 4s linear infinite',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      transitionDuration: {
        'fast': '300ms',
        'normal': '600ms',
        'slow': '1500ms',
      },
    },
  },
  plugins: [],
};
