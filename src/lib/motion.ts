import type { Transition, Variants } from 'framer-motion'

/**
 * Movimento editorial: curto, discreto e sempre no mesmo easing.
 * Nada de bounce ou spring exagerado — o conteúdo é um memorial, não um app de vendas.
 */
export const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const

export const transition: Transition = {
  duration: 0.5,
  ease: EASE_EDITORIAL
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition }
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition }
}

/** Escalonamento com teto: listas longas não podem acumular atraso infinito. */
export function staggerContainer(step = 0.06, max = 0.4): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: step,
        delayChildren: 0,
        staggerDirection: 1,
        when: 'beforeChildren',
        duration: max
      }
    }
  }
}

/** Atraso por índice, limitado a 300 ms para não travar grids grandes. */
export function delayFor(index: number, step = 0.05, max = 0.3): number {
  return Math.min(index * step, max)
}

export const viewportOnce = { once: true, margin: '-60px' } as const
