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
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Oswald', 'Inter', 'system-ui', 'sans-serif'], // Industrial headers
      },
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed', // Purple
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          DEFAULT: '#7c3aed',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: '#f97316',
        },
        surface: {
          light: '#f8fafc', // Slate 50
          DEFAULT: '#1e293b', // Slate 800 (Dark Blueish)
          dark: '#0f172a', // Slate 900
          'dark-1': '#1e293b',
          'dark-2': '#334155',
          'dark-3': '#475569',
        },
        text: {
          primary: '#e2e8f0', // Slate 200 (Light for dark bg)
          secondary: '#94a3b8', // Slate 400
          tertiary: '#64748b', // Slate 500
          inverse: '#0f172a', // Dark for light bg areas
        },
        border: {
          light: '#334155',
          DEFAULT: '#1e293b',
          dark: '#0f172a',
        },
      },
      boxShadow: {
        'industrial': '4px 4px 0px 0px rgba(0,0,0,0.3)',
        'industrial-sm': '2px 2px 0px 0px rgba(0,0,0,0.3)',
        'industrial-lg': '8px 8px 0px 0px rgba(0,0,0,0.3)',
        'neon': '0 0 5px theme("colors.primary.500"), 0 0 20px theme("colors.primary.500")',
      },
      borderRadius: {
        'lg': '4px',
        'xl': '6px',
        '2xl': '8px',
        DEFAULT: '2px', // Sharp corners
      },
    },
  },
  plugins: [],
}
