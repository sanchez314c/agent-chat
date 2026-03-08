/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          black: '#0a0b0e',
          void: '#0a0b0e',
          deep: '#0f1114',
          base: '#13151a',
          surface: '#1a1c22',
          elevated: '#21232a',
          card: '#1e2028',
          muted: '#2a2d36',
          border: '#2e3140',
        },
        status: {
          error: '#ef4444',
          warning: '#f59e0b',
          optimal: '#10b981',
          idle: '#6b7280',
          running: '#10b981',
          paused: '#f59e0b',
        },
        cyber: {
          300: '#5eead4',
          400: '#14b8a6',
        },
        neon: {
          400: '#a3e635',
          500: '#84cc16',
        },
        agent1: '#10b981',
        agent2: '#06b6d4',
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#1a1a1a',
        },
      },
      borderRadius: {
        'neo': '12px',
      },
      backdropBlur: {
        'neo': '20px',
      },
      boxShadow: {
        'neo': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'neo-lg': '0 16px 48px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        mono: ['Monaco', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
