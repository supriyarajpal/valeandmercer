'use client'
import { useEffect, useState, type RefObject } from 'react'
import { useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'

// Depth speed multipliers — the further away, the slower it moves
// against the user's scroll. The differential is what makes it feel
// like physical space rather than a sliding page.
export const DEPTH = {
  L0: 0.15, // sky / background — barely moves
  L1: 0.35, // landscape / atmospheric overlay
  L2: 0.60, // subject / foreground content
  L3: 1.00, // UI / text — sticks to scroll (reference frame)
} as const

export type DepthLayer = keyof typeof DEPTH

export function useDepthParallax(
  targetRef: RefObject<HTMLElement | null>,
  range = 240,
): {
  l0: MotionValue<number>
  l1: MotionValue<number>
  l2: MotionValue<number>
  l3: MotionValue<number>
  progress: MotionValue<number>
  isMobile: boolean
  reduceMotion: boolean | null
} {
  const reduceMotion = useReducedMotion()
  const isMobile = useIsMobile()

  const { scrollYProgress: progress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  })

  const mult = isMobile || reduceMotion ? 0 : 1

  const l0 = useTransform(progress, [0, 1], [0, -range * DEPTH.L0 * mult])
  const l1 = useTransform(progress, [0, 1], [0, -range * DEPTH.L1 * mult])
  const l2 = useTransform(progress, [0, 1], [0, -range * DEPTH.L2 * mult])
  const l3 = useTransform(progress, [0, 1], [0, -range * DEPTH.L3 * mult])

  return { l0, l1, l2, l3, progress, isMobile, reduceMotion }
}

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isMobile
}
