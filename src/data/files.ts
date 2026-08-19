import filesData from './files.json'

export type FileCategory = 'textos' | 'imagens' | 'audios' | 'videos' | 'jornais' | 'livros'
export type FileType = 'pdf' | 'imagem' | 'audio' | 'video'

export interface DigitalFile {
  id: number
  titulo: string
  /** Data de publicação original quando catalogada em acervo.overrides.json. */
  data: string | null
  descricao: string
  categoria: FileCategory
  /** Agrupamento de origem: "Jornal Ipanema", "Série 1", "Coletâneas"... */
  serie: string
  tipo: FileType
  tamanho: number
  arquivo: string
  path: string
}

const files = filesData as DigitalFile[]

export const CATEGORY_LABELS: Record<FileCategory, string> = {
  textos: 'Documentos',
  imagens: 'Imagens',
  audios: 'Áudios',
  videos: 'Vídeos',
  jornais: 'Jornais',
  livros: 'Publicações'
}

export function getAllFiles(): DigitalFile[] {
  return files
}

export function getFilesByCategory(category: FileCategory): DigitalFile[] {
  return files.filter(file => file.categoria === category)
}

export function getSeries(): string[] {
  return Array.from(new Set(files.map(file => file.serie))).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

function dayOfYear(date = new Date()): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  return Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86400000)
}

/**
 * Item em destaque do dia: determinístico, para que todos os visitantes vejam
 * o mesmo arquivo e o conteúdo não troque a cada renderização.
 */
export function getFileForDay(options: { exclude?: FileCategory[] } = {}): DigitalFile | undefined {
  const exclude = options.exclude ?? []
  const available = files.filter(file => !exclude.includes(file.categoria))

  if (available.length === 0) return undefined

  return available[dayOfYear() % available.length]
}

export function getVideoForDay(): DigitalFile | undefined {
  const videos = getFilesByCategory('videos')
  if (videos.length === 0) return undefined

  return videos[dayOfYear() % videos.length]
}
