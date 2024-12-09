// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Specify paths to your source files
    './public/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'), // Include DaisyUI plugin
  ],
  daisyui: {
    themes: ['light', 'dark'], // Enable light and dark themes
  },
};
