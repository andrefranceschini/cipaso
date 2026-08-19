import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { NotFound } from '@/pages/NotFound'
import { CATEGORY_LABELS, getPostBySlug, getRelatedPosts } from '@/data/blog'
import { renderMarkdown } from '@/lib/markdown'
import { formatDate } from '@/lib/utils'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return (
      <NotFound
        title="Artigo não encontrado"
        description="O texto que você procura não existe ou foi movido. Veja a lista completa de artigos do acervo."
        actionLabel="Ver todos os artigos"
        actionTo="/blog"
      />
    )
  }

  const related = getRelatedPosts(post)

  return (
    <>
      <SEO
        title={post.titulo}
        description={post.resumo}
        path={`/blog/${post.slug}`}
        type="article"
        article={{
          publishedTime: post.data,
          author: post.autor,
          section: CATEGORY_LABELS[post.categoria],
          tags: post.tags
        }}
      />

      <article className="container-editorial py-14">
        <header className="border-b border-rule pb-10">
          <Link to="/blog" className="link-ink inline-flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Artigos
          </Link>

          <p className="eyebrow mt-8 text-brand-ink">{CATEGORY_LABELS[post.categoria]}</p>

          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.125rem,5.5vw,3.75rem)] leading-[1.05] text-ink">
            {post.titulo}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted">{post.resumo}</p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-xs text-muted">
            <div>
              <dt className="eyebrow">Publicado</dt>
              <dd className="mt-1 tabular">
                <time dateTime={post.data}>{formatDate(post.data)}</time>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Autoria</dt>
              <dd className="mt-1">{post.autor}</dd>
            </div>
            <div>
              <dt className="eyebrow">Leitura</dt>
              <dd className="mt-1 tabular">{post.tempoLeitura} min</dd>
            </div>
          </dl>
        </header>

        <div className="article-body measure mt-12">{renderMarkdown(post.conteudo)}</div>

        {post.tags.length > 0 && (
          <div className="measure mt-12 border-t border-rule pt-6">
            <h2 className="eyebrow">Temas</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <li key={tag} className="border border-rule px-2.5 py-1 text-xs text-muted">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {related.length > 0 && (
          <aside className="mt-20 border-t border-rule pt-8" aria-labelledby="relacionados">
            <h2 id="relacionados" className="eyebrow">
              Continuar lendo
            </h2>

            <ol className="mt-6 grid gap-px bg-rule sm:grid-cols-3">
              {related.map(item => (
                <li key={item.slug} className="bg-paper">
                  <Link to={`/blog/${item.slug}`} className="group flex h-full flex-col gap-3 p-6">
                    <span className="eyebrow text-brand-ink">{CATEGORY_LABELS[item.categoria]}</span>
                    <span className="font-display text-xl leading-tight text-ink group-hover:text-brand-ink">
                      {item.titulo}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1 text-xs text-muted">
                      Ler artigo
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </article>
    </>
  )
}
