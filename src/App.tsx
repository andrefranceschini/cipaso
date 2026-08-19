import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RouteChange } from '@/components/RouteChange'
import { Home } from '@/pages/Home'

// A home entra no bundle inicial; o restante é carregado sob demanda.
const Acervo = lazy(() => import('@/pages/Acervo').then(module => ({ default: module.Acervo })))
const Blog = lazy(() => import('@/pages/Blog').then(module => ({ default: module.Blog })))
const BlogPost = lazy(() => import('@/pages/BlogPost').then(module => ({ default: module.BlogPost })))
const About = lazy(() => import('@/pages/About').then(module => ({ default: module.About })))
const Legal = lazy(() => import('@/pages/Legal').then(module => ({ default: module.Legal })))
const NotFound = lazy(() => import('@/pages/NotFound').then(module => ({ default: module.NotFound })))

function RouteFallback() {
  return (
    <div className="container-editorial py-24" role="status" aria-live="polite">
      <span className="eyebrow text-muted">Carregando…</span>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <RouteChange />

        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70 focus:border focus:border-rule-strong focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Pular para o conteúdo
        </a>

        <div className="flex min-h-screen flex-col">
          <Header />
          <Breadcrumbs />

          <main id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/acervo" element={<Acervo />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/termos" element={<Legal />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}
