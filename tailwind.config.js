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
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F8F9FA',
        'bg-card': '#FFFFFF',
        'accent-cyan': '#1B3A4B',
        'accent-violet': '#2D7A9C',
        'accent-gold': '#B8860B',
        'accent-primary': '#1B3A4B',
        'accent-secondary': '#2D7A9C',
        'text-primary': '#1A1A1A',
        'text-secondary': '#4A4A4A',
        'text-muted': '#6B7280',
        'glass-border': 'rgba(27, 58, 75, 0.1)',
      },
      fontFamily: {
        'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'h1': ['60px', { lineHeight: '1.1', fontWeight: '700' }],
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
      transitionDuration: {
        'fast': '300ms',
        'normal': '600ms',
        'slow': '1500ms',
      },
    },
  },
  plugins: [],
};
