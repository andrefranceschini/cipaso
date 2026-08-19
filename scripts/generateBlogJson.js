import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const postsDir = path.join(__dirname, '../posts')
const outputPath = path.join(__dirname, '../src/data/blog.json')

const VALID_CATEGORIES = ['pesquisa', 'desenvolvimento', 'institucional']
const DEFAULT_CATEGORY = 'desenvolvimento'
const DEFAULT_AUTHOR = 'Prof. Valter Franceschini'
const IGNORED_FILES = new Set(['README.md'])
const WORDS_PER_MINUTE = 200

/**
 * Normaliza quebras de linha. Arquivos criados no Windows chegam com CRLF e
 * quebram qualquer parser de frontmatter baseado em \n.
 */
function normalizeEol(text) {
  return text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
}

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function stripQuotes(value) {
  return value.trim().replace(/^['"]|['"]$/g, '')
}

function parseList(value) {
  const raw = stripQuotes(value).replace(/^\[|\]$/g, '')
  return raw
    .split(',')
    .map(item => stripQuotes(item))
    .filter(Boolean)
}

/**
 * Parser de frontmatter YAML mínimo: pares chave/valor e listas inline.
 * Suficiente para o formato usado em posts/ e sem dependência externa.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return null

  const data = {}
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue

    const separator = line.indexOf(':')
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (key) data[key] = value
  }

  return { data, body: content.slice(match[0].length).trim() }
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime())
}

function readingTime(body) {
  const words = body.replace(/[#*_>`-]/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

function buildPost(source, file) {
  const { titulo, resumo, conteudo } = source

  if (!titulo || !resumo || !conteudo) {
    console.warn(`[blog] ${file}: ignorado (titulo, resumo ou conteudo ausente)`)
    return null
  }

  const categoria = VALID_CATEGORIES.includes(source.categoria) ? source.categoria : DEFAULT_CATEGORY
  if (source.categoria && categoria !== source.categoria) {
    console.warn(`[blog] ${file}: categoria "${source.categoria}" inválida, usando "${DEFAULT_CATEGORY}"`)
  }

  const data = isValidDate(source.data || '') ? source.data : new Date().toISOString().split('T')[0]
  if (source.data && data !== source.data) {
    console.warn(`[blog] ${file}: data "${source.data}" inválida (esperado YYYY-MM-DD)`)
  }

  return {
    titulo,
    slug: source.slug || slugify(titulo),
    resumo,
    conteudo,
    autor: source.autor || DEFAULT_AUTHOR,
    data,
    categoria,
    tags: source.tags ?? [],
    tempoLeitura: readingTime(conteudo)
  }
}

function readPost(file) {
  const content = normalizeEol(fs.readFileSync(path.join(postsDir, file), 'utf-8'))

  if (file.endsWith('.json')) {
    try {
      const json = JSON.parse(content)
      return buildPost({ ...json, tags: Array.isArray(json.tags) ? json.tags : [] }, file)
    } catch (error) {
      console.warn(`[blog] ${file}: JSON inválido (${error.message})`)
      return null
    }
  }

  const parsed = parseFrontmatter(content)
  if (!parsed) {
    console.warn(`[blog] ${file}: ignorado (frontmatter --- ausente)`)
    return null
  }

  const { data, body } = parsed
  return buildPost(
    {
      titulo: stripQuotes(data.titulo || ''),
      slug: data.slug ? slugify(stripQuotes(data.slug)) : '',
      resumo: stripQuotes(data.resumo || ''),
      conteudo: body,
      autor: stripQuotes(data.autor || ''),
      data: stripQuotes(data.data || ''),
      categoria: stripQuotes(data.categoria || ''),
      tags: data.tags ? parseList(data.tags) : []
    },
    file
  )
}

function scanPosts() {
  if (!fs.existsSync(postsDir)) {
    console.warn(`[blog] diretório não encontrado: ${postsDir}`)
    return { posts: [], candidates: 0 }
  }

  const files = fs
    .readdirSync(postsDir)
    .filter(file => (file.endsWith('.md') || file.endsWith('.json')) && !IGNORED_FILES.has(file))
    .sort()

  const posts = files.map(readPost).filter(Boolean)

  const slugs = new Set()
  for (const post of posts) {
    if (slugs.has(post.slug)) {
      throw new Error(`slug duplicado: "${post.slug}". Slugs precisam ser únicos.`)
    }
    slugs.add(post.slug)
  }

  posts.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  posts.forEach((post, index) => {
    post.id = index + 1
  })

  return { posts, candidates: files.length }
}

try {
  const { posts, candidates } = scanPosts()

  // Guarda de build: arquivos existem mas nenhum foi lido = parser quebrado.
  // Sem isso o blog é publicado vazio silenciosamente.
  if (candidates > 0 && posts.length === 0) {
    throw new Error(`${candidates} arquivo(s) em posts/ mas nenhum post válido foi gerado.`)
  }

  fs.writeFileSync(outputPath, `${JSON.stringify(posts, null, 2)}\n`)
  console.log(`[blog] ✓ ${posts.length} post(s) gerado(s) em src/data/blog.json`)
  posts.forEach(post => console.log(`[blog]   - ${post.data} · ${post.titulo}`))
} catch (error) {
  console.error(`[blog] erro: ${error.message}`)
  process.exit(1)
}
