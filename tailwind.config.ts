import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sarabun: ['Sarabun', 'sans-serif'],
      },
      animation: {
        border: 'borderAnimation 8s linear infinite',
      },
      colors: {
        green: {
          DEFAULT: '#4CAF50',
          dark: '#2E7D32',
          light: '#8BC34A',
        },
        yellow: {
          DEFAULT: '#FFEB3B',
          dark: '#FBC02D',
          light: '#FFF59D',
        },
      },
      keyframes: {
        borderAnimation: {
          '0%': { borderColor: '#4CAF50' },
          '50%': { borderColor: '#FFEB3B' },
          '100%': { borderColor: '#4CAF50' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
