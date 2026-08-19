import { Helmet } from 'react-helmet-async'

const SITE = 'https://cipaso.com'
const DEFAULT_IMAGE = `${SITE}/og-image.png`
const SITE_NAME = 'Memorial CIPASO'

interface ArticleMetadata {
  publishedTime: string
  modifiedTime?: string
  author: string
  section?: string
  tags?: string[]
}

interface SEOProps {
  title: string
  description: string
  /** Caminho da rota, ex.: "/acervo". A URL canônica absoluta é montada aqui. */
  path: string
  image?: string
  type?: 'website' | 'article'
  article?: ArticleMetadata
  noindex?: boolean
}

export function SEO({ title, description, path, image = DEFAULT_IMAGE, type = 'website', article, noindex }: SEOProps) {
  const canonical = `${SITE}${path}`
  const fullTitle = path === '/' ? title : `${title} — ${SITE_NAME}`

  const schema =
    type === 'article' && article
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          url: canonical,
          image,
          inLanguage: 'pt-BR',
          datePublished: article.publishedTime,
          dateModified: article.modifiedTime ?? article.publishedTime,
          articleSection: article.section,
          keywords: article.tags?.join(', '),
          author: { '@type': 'Person', name: article.author },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: { '@type': 'ImageObject', url: `${SITE}/pwa-512x512.png` }
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description,
          url: canonical,
          inLanguage: 'pt-BR',
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE }
        }

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}
      />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} — ${title}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {type === 'article' && article && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {type === 'article' && article && <meta property="article:author" content={article.author} />}

      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
