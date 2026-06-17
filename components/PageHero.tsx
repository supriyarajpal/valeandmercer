'use client'
import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

type PageHeroProps = {
  eyebrow: string
  image: string
  imageAlt: string
  children: ReactNode
  minHeight?: string
}

const EASE = [0.22, 1, 0.36, 1] as const
const ENTER_DELAY = 1.0

export default function PageHero({ eyebrow, image, imageAlt, children, minHeight = '70vh' }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.12])

  return (
    <section
      ref={ref}
      style={{
        background: '#28231C',
        minHeight,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '160px 20px 100px',
      }}
    >
      <motion.div style={{ position: 'absolute', inset: '-5%', y: reduce ? 0 : bgY, scale: reduce ? 1 : bgScale }}>
        <img
          src={image}
          alt={imageAlt}
          loading="eager"
          fetchPriority="high"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
        />
      </motion.div>
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(40,35,28,0.65)' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(40,35,28,0.5) 0%, rgba(40,35,28,0) 25%, rgba(40,35,28,0) 70%, rgba(40,35,28,0.75) 100%)' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ maxWidth: 640 }}>
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: ENTER_DELAY, ease: EASE }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}
          >
            <div style={{ width: 32, height: 1, background: '#A0845C' }} />
            <span className="eyebrow" style={{ color: '#A0845C' }}>{eyebrow}</span>
          </motion.div>
          {children}
        </div>
      </div>
    </section>
  )
}

export function HeroLine({ text, delay, italic, gold }: { text: string; delay: number; italic?: boolean; gold?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <span style={{ display: 'block', overflow: 'hidden' }}>
      <motion.span
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.85, delay, ease: EASE }}
        style={{
          display: 'block',
          color: gold ? '#A0845C' : '#EFECE6',
          fontStyle: italic ? 'italic' : 'normal',
          willChange: 'transform',
        }}
      >
        {text}
      </motion.span>
    </span>
  )
}

export function HeroSubtext({ children, delay }: { children: ReactNode; delay: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.p
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      style={{
        fontSize: 16,
        lineHeight: 2,
        color: 'rgba(239,236,230,0.96)',
        maxWidth: 460,
        marginBottom: 32,
        textShadow: '0 2px 18px rgba(40,35,28,0.9), 0 1px 3px rgba(40,35,28,0.6)',
      }}
    >
      {children}
    </motion.p>
  )
}
