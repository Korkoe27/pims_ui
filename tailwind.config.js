/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust the paths based on your project structure
  ],
  theme: {
    fontFamily:{
      sans: ['Inter', 'sans-serif']
    },

    fontSize:{
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
    extend: {},
  },
//   daisyui: {
//     themes: false,
//  },

  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/line-clamp'), // If you want more utilities
    // require('@tailwindcss/typography'),
    // require('tailwindcss-filters'),
  ],
}
