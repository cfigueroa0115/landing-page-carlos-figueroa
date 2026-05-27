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
        'bg-primary': '#F5F0EB',
        'bg-secondary': '#EDE8E2',
        'bg-card': '#FFFFFF',
        'accent-cyan': '#1B3A4B',
        'accent-violet': '#8B5E3C',
        'accent-gold': '#C4922A',
        'accent-primary': '#1B3A4B',
        'accent-secondary': '#8B5E3C',
        'text-primary': '#1A1A1A',
        'text-secondary': '#4A4A4A',
        'text-muted': '#7A7A7A',
        'glass-border': 'rgba(27, 58, 75, 0.1)',
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
        'gradient-accent': 'linear-gradient(135deg, #1B3A4B, #8B5E3C)',
        'gradient-text': 'linear-gradient(90deg, #1B3A4B, #8B5E3C)',
        'gradient-ring': 'conic-gradient(from 0deg, #1B3A4B, #C4922A, #1B3A4B)',
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
