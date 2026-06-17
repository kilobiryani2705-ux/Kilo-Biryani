// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           DEFAULT: '#FACC15',
//           dark: '#D97706',
//         },
//         surface: '#111111',
//         surface2: '#161616',
//         text: '#FFFFFF',
//       },
//     },
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FACC15',
          dark: '#D97706',
        },
        surface: '#111111',
        surface2: '#161616',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(250,204,21,0.1) 0%, transparent 70%)',
        'cta-gradient': 'linear-gradient(135deg, #1a1a08 0%, #0C0A08 60%)',
      },
    },
  },
  plugins: [],
}