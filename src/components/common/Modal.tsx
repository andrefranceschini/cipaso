import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"]), video[controls]'

/**
 * Diálogo modal acessível: foco preso enquanto aberto, Esc fecha, foco volta
 * para o elemento que abriu e o fundo não rola.
 */
export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const focusFirst = window.setTimeout(() => {
      const panel = panelRef.current
      const target = panel?.querySelector<HTMLElement>(FOCUSABLE) ?? panel
      target?.focus()
    }, 0)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        element => element.offsetParent !== null
      )

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusFirst)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
      previouslyFocused.current?.focus()
    }
  }, [isOpen, onClose])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ink/60"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative my-auto w-full max-w-4xl bg-paper border border-rule-strong rounded-sheet shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-rule px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 id={titleId} className="font-display text-xl text-ink truncate">
                  {title}
                </h2>
                {description && (
                  <p id={descriptionId} className="mt-1 text-sm text-muted line-clamp-2">
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="-mr-1 p-2 text-muted hover:text-ink transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-5 sm:px-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
