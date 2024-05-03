const { fontFamily } = require('tailwindcss/defaultTheme');

/**@type {import("tailwindcss").Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,md,mdx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    colors: (utils) => ({
      black: utils.colors.black,
      white: utils.colors.white,
      gray: utils.colors.zinc,
      success: utils.colors.emerald,
      warning: utils.colors.yellow,
      error: utils.colors.red,
      transparent: utils.colors.transparent,
      'brand-blue': {
        DEFAULT: '#00347D',
        50: '#B0D1FF',
        100: '#9CC5FF',
        200: '#73ADFF',
        300: '#4A95FF',
        400: '#217DFF',
        500: '#0067F7',
        600: '#0056CF',
        700: '#0045A6',
        800: '#00347D',
        900: '#001D45',
        950: '#001129',
      },
      'brand-red': {
        DEFAULT: '#AF1429',
        50: '#FAD2D8',
        100: '#F8C0C8',
        200: '#F49BA7',
        300: '#EF7787',
        400: '#EB5267',
        500: '#E72E47',
        600: '#D41832',
        700: '#AF1429',
        800: '#7D0E1D',
        900: '#4A0811',
        950: '#31060C',
      },
    }),
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-100': '100% 100%',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--kb-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--kb-accordion-content-height)' },
          to: { height: 0 },
        },
        'collapsible-down': {
          from: { height: 0 },
          to: { height: 'var(--kb-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--kb-collapsible-content-height)' },
          to: { height: 0 },
        },
        'content-show': {
          from: { opacity: 0, transform: 'scale(0.96)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        'content-hide': {
          from: { opacity: 1, transform: 'scale(1)' },
          to: { opacity: 0, transform: 'scale(0.96)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'content-show': 'content-show 0.2s ease-out',
        'content-hide': 'content-hide 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@kobalte/tailwindcss')],
};
