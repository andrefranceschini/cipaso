import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronRight, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Início' },
  { to: '/acervo', label: 'Acervo' },
  { to: '/blog', label: 'Artigos' },
  { to: '/sobre', label: 'Sobre' }
]

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={!isDark}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
      className="p-2 -m-2 text-muted transition-colors hover:text-brand-ink"
    >
      {isDark ? <Sun className="h-[1.1rem] w-[1.1rem]" /> : <Moon className="h-[1.1rem] w-[1.1rem]" />}
    </button>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="h-px bg-linear-to-r from-transparent via-brand/70 to-transparent" aria-hidden="true" />

      <div className="container-editorial">
        <div className="flex h-17 items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Memorial CIPASO, página inicial">
            <img src="/favicon.svg" alt="" width={34} height={34} className="h-8.5 w-8.5" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[1.55rem] tracking-tight text-ink">CIPASO</span>
              <span className="eyebrow mt-1 hidden text-[0.595rem] sm:block">
                Memorial digital · 1989–2016
              </span>
            </span>
          </Link>

          <nav aria-label="Navegação principal" className="hidden md:block">
            <ul className="flex items-center gap-9">
              {navItems.map(item => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'relative py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-colors',
                        'after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0',
                        'after:bg-brand-ink after:shadow-[0_0_8px_rgb(92_189_191/0.8)]',
                        'after:transition-transform after:duration-300 hover:after:scale-x-100',
                        isActive ? 'text-brand-ink after:scale-x-100' : 'text-muted hover:text-ink'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-6">
            <ThemeToggle />

            <button
              ref={menuButtonRef}
              type="button"
              className="md:hidden p-2 -m-2 text-ink"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen(open => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="menu-mobile"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-rule bg-sunken"
          >
            <nav aria-label="Navegação principal" className="container-editorial py-4">
              <ul className="flex flex-col">
                {navItems.map(item => (
                  <li key={item.to} className="border-b border-rule last:border-0">
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between py-3.5 text-sm font-semibold uppercase tracking-[0.14em]',
                          isActive ? 'text-brand-ink' : 'text-ink'
                        )
                      }
                    >
                      {item.label}
                      <ChevronRight className="h-4 w-4 opacity-40" aria-hidden="true" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
