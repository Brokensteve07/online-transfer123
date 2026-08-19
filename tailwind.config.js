/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1F33',
          800: '#132B45',
          700: '#1D3B5C',
        },
        brand: {
          blue: '#3B82F6',
          dark: '#0B1F33',
          bg: '#F7F9FC',
          card: '#FFFFFF',
          text: '#111827',
          muted: '#6B7280',
          success: '#16A34A',
          warning: '#D97706',
          error: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'fintech': '0 4px 20px -2px rgba(11, 31, 51, 0.05), 0 2px 6px -1px rgba(11, 31, 51, 0.03)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'modal': '0 20px 40px -15px rgba(11, 31, 51, 0.25)',
      }
    },
  },
  plugins: [],
}
