import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DOMAIN = 'https://cipaso.com'
const PUBLIC_DIR = path.join(__dirname, '../public')
const FILES_JSON = path.join(__dirname, '../src/data/files.json')
const BLOG_JSON = path.join(__dirname, '../src/data/blog.json')

const today = new Date().toISOString().split('T')[0]

const staticPages = [
  { loc: '/', changefreq: 'monthly', priority: '1.0' },
  { loc: '/acervo', changefreq: 'weekly', priority: '0.9' },
  { loc: '/sobre', changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
  { loc: '/termos', changefreq: 'yearly', priority: '0.2' }
]

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>'
  ].join('\n')
}

function urlset(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`
}

function sitemapPages(posts) {
  const pages = staticPages.map(page =>
    urlEntry({
      loc: `${DOMAIN}${page.loc}`,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority
    })
  )

  const articles = posts.map(post =>
    urlEntry({
      loc: `${DOMAIN}/blog/${post.slug}`,
      lastmod: post.data || today,
      changefreq: 'yearly',
      priority: '0.7'
    })
  )

  return urlset([...pages, ...articles])
}

function sitemapPdfs(files) {
  const entries = files
    .filter(file => file.tipo === 'pdf')
    .map(file =>
      urlEntry({
        // file.path já vem percent-encoded do gerador do acervo
        loc: `${DOMAIN}${file.path}`,
        lastmod: file.data || today,
        changefreq: 'yearly',
        priority: '0.4'
      })
    )

  return urlset(entries)
}

function sitemapIndex() {
  const maps = ['sitemap-pages.xml', 'sitemap-pdfs.xml']
    .map(
      name => `  <sitemap>
    <loc>${DOMAIN}/${name}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${maps}
</sitemapindex>
`
}

try {
  const files = readJson(FILES_JSON)
  const posts = readJson(BLOG_JSON)

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-index.xml'), sitemapIndex())
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-pages.xml'), sitemapPages(posts))
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-pdfs.xml'), sitemapPdfs(files))

  console.log(
    `[sitemap] ✓ ${staticPages.length} página(s) + ${posts.length} artigo(s) + ${files.filter(f => f.tipo === 'pdf').length} PDF(s)`
  )
} catch (error) {
  console.error(`[sitemap] erro: ${error.message}`)
  process.exit(1)
}
