/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme1: {
          bg: '#21130F',
          secondary: '#382019',
          accent: '#F08A4B',
          highlight: '#FFC078',
          text: '#FFF1E6',
          card: '#472A20'
        },
        theme2: {
          bg: '#092D27',
          secondary: '#12463B',
          accent: '#43D6A0',
          highlight: '#B7F7D0',
          text: '#E9FFF4',
          card: '#185447'
        },
        theme3: {
          bg: '#17132D',
          secondary: '#28204B',
          accent: '#B69CFF',
          highlight: '#F4C96B',
          text: '#F5F0FF',
          card: '#352B5C'
        },
        theme4: {
          bg: '#071F35',
          secondary: '#103653',
          accent: '#41C8F5',
          highlight: '#82E6FF',
          text: '#E9F8FF',
          card: '#164768'
        },
        theme5: {
          bg: '#301321',
          secondary: '#4B1D32',
          accent: '#F1B85B',
          highlight: '#FFE1A3',
          text: '#FFF2E8',
          card: '#612A43'
        },
        theme6: {
          bg: '#17191E',
          secondary: '#272C33',
          accent: '#FF9252',
          highlight: '#FFD1A8',
          text: '#F5F5F5',
          card: '#303640'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}
