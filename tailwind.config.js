module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{ts,tsx,js,jsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'starcoin-header': '#000F3A',
      },
    },
    minWidth: {
      '1/2': '50%',
      '3/4': '75%',
    },
    screens: {
      sm: '300px',
      //@media (min-width: 640px) { /* ... */ }

      md: '768px',
      //@media (min-width: 768px) { /* ... */ }

      lg: '1024px',
      //@media (min-width: 1024px) { /* ... */ }

      xl: '1280px',
      //@media (min-width: 1280px) { /* ... */ }
    },
  },
  variants: {},
  plugins: [],
};
