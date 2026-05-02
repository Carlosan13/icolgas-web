/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        icolgas: {
          azul: '#1A3A6B',
          azul_claro: '#2E6DB4',
          naranja: '#F5820A',
          gris: '#F8F9FA',
        }
      }
    },
  },
  plugins: [],
}