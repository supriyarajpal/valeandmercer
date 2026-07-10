'use client'
import { useEffect, useState } from 'react'

type Props = {
  // Inherits the navbar's adaptive link colour so the icon stays legible
  // over the dark hero, the cream page top, and the scrolled glass bar.
  color?: string
  size?: number
}

// Global light/dark switch. The actual theme is applied to
// document.documentElement by the no-FOUC script in app/layout.tsx before
// first paint; this button just flips the attribute + persists the choice.
export default function ThemeToggle({ color = 'currentColor', size = 18 }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  // Until mounted we don't know which theme the pre-paint script chose, so
  // the icon is held at opacity 0 to avoid a flash of the wrong glyph and
  // any hydration mismatch.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch { /* private mode */ }
    setTheme(next)
  }

  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-press"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        width: 40,
        height: 40,
        flexShrink: 0,
        opacity: mounted ? 1 : 0,
        transition: 'color 0.5s var(--ease-out-soft), opacity 0.3s var(--ease-out-soft), transform 0.3s var(--ease-apple)',
      }}
    >
      {isDark ? <SunIcon size={size} /> : <MoonIcon size={size} />}
    </button>
  )
}

function MoonIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  )
}

function SunIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
    </svg>
  )
}
