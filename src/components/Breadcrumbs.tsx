import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight } from 'lucide-react'
import { getPostBySlug } from '@/data/blog'

const SITE = 'https://cipaso.com'

const routeTitles: Record<string, string> = {
  '/acervo': 'Acervo digital',
  '/sobre': 'Sobre',
  '/blog': 'Artigos',
  '/termos': 'Termos & privacidade'
}

interface Crumb {
  name: string
  url: string
}

function buildCrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ name: 'Início', url: '/' }]

  if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace('/blog/', '')
    const post = getPostBySlug(slug)

    crumbs.push({ name: 'Artigos', url: '/blog' })
    crumbs.push({ name: post?.titulo ?? 'Artigo', url: pathname })
    return crumbs
  }

  const title = routeTitles[pathname]
  if (title) crumbs.push({ name: title, url: pathname })

  return crumbs
}

export function Breadcrumbs() {
  const { pathname } = useLocation()

  if (pathname === '/') return null

  const crumbs = buildCrumbs(pathname)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE}${crumb.url}`
    }))
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <nav aria-label="Trilha de navegação" className="border-b border-rule bg-paper">
        <div className="container-editorial">
          <ol className="flex flex-wrap items-center gap-1.5 py-3 text-xs text-muted">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1

              return (
                <li key={crumb.url} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 text-faint" aria-hidden="true" />
                  )}
                  {isLast ? (
                    <span className="text-ink" aria-current="page">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link to={crumb.url} className="link-ink">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
