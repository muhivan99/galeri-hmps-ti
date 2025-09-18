/** @type {import('tailwindcss').Config} */
module.exports = {
  // ⬇️ WAJIB: biar toggler bisa kasih class "dark" ke <html>
  darkMode: 'class',

  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      // opsional — feel free to kosongin
      container: { center: true, padding: '1rem' },
    },
  },
  plugins: [],
};
