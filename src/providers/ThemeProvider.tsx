import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from '@/lib/theme-context'

const STORAGE_KEY = 'theme'

const THEME_COLOR: Record<Theme, string> = {
  light: '#f7f4ef',
  dark: '#101315'
}

function readInitialTheme(): Theme {
  // O script inline do index.html já aplicou a classe antes da primeira pintura:
  // ler do DOM mantém o estado do React em sincronia, sem flash nem cálculo duplicado.
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function hasStoredPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')

    // Acompanha o sistema apenas enquanto o visitante não escolher um tema.
    const handleChange = (event: MediaQueryListEvent) => {
      if (hasStoredPreference()) return
      setTheme(event.matches ? 'dark' : 'light')
    }

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'

      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Armazenamento bloqueado (navegação privativa): vale só nesta sessão.
      }

      return next
    })
  }, [])

  const value = useMemo(() => ({ theme, isDark: theme === 'dark', toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
