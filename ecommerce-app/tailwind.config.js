//
const colors = require('tailwindcss/colors')



module.exports = {
  mode: 'jit', // Just-in-Time compiler
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
          transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        emerald: colors.emerald,
        indigo: colors.indigo,
        yellow: colors.yellow,
        lime: colors.lime,
        rose: colors.rose,
        moradopersonalized: '#4D4FCE',
        rosapersonalized: '#EF8EB1',
        primario: 'var(--color-primario)',
        primarioDark: 'var(--color-primario-dark)'
      },
      fontFamily: {
        aileron: ['Aileron-Regular', 'sans-serif'],
        aileronBold: ['Aileron-Bold', 'sans-serif']
      }
    }
  },
  plugins: [require('flowbite/plugin')]
}
