import { motion, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { EASE_EDITORIAL, viewportOnce } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  id?: string
  delay?: number
  /** Anima na montagem em vez de esperar entrar na viewport (conteúdo acima da dobra). */
  immediate?: boolean
}

/**
 * Entrada padrão do site: leve deslocamento vertical + fade.
 * Com "prefers-reduced-motion" o conteúdo aparece direto, sem transição.
 */
export function Reveal({ children, as = 'div', className, id, delay = 0, immediate = false }: RevealProps) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as as 'div'] ?? motion.div

  if (reduceMotion) {
    const Static = as as ElementType
    return (
      <Static className={className} id={id}>
        {children}
      </Static>
    )
  }

  const animation = {
    initial: { opacity: 0, y: 16 },
    transition: { duration: 0.5, ease: EASE_EDITORIAL, delay }
  }

  if (immediate) {
    return (
      <Component className={className} id={id} {...animation} animate={{ opacity: 1, y: 0 }}>
        {children}
      </Component>
    )
  }

  return (
    <Component
      className={className}
      id={id}
      {...animation}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
    >
      {children}
    </Component>
  )
}
