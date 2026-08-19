import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from '@/lib/theme-context'

const STORAGE_KEY = 'theme'

const THEME_COLOR: Record<Theme, string> = {
  dark: '#06090d',
  light: '#eef3f4'
}

/**
 * O escuro é a identidade padrão do memorial; o claro é uma escolha
 * explícita do visitante. O script inline do index.html aplica a classe
 * .light antes da primeira pintura quando há preferência salva.
 */
function readInitialTheme(): Theme {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])

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
