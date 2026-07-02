/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F7F6F2',
        ink: '#1C1B18',
        inkSoft: '#7A786F',
        coral: '#FF5A36',
        coralDim: '#FFE7DE',
        teal: '#23685A',
        tealDim: '#E2EEEA',
        border: '#E6E4DC',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
