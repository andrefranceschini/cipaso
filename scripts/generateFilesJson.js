import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '../public/uploads')
const overridesPath = path.join(__dirname, '../src/data/acervo.overrides.json')
const catalogPath = path.join(__dirname, '../src/data/acervo.catalogo.json')
const outputPath = path.join(__dirname, '../src/data/files.json')

const categoryMap = {
  documentos: { categoria: 'textos', serie: 'Documentos' },
  imagens: { categoria: 'imagens', serie: 'Imagens' },
  hemeroteca: { categoria: 'jornais', serie: 'Hemeroteca' },
  publicacoes: { categoria: 'livros', serie: 'Publicações' },
  audios: { categoria: 'audios', serie: 'Áudios' },
  videos: { categoria: 'videos', serie: 'Vídeos' }
}

const typeByExtension = {
  '.pdf': 'pdf',
  '.jpg': 'imagem',
  '.jpeg': 'imagem',
  '.png': 'imagem',
  '.webp': 'imagem',
  '.gif': 'imagem',
  '.mp3': 'audio',
  '.wav': 'audio',
  '.m4a': 'audio',
  '.mp4': 'video',
  '.webm': 'video',
  '.mov': 'video'
}

/**
 * Padrões de nomenclatura do acervo digitalizado.
 * O título deriva do próprio nome do arquivo: nenhum metadado é inventado.
 * Títulos e datas reais entram por src/data/acervo.overrides.json.
 */
const namingRules = [
  {
    pattern: /^ParapsJornalIpanema$/i,
    build: () => ({
      titulo: 'Coletânea — Coluna no Jornal Ipanema',
      serie: 'Coletâneas'
    })
  },
  {
    pattern: /^ParapsDiarioDeSorocaba$/i,
    build: () => ({
      titulo: 'Coletânea — Coluna no Diário de Sorocaba',
      serie: 'Coletâneas'
    })
  },
  {
    pattern: /^paraps-ipanema-(\d+)$/i,
    build: match => ({
      titulo: `Jornal Ipanema — Coluna nº ${Number(match[1])}`,
      serie: 'Jornal Ipanema'
    })
  },
  {
    pattern: /^paraps(\d+)-(\d+)$/i,
    build: match => ({
      titulo: `Parapsicologia — Documento ${Number(match[1])}.${Number(match[2])}`,
      serie: `Série ${Number(match[1])}`
    })
  },
  {
    pattern: /^paraps(\d+)$/i,
    build: match => ({
      titulo: `Parapsicologia — Documento ${Number(match[1])}`,
      serie: 'Documentos avulsos'
    })
  }
]

function baseName(filename) {
  return filename.replace(/\.[^/.]+$/, '')
}

function describe(titulo, filename, serie) {
  return `${titulo}. Digitalizado do acervo do CIPASO — arquivo original: ${filename} (${serie}).`
}

function deriveMetadata(filename, fallbackSerie) {
  const name = baseName(filename)

  for (const rule of namingRules) {
    const match = name.match(rule.pattern)
    if (match) return rule.build(match)
  }

  return { titulo: name.replace(/[_-]+/g, ' ').trim(), serie: fallbackSerie }
}

function loadJson(filePath, label) {
  if (!fs.existsSync(filePath)) return {}

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (error) {
    throw new Error(`${label} inválido: ${error.message}`)
  }
}

function sortKey(file) {
  // Ordem natural: separa números do texto para "Documento 2" vir antes de "Documento 10".
  return file.arquivo.replace(/\d+/g, digits => digits.padStart(6, '0'))
}

function scanUploads(overrides, catalog) {
  if (!fs.existsSync(uploadsDir)) {
    console.warn(`[acervo] diretório não encontrado: ${uploadsDir}`)
    return []
  }

  const entries = []

  for (const folder of fs.readdirSync(uploadsDir, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue

    const mapping = categoryMap[folder.name]
    if (!mapping) {
      console.warn(`[acervo] pasta "${folder.name}" ignorada (sem categoria mapeada)`)
      continue
    }

    const folderPath = path.join(uploadsDir, folder.name)
    const files = fs.readdirSync(folderPath).filter(file => !file.startsWith('.'))

    for (const file of files) {
      const extension = path.extname(file).toLowerCase()
      const tipo = typeByExtension[extension]

      if (!tipo) {
        console.warn(`[acervo] "${folder.name}/${file}" ignorado (extensão ${extension} não suportada)`)
        continue
      }

      const stats = fs.statSync(path.join(folderPath, file))
      const derived = deriveMetadata(file, mapping.serie)
      const cataloged = catalog[file] ?? {}
      const override = overrides[file] ?? {}

      // Precedência: metadado manual > catálogo extraído do PDF > nome do arquivo.
      const titulo = override.titulo ?? cataloged.titulo ?? derived.titulo
      const serie = override.serie ?? cataloged.veiculo ?? derived.serie
      const data = 'data' in override ? override.data : (cataloged.data ?? null)
      const descricao =
        override.descricao ?? (cataloged.resumo ? `${cataloged.resumo}…` : describe(titulo, file, serie))

      entries.push({
        titulo,
        data,
        descricao,
        categoria: override.categoria ?? mapping.categoria,
        serie,
        tipo,
        tamanho: stats.size,
        arquivo: file,
        // encodeURI preserva "/" e escapa espaços/acentos dos nomes originais
        path: encodeURI(`/uploads/${folder.name}/${file}`)
      })
    }
  }

  return entries
}

try {
  const overrides = loadJson(overridesPath, 'acervo.overrides.json')
  const catalog = loadJson(catalogPath, 'acervo.catalogo.json')
  const files = scanUploads(overrides, catalog)

  // Mais recentes primeiro; itens sem data catalogada vão para o fim.
  files.sort((a, b) => {
    if (a.categoria !== b.categoria) return a.categoria.localeCompare(b.categoria)
    if (a.data && b.data && a.data !== b.data) return b.data.localeCompare(a.data)
    if (a.data && !b.data) return -1
    if (!a.data && b.data) return 1
    return sortKey(a).localeCompare(sortKey(b))
  })

  files.forEach((file, index) => {
    file.id = index + 1
  })

  const ordered = files.map(({ id, ...rest }) => ({ id, ...rest }))
  fs.writeFileSync(outputPath, `${JSON.stringify(ordered, null, 2)}\n`)

  const byCategory = files.reduce((acc, file) => {
    acc[file.categoria] = (acc[file.categoria] || 0) + 1
    return acc
  }, {})

  console.log(`[acervo] ✓ ${files.length} arquivo(s) em src/data/files.json`)
  Object.entries(byCategory).forEach(([categoria, total]) =>
    console.log(`[acervo]   ${categoria}: ${total}`)
  )
  console.log(`[acervo] ${Object.keys(overrides).length} arquivo(s) com metadados manuais`)
} catch (error) {
  console.error(`[acervo] erro: ${error.message}`)
  process.exit(1)
}
