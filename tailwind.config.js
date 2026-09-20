/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs', './public/js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Tajawal', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Tajawal', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        base: '#0d0f14',
      },
    },
  },
  plugins: [],
};