import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Combina classes Tailwind resolvendo conflitos (ex.: 'px-2 px-4' → 'px-4'). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const longDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

/**
 * Datas do acervo e dos artigos vêm como YYYY-MM-DD. Interpretar com `new Date`
 * direto usa UTC e pode voltar um dia no fuso do Brasil — por isso o parse manual.
 */
function parseIsoDate(value: string): Date | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value: string | null, style: 'short' | 'long' = 'long'): string {
  if (!value) return 'Data não catalogada'

  const date = parseIsoDate(value)
  if (!date) return 'Data não catalogada'

  return style === 'long' ? longDate.format(date) : shortDate.format(date)
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes || bytes < 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
