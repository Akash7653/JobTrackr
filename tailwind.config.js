/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        theme: {
          page: 'var(--bg-page)',
          sidebar: 'var(--bg-sidebar)',
          header: 'var(--bg-header)',
          card: 'var(--bg-card)',
          cardHover: 'var(--bg-card-hover)',
          elevated: 'var(--bg-elevated)',
          subtle: 'var(--bg-subtle)',
          primaryText: 'var(--text-primary)',
          secondaryText: 'var(--text-secondary)',
          mutedText: 'var(--text-muted)',
          border: 'var(--border-primary)',
          borderSubtle: 'var(--border-subtle)',
          borderHover: 'var(--border-hover)',
          inputBg: 'var(--input-bg)',
          inputText: 'var(--input-text)',
          inputPlaceholder: 'var(--input-placeholder)',
          inputBorder: 'var(--input-border)',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(99, 102, 241, 0.15)',
        'glow': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'glow-lg': '0 0 35px -5px rgba(99, 102, 241, 0.35)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        'card-light': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
