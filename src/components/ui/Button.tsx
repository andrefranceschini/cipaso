import { Link } from 'react-router-dom'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-sheet transition-all duration-200 ' +
  'disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  solid:
    'bg-brand text-on-brand hover:bg-brand-ink hover:shadow-[0_0_24px_rgb(92_189_191/0.35)]',
  outline:
    'border border-rule-strong bg-brand-wash/0 text-ink hover:border-brand-dim hover:bg-brand-wash hover:text-brand-ink',
  ghost: 'text-brand-ink hover:bg-brand-wash'
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-[0.9375rem]'
}

function buttonClasses(variant: Variant = 'solid', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function Button({
  variant,
  size,
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({
  to,
  variant,
  size,
  className,
  children
}: CommonProps & { to: string }) {
  return (
    <Link to={to} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  )
}

export function ButtonAnchor({
  variant,
  size,
  className,
  children,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </a>
  )
}
