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
      // Mirror the design tokens from globals.css so Tailwind utility
      // classes (rounded-lg, ease-apple, etc.) resolve to the same values
      // as the CSS variables — one source of truth for the design system.
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        250: '250ms',
        350: '350ms',
      },
      backdropBlur: {
        glass: 'var(--glass-blur)',
      },
      boxShadow: {
        glass: 'var(--glass-highlight), var(--glass-shadow)',
      },
    },
  },
  plugins: [],
}

export default config
