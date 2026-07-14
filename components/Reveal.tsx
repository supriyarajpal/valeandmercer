'use client'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

// iOS Safari + bfcache restores sometimes never fire IntersectionObserver
// on transformed ancestors, leaving content stuck at opacity:0. This hook
// layers three independent reveal triggers so a failure on any one path
// still results in visible content:
//   (1) on mount, if the element is already overlapping the viewport, show
//   (2) IntersectionObserver (normal path)
//   (3) safety timeout after 1800ms — show regardless of observer state
export function useInViewSafe<T extends Element>(amount = 0.2, once = true) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (inView) return
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const viewportH = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < viewportH && rect.bottom > 0) {
      setInView(true)
      return
    }

    const timer = window.setTimeout(() => setInView(true), 1800)

    let observer: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setInView(true)
              if (once) observer?.disconnect()
            } else if (!once) {
              setInView(false)
            }
          }
        },
        { threshold: Math.min(amount, 0.5) },
      )
      observer.observe(el)
    } else {
      setInView(true)
    }

    return () => {
      window.clearTimeout(timer)
      observer?.disconnect()
    }
  }, [amount, once, inView])

  return { ref, inView }
}

type RevealProps = {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  once?: boolean
  amount?: number
  as?: 'div' | 'section' | 'article' | 'span' | 'ul' | 'li' | 'h1' | 'h2' | 'h3' | 'p'
  style?: CSSProperties
  className?: string
}

export function Reveal({
  children,
  delay = 0,
  y = 32,
  // Slowed from 0.7 → 0.9s for a more deliberate, premium section reveal —
  // paired with the ease-out curve below so each element decelerates in
  // rather than arriving briskly. Callers can still override per-instance.
  duration = 0.9,
  once = true,
  amount = 0.2,
  as = 'div',
  style,
  className,
}: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as typeof motion.div
  const { ref, inView } = useInViewSafe<HTMLElement>(amount, once)

  if (reduce) {
    const Static = as as keyof React.JSX.IntrinsicElements
    return <Static style={style} className={className}>{children}</Static>
  }

  return (
    <Comp
      ref={ref as never}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
      className={className}
    >
      {children}
    </Comp>
  )
}

type StaggerProps = {
  children: ReactNode
  stagger?: number
  delayChildren?: number
  amount?: number
  once?: boolean
  as?: 'div' | 'section' | 'ul' | 'ol'
  style?: CSSProperties
  className?: string
}

export function Stagger({
  children,
  // Wider gap between children (0.12 → 0.16s) so grouped elements cascade
  // in more slowly and deliberately rather than near-simultaneously.
  stagger = 0.16,
  delayChildren = 0,
  amount = 0.2,
  once = true,
  as = 'div',
  style,
  className,
}: StaggerProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as typeof motion.div
  const { ref, inView } = useInViewSafe<HTMLElement>(amount, once)

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : stagger,
        delayChildren: reduce ? 0 : delayChildren,
      },
    },
  }

  return (
    <Comp
      ref={ref as never}
      variants={container}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      style={style}
      className={className}
    >
      {children}
    </Comp>
  )
}

type StaggerItemProps = {
  children: ReactNode
  y?: number
  duration?: number
  as?: 'div' | 'li' | 'article' | 'a' | 'span' | 'h2' | 'h3' | 'p'
  style?: CSSProperties
  className?: string
}

export function StaggerItem({
  children,
  y = 24,
  // Slowed from 0.6 → 0.8s to match the calmer Reveal timing.
  duration = 0.8,
  as = 'div',
  style,
  className,
}: StaggerItemProps) {
  const Comp = motion[as] as typeof motion.div

  const item: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <Comp variants={item} style={style} className={className}>
      {children}
    </Comp>
  )
}
