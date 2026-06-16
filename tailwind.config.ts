import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'stone-base': '#EFECE6',
        'stone-mid': '#DDD7CC',
        'stone-deep': '#C8C0B4',
        'bronze': '#A0845C',
        'bronze-light': '#BFA07A',
        'bronze-dark': '#7A6244',
        'earth': '#28231C',
        'earth-muted': '#6B6258',
        'earth-light': '#9A9188',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
