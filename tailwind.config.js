/**
 * Tailwind is used for layout + styling of our own markup.
 * Preflight (Tailwind's CSS reset) is OFF because MUI components bring their own
 * resets; we add a tiny base layer in src/index.css instead. This avoids the two
 * libraries fighting over button/input/heading defaults.
 * Dark mode is class-based: <html class="dark"> is toggled from the Redux ui slice.
 */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  darkMode: 'class',
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#f5b301', dark: '#d99a00' }, // marquee amber
        ink: { 950: '#0c0e13', 900: '#141721', 800: '#1d2130', 700: '#2a2f42', 600: '#3a4159' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
