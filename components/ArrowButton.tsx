'use client'
import Link from 'next/link'

type Variant = 'gold' | 'dark' | 'outlined-light' | 'outlined-dark'

const variants: Record<Variant, {
  bg: string
  color: string
  border: string
  fill: string
  hoverColor: string
  hoverBorder: string
}> = {
  gold: {
    bg: '#A0845C',
    color: '#F2EFE9',
    border: '1px solid #A0845C',
    fill: '#F2EFE9',
    hoverColor: '#34302B',
    hoverBorder: '1px solid #F2EFE9',
  },
  dark: {
    bg: '#34302B',
    color: '#F2EFE9',
    border: '1px solid #34302B',
    fill: '#A0845C',
    hoverColor: '#F2EFE9',
    hoverBorder: '1px solid #A0845C',
  },
  'outlined-light': {
    bg: 'transparent',
    color: 'rgba(242,239,233,0.9)',
    border: '1px solid rgba(242,239,233,0.4)',
    fill: '#F2EFE9',
    hoverColor: '#34302B',
    hoverBorder: '1px solid #F2EFE9',
  },
  'outlined-dark': {
    bg: 'transparent',
    color: '#4A4036',
    border: '1px solid rgba(52,48,43,0.3)',
    fill: '#34302B',
    hoverColor: '#F2EFE9',
    hoverBorder: '1px solid #34302B',
  },
}

type Props = {
  href: string
  label: string
  variant?: Variant
}

export default function ArrowButton({ href, label, variant = 'dark' }: Props) {
  const v = variants[variant]
  return (
    <Link
      href={href}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: v.color,
        background: v.bg,
        border: v.border,
        padding: '15px 26px',
        overflow: 'hidden',
        transition: 'color 0.4s var(--ease-out-soft), border-color 0.4s var(--ease-out-soft)',
      }}
      onMouseEnter={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(0)'
        e.currentTarget.style.color = v.hoverColor
        e.currentTarget.style.border = v.hoverBorder
      }}
      onMouseLeave={e => {
        const fill = e.currentTarget.querySelector<HTMLSpanElement>('[data-fill]')
        if (fill) fill.style.transform = 'translateX(-101%)'
        e.currentTarget.style.color = v.color
        e.currentTarget.style.border = v.border
      }}
    >
      <span data-fill aria-hidden style={{ position: 'absolute', inset: 0, background: v.fill, transform: 'translateX(-101%)', transition: 'transform 0.5s var(--ease-out-soft)', zIndex: 0 }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      <span style={{ position: 'relative', zIndex: 1, fontSize: 13 }} aria-hidden>→</span>
    </Link>
  )
}
