/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,html}',
    './src/components/**/*.{js,jsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1c1e29',
        mid: '#282a36',
        green: '#4aee88',
        'green-dark': '#2b824c'
      }
    },
  },
  plugins: [],
}
