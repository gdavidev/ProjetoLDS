/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,html}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-page': "url('/backgrounds/login-page.png')"
      },
      colors: {
        'primary': '#6237A0',
        'primary-dark': '#28104E',
        'primary-light': '#9754CB',
        'primary-lighter': '#DEACF5',
        'secondary': '#5E5454',
        'secondary-light': '#9A8989',
        'secondary-dark': '#564C4C',
        'tertiary': '#865151',
        'background': '#333',
        'layout-background': '#262626',
        'table-header-background': '#252025',
        'table-body-background': '#5E5E5E'
      }
    },
    fontFamily: {
      'rubik': ['Rubik', 'arial'],
      'poppins': ['Poppins', 'sans-serif']
    }
  }
}

