'use client'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

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
  duration = 0.7,
  once = true,
  amount = 0.2,
  as = 'div',
  style,
  className,
}: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as typeof motion.div

  if (reduce) {
    const Static = as as keyof React.JSX.IntrinsicElements
    return <Static style={style} className={className}>{children}</Static>
  }

  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
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
  stagger = 0.12,
  delayChildren = 0,
  amount = 0.2,
  once = true,
  as = 'div',
  style,
  className,
}: StaggerProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as typeof motion.div

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
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
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
  duration = 0.6,
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
