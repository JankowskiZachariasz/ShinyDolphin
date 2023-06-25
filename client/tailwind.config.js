/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}'
],
  theme: {
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'display': ['Oswald'],
      'body': ['"Open Sans"'],
    },
    extend: {
      colors: {
        turquoise: {
          50: '#dafaf7',
          100: '#b5f5ef',
          200: '#90f0e8',
          300: '#6beae0',
          400: '#46e5d8',
          500: '#1cc5b7',
          600: '#18a99d',
          700: '#148d83',
          800: '#107169',
          900: '#0c554e',
        },
        steel:{
          50: '#93979b',
          100: '#7d8288',
          200: '#696d72',
          300: '#55595c',
          400: '#414447',
          500: '#292a2c',
          600: '#242627',
          700: '#202122',
          800: '#1b1c1d',
          900: '#1F1F1F',
        },
        gray:{
          1000: '#0c111b'
        }
      },
      boxShadow: {
        'google': '0 4px 8px 3px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.3)',
      }
    },
  },
  plugins: [],
}

