import blogData from './blog.json'

export type BlogPostCategory = 'pesquisa' | 'desenvolvimento' | 'institucional'

export interface BlogPost {
  id: number
  titulo: string
  slug: string
  resumo: string
  conteudo: string
  autor: string
  data: string
  categoria: BlogPostCategory
  tags: string[]
  /** Estimativa em minutos, calculada na geração do JSON. */
  tempoLeitura: number
}

export const CATEGORY_LABELS: Record<BlogPostCategory, string> = {
  pesquisa: 'Pesquisa',
  desenvolvimento: 'Desenvolvimento',
  institucional: 'Institucional'
}

// O gerador já entrega os posts ordenados do mais recente para o mais antigo.
const posts = blogData as BlogPost[]

export function getAllPosts(): BlogPost[] {
  return posts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find(post => post.slug === slug)
}

export function getRecentPosts(limit = 5): BlogPost[] {
  return posts.slice(0, limit)
}

export function getPostsByCategory(category: BlogPostCategory): BlogPost[] {
  return posts.filter(post => post.categoria === category)
}

/** Artigos relacionados: mesma categoria primeiro, completando com os mais recentes. */
export function getRelatedPosts(current: BlogPost, limit = 3): BlogPost[] {
  const sameCategory = posts.filter(post => post.slug !== current.slug && post.categoria === current.categoria)
  const others = posts.filter(post => post.slug !== current.slug && post.categoria !== current.categoria)

  return [...sameCategory, ...others].slice(0, limit)
}
