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
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Google Material Design Color System
        google: {
          blue: '#1A73E8',
          'blue-dark': '#185ABC',
          green: '#34A853',
          yellow: '#FBBC04',
          red: '#EA4335',
        },
        primary: {
          50: '#E8F0FE',
          100: '#D2E3FC',
          200: '#AECBFA',
          300: '#8AB4F8',
          400: '#669DF6',
          500: '#1A73E8', // Google Blue
          600: '#185ABC',
          700: '#1967D2',
          800: '#1558B0',
          900: '#0D47A1',
        },
        accent: {
          50: '#E6F4EA',
          100: '#CEEAD6',
          200: '#A8DAB5',
          300: '#81C995',
          400: '#5BB974',
          500: '#34A853', // Google Green
          600: '#1E8E3E',
          700: '#137333',
          800: '#0D652D',
          900: '#0A5228',
        },
        surface: {
          light: '#FFFFFF',
          DEFAULT: '#F9FAFB',
          dark: '#F1F3F4',
          'dark-1': '#202124',
          'dark-2': '#292A2D',
          'dark-3': '#35363A',
        },
        text: {
          primary: '#202124',
          secondary: '#5F6368',
          tertiary: '#80868B',
          inverse: '#FFFFFF',
        },
        border: {
          light: '#DADCE0',
          DEFAULT: '#E8EAED',
          dark: '#3C4043',
        },
      },
      boxShadow: {
        'google-sm': '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)',
        'google': '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)',
        'google-lg': '0 2px 6px 2px rgba(60, 64, 67, 0.15), 0 8px 24px 4px rgba(60, 64, 67, 0.15)',
        'google-xl': '0 8px 12px 6px rgba(60, 64, 67, 0.15), 0 4px 16px 0px rgba(60, 64, 67, 0.3)',
      },
      borderRadius: {
        'google': '8px',
        'google-lg': '12px',
        'google-xl': '16px',
        'google-2xl': '24px',
      },
      spacing: {
        'google-1': '4px',
        'google-2': '8px',
        'google-3': '12px',
        'google-4': '16px',
        'google-5': '20px',
        'google-6': '24px',
        'google-8': '32px',
        'google-10': '40px',
        'google-12': '48px',
      },
    },
  },
  plugins: [],
}
