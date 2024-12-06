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
        'tertiary': '865151',
        'background': '#262626',
        'layout-background': '#363636',
      }
    },
    fontFamily: {
      'rubik': ['Rubik', 'arial'],
      'poppins': ['Poppins', 'sans-serif']
    }
  }
}

