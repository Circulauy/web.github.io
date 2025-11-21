/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"], 
  theme: {
    extend: {
      colors: {
        'bg-light': '#fafafa',
        'text-dark': '#333333',
        'rp-teal': '#79C7C7',
        'rp-mint': '#A3E6BA',
        'rp-blue-light': '#e0f7f7',
        'rp-gray-soft': '#dddddd',
        'rp-border-default': '#b5b5b5',
        'mp-blue': '#009ee3', 
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Patua One', 'cursive'],
      },
      spacing: {
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem', 
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}