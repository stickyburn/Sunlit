/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6EE7B7',
          dark: '#047857'
        },
        secondary: {
          light: '#93C5FD',
          dark: '#1D4ED8'
        },
        background: {
          light: '#F9FAFB',
          dark: '#30293D'
        },
        editor: {
          light: '#463f54',
          dark: '#3f3a47'
        },
        text: {
          light: '#1F2937',
          dark: '#F9AAFB'
        }
      },
      boxShadow: {
        'elevation-1': '0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'elevation-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }
    }
  },
  plugins: []
};
