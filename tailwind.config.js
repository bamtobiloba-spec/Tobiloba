/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf9e7',
          100: '#faf0c0',
          200: '#f5e070',
          300: '#efc940',
          400: '#D4AF37',
          500: '#b8941e',
          600: '#9a7a10',
          700: '#7c6009',
          800: '#5e4806',
          900: '#3d2f02',
        },
        kw: {
          black: '#0a0a0a',
          gold: '#D4AF37',
          white: '#FAFAFA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
