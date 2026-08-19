import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** Numeração da seção, no espírito de um sumário impresso ("01", "02"...). */
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
    <div className={cn('border-t border-rule pt-5', align === 'center' && 'text-center', className)}>
      {(index || eyebrow) && (
        <div
          className={cn(
            'eyebrow mb-4 flex items-baseline gap-3',
            align === 'center' && 'justify-center'
          )}
        >
          {index && <span className="tabular text-brand-ink">{index}</span>}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}

      <Heading className="text-3xl sm:text-4xl lg:text-[2.75rem]">{title}</Heading>

      {description && (
        <p
          className={cn(
            'mt-4 text-lg text-muted measure',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
