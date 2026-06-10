import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["'Press Start 2P'", 'cursive'],
        body: ["'VT323'", 'monospace'],
      },
      colors: {
        eightbit: {
          bg: '#94948e',
          panel: '#9e9e98',
          ink: '#ffffff',
          'ink-dark': '#1a1a1a',
          // green (primary / confirm)
          green: '#92cd41',
          'green-hover': '#76c442',
          'green-shadow': '#4aa52e',
          // yellow (proceed / accent)
          yellow: '#f7d51d',
          'yellow-hover': '#f2c409',
          'yellow-shadow': '#e59400',
          // red (reset / danger)
          red: '#e76e55',
          'red-hover': '#ce372b',
          'red-shadow': '#8c2022',
          // blue (secondary / info / links)
          blue: '#23b0f7',
          'blue-hover': '#109fe8',
          'blue-shadow': '#0a6ca8',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
