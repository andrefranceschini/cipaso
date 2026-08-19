import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Em uma SPA a troca de rota não gera navegação real: o leitor de tela não
 * anuncia nada e o foco continua no link clicado. Este componente rola ao topo,
 * devolve o foco ao conteúdo e anuncia a nova página em uma região aria-live.
 */
export function RouteChange() {
  const { pathname } = useLocation()
  const [announcement, setAnnouncement] = useState('')
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })

    const main = document.getElementById('conteudo')
    main?.focus({ preventScroll: true })

    const title = document.title
    const timer = window.setTimeout(() => setAnnouncement(title), 120)

    return () => window.clearTimeout(timer)
  }, [pathname])

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  )
}
