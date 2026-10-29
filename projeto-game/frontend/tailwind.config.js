/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        silkscreen: ['"Silkscreen"', 'monospace'],
        medieval: ['"MedievalSharp"', 'cursive'],
      },
      colors: {
        vaslen: {
          950: '#060709',
          900: '#0c0e14',
          850: '#11141c',
          800: '#171c26',
          700: '#232b3a',
          600: '#344055',
          500: '#4e5f7c',
          ouro: '#eab308',
          'ouro-claro': '#fde047',
          'ouro-escuro': '#a16207',
          bronze: '#78350f',
          sangue: '#e11d48',
          'sangue-escuro': '#881337',
          espectral: '#06b6d4',
          'espectral-escuro': '#0e7490',
          nevoa: '#64748b',
          arcano: '#a855f7',
        }
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0 0 #000',
        'pixel': '4px 4px 0 0 #000',
        'pixel-lg': '6px 6px 0 0 #000',
        'pixel-inset': 'inset 2px 2px 0 0 rgba(255,255,255,0.1), inset -2px -2px 0 0 rgba(0,0,0,0.5)',
        'pixel-ouro': '0 0 12px rgba(234, 179, 8, 0.4)',
        'pixel-sangue': '0 0 12px rgba(225, 29, 72, 0.5)',
        'pixel-espectral': '0 0 12px rgba(6, 182, 212, 0.4)',
      }
    },
  },
  plugins: [],
}
