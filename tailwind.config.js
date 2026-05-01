/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'india-saffron': '#FF9933',
        'india-green': '#138808',
        'navy-blue': '#000080',
        'gold': '#FFD700',
        'workflow-registration': '#22C55E',
        'workflow-voting': '#F97316',
        'workflow-practice': '#A855F7',
        'workflow-help': '#EF4444',
        'workflow-verify': '#3B82F6',
        'workflow-id': '#14B8A6',
        'surface': '#F9F9F9',
        'surface-low': '#F3F3F4',
      },
      fontFamily: {
        sans: ['"Public Sans"', '"Noto Sans"', 'system-ui', 'sans-serif'],
        devanagari: ['"Tiro Devanagari Hindi"', 'serif'],
      },
    },
  },
  plugins: [],
}
