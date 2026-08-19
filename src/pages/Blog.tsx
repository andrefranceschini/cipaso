import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/Button'
import { CATEGORY_LABELS, getAllPosts, type BlogPostCategory } from '@/data/blog'
import { cn, formatDate } from '@/lib/utils'

type Filter = BlogPostCategory | 'todos'

const filters: Array<{ value: Filter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'pesquisa', label: CATEGORY_LABELS.pesquisa },
  { value: 'desenvolvimento', label: CATEGORY_LABELS.desenvolvimento },
  { value: 'institucional', label: CATEGORY_LABELS.institucional }
]

export function Blog() {
  const posts = getAllPosts()
  const [category, setCategory] = useState<Filter>('todos')
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return posts.filter(post => {
      if (category !== 'todos' && post.categoria !== category) return false
      if (!normalized) return true

      return (
        post.titulo.toLowerCase().includes(normalized) ||
        post.resumo.toLowerCase().includes(normalized) ||
        post.tags.some(tag => tag.toLowerCase().includes(normalized))
      )
    })
  }, [posts, category, query])

  return (
    <>
      <SEO
        title="Artigos"
        description="Colunas e textos do Prof. Valter Franceschini sobre parapsicologia, reprogramação mental e desenvolvimento humano, transcritos do acervo do CIPASO."
        path="/blog"
      />

      <section className="border-b border-rule paper-grain">
        <div className="container-editorial py-14">
          <Reveal immediate>
            <p className="eyebrow">Textos do acervo</p>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,3.75rem)] leading-none text-ink">Artigos</h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              Colunas publicadas na imprensa de Sorocaba e materiais didáticos do CIPASO, transcritos e
              organizados por tema.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-editorial py-10">
        <div className="grid gap-5 border-b border-rule pb-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label htmlFor="busca-artigos" className="eyebrow block">
              Buscar artigos
            </label>
            <div className="relative mt-3">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
                aria-hidden="true"
              />
              <input
                id="busca-artigos"
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Título, resumo ou tema"
                className="w-full border border-rule bg-raised py-2.5 pl-9 pr-9 text-ink placeholder:text-faint focus:border-brand-ink focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Limpar busca"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <fieldset>
            <legend className="eyebrow">Tema</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.map(filter => {
                const isActive = category === filter.value

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setCategory(filter.value)}
                    aria-pressed={isActive}
                    className={cn(
                      'border px-3 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'border-brand-ink bg-brand-ink text-on-brand-ink'
                        : 'border-rule text-muted hover:border-brand-ink hover:text-ink'
                    )}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>

        <p aria-live="polite" className="mt-6 text-sm text-muted tabular">
          {results.length === 0
            ? 'Nenhum artigo encontrado.'
            : `${results.length} ${results.length === 1 ? 'artigo' : 'artigos'}`}
        </p>

        {results.length > 0 ? (
          <ol className="mt-4 border-t border-rule">
            {results.map((post, index) => (
              <Reveal as="li" key={post.slug} delay={Math.min(index * 0.04, 0.24)}>
                <article className="border-b border-rule">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group grid gap-3 py-8 md:grid-cols-[10rem_1fr] md:gap-10"
                  >
                    <div className="flex flex-col gap-1 text-xs text-muted">
                      <time dateTime={post.data} className="tabular">
                        {formatDate(post.data)}
                      </time>
                      <span className="eyebrow text-brand-ink">{CATEGORY_LABELS[post.categoria]}</span>
                      <span className="tabular">{post.tempoLeitura} min de leitura</span>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl leading-tight text-ink transition-colors group-hover:text-brand-ink sm:text-3xl">
                        {post.titulo}
                      </h2>
                      <p className="mt-3 text-muted measure">{post.resumo}</p>

                      {post.tags.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-faint">
                          {post.tags.map(tag => (
                            <li key={tag}>#{tag}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Link>
                </article>
              </Reveal>
            ))}
          </ol>
        ) : (
          <div className="mt-10 border border-rule bg-raised p-10 text-center">
            <p className="text-muted">Nada corresponde a essa busca.</p>
            <div className="mt-5">
              <Button
                variant="outline"
                onClick={() => {
                  setQuery('')
                  setCategory('todos')
                }}
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
