/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      backgroundImage: {
        'login-page': "url('/backgrounds/login-page.png')"
      },
      colors: {
        'primary': '#EE0001',
        'primary-dark': '#DE0000',
        'primary-light': '#865151',
        'secondary': '#5E5454',
        'tertiary': '865151',
        'background': '#262626',
        'layout-backgroud': '#363636',
      }
    },
    fontFamily: {
      'rubik': ['Rubik', 'arial']
    }
  }
}

