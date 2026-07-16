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
        'navy-950': '#051522',
        'navy-900': '#071A2B',
        'navy-800': '#0B2940',
        'blue-700': '#0B4F73',
        'blue-600': '#146C94',
        'cyan-500': '#16A6C7',
        'teal-500': '#168C84',
        'gold-500': '#C5A15A',
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F5F7F9',
        'bg-alt': '#EEF3F6',
        'bg-card': '#FFFFFF',
        'border': '#DCE4EA',
        'text-primary': '#102433',
        'text-secondary': '#526675',
        'text-muted': '#7A8B97',
        'accent-primary': '#146C94',
        'accent-secondary': '#0B2940',
        'accent-cyan': '#16A6C7',
        'accent-gold': '#C5A15A',
        'glass-border': 'rgba(220, 228, 234, 0.5)',
      },
      fontFamily: {
        'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
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
        '10': '120px',
      },
      maxWidth: {
        'container': '1240px',
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
