import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00ff88',
          cyan: '#00ccff',
          dark: '#0a0a0f',
          card: '#12121a',
          border: '#1e1e2e',
        },
      },
    },
  },
  plugins: [],
};

export default config;
