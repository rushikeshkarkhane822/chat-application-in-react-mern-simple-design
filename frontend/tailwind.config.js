/** @type {import('tailwindcss').Config} */
export default {
  darkMode:'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
    
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          750:'#172231',
          850:'#263448',
          150:'#f5f7f9'
        },
      },
    },
  },
 
  plugins: [
        require('flowbite/plugin')
  ],
}