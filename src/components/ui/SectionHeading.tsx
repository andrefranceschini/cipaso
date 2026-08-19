import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** Numeração da seção, como marcação de protocolo de registro ("01", "02"...). */
  index?: string
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  as: Heading = 'h2',
  align = 'left',
  className
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'relative border-t border-rule pt-6',
        align === 'center' && 'text-center',
        className
      )}
    >
      <span
        aria-hidden="true"
        className="absolute -top-px left-0 h-px w-24 bg-brand shadow-[0_0_12px_rgb(92_189_191/0.8)]"
      />

      {(index || eyebrow) && (
        <div className={cn('mb-5 flex items-baseline gap-3', align === 'center' && 'justify-center')}>
          {index && (
            <span className="font-display text-2xl leading-none text-brand-ink text-glow tabular">{index}</span>
          )}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        </div>
      )}

      <Heading className="text-3xl text-ink sm:text-4xl lg:text-[2.75rem]">{title}</Heading>

      {description && (
        <p className={cn('mt-4 text-lg text-muted measure', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
    </div>
  )
}
