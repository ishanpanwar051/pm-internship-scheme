/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        saas: {
          bg: 'var(--saas-bg)',
          card: 'var(--saas-card)',
          surface: 'var(--saas-surface)',
          'surface-hover': 'var(--saas-surface-hover)',
          border: 'var(--saas-border)',
          'border-subtle': 'var(--saas-border-subtle)',
          primary: 'var(--saas-primary)',
          muted: 'var(--saas-muted)',
          dim: 'var(--saas-dim)',
          sidebar: 'var(--saas-sidebar)',
        },
        brand: {
          indigo: '#6366F1',
          'indigo-light': '#818CF8',
          blue: '#3B82F6',
          cyan: '#06B6D4',
          purple: '#8B5CF6',
          green: '#22C55E',
          'green-dark': '#16A34A',
          gold: '#F59E0B',
          red: '#EF4444',
        },
        gov: {
          navy: '#6366F1',
          blue: '#3B82F6',
          saffron: '#F59E0B',
          green: '#22C55E',
          gold: '#F59E0B',
          dark: '#0F172A',
          light: '#F4F4F5',
          accent: '#F59E0B',
        },
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
        'card-hover': '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(0, 0, 0, 0.5)',
        'saas-hover': '0 8px 32px -8px rgba(0, 0, 0, 0.55)',
        'glow-indigo': '0 0 24px -4px rgba(99, 102, 241, 0.35)',
        'glow-cyan': '0 0 24px -4px rgba(6, 182, 212, 0.35)',
        'glow-gold': '0 0 24px -4px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'spin-slow': 'spin 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}