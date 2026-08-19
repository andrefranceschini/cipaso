/**
 * Cataloga os PDFs do acervo lendo o texto embutido em cada arquivo.
 *
 * Os PDFs são impressões das colunas do Prof. Valter e trazem, no topo,
 * o veículo, a data de publicação e o título do texto. Este script extrai
 * esses dados e grava src/data/acervo.catalogo.json, consumido pelo gerador
 * do acervo (metadados manuais em acervo.overrides.json têm prioridade).
 *
 * Uso: npm run catalog
 */
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pdfDir = path.join(__dirname, '../public/uploads/publicacoes')
const outputPath = path.join(__dirname, '../src/data/acervo.catalogo.json')

const MONTHS = {
  janeiro: 1,
  fevereiro: 2,
  marco: 3,
  março: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12
}

const MASTHEAD = [
  /^coluna parapsicologia/i,
  /^j\s*o\s*r\s*n\s*a\s*l/i,
  /^par[âa]metros\s+mentais/i,
  /^atualiza[çc][ãa]o/i,
  /^public/i,
  /^sorocaba/i
]

const MAX_TITLE_LENGTH = 90

// ---------------------------------------------------------------- PDF → texto

function inflateStreams(buffer) {
  const streams = []
  let cursor = 0

  while (true) {
    const start = buffer.indexOf('stream', cursor)
    if (start === -1) break

    const end = buffer.indexOf('endstream', start)
    if (end === -1) break

    let dataStart = start + 6
    if (buffer[dataStart] === 0x0d) dataStart++
    if (buffer[dataStart] === 0x0a) dataStart++

    const chunk = buffer.subarray(dataStart, end)

    try {
      streams.push(zlib.inflateSync(chunk).toString('latin1'))
    } catch {
      streams.push(chunk.toString('latin1'))
    }

    cursor = end + 9
  }

  return streams
}

/** Monta o mapa código → caractere a partir dos CMaps /ToUnicode das fontes. */
function buildUnicodeMap(streams) {
  const map = new Map()

  const fromHex = hex =>
    hex
      .match(/.{4}/g)
      ?.map(part => String.fromCharCode(parseInt(part, 16)))
      .join('') ?? ''

  for (const stream of streams) {
    for (const block of stream.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
      for (const pair of block[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g)) {
        map.set(parseInt(pair[1], 16), fromHex(pair[2]))
      }
    }

    for (const block of stream.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
      for (const range of block[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g)) {
        const from = parseInt(range[1], 16)
        const to = parseInt(range[2], 16)
        const base = parseInt(range[3], 16)

        for (let code = from; code <= to && code - from < 512; code++) {
          map.set(code, String.fromCharCode(base + (code - from)))
        }
      }
    }
  }

  return map
}

/** Blocos de texto na ordem do documento, agrupados por fonte. */
function extractRuns(buffer) {
  const streams = inflateStreams(buffer)
  const unicode = buildUnicodeMap(streams)
  const runs = []

  const pattern =
    /\/([A-Za-z0-9]+)\s+([\d.]+)\s+Tf|\((?:\\.|[^\\()])*\)|<([0-9a-fA-F\s]+)>|\bT\*|\bTd\b|\bTD\b|\bET\b/g

  for (const stream of streams) {
    if (!/\bTJ\b|\bTj\b/.test(stream)) continue

    let text = ''
    let font = ''

    const flush = () => {
      const clean = text.replace(/\s+/g, ' ').trim()
      if (clean) runs.push({ font, text: clean })
      text = ''
    }

    for (const token of stream.matchAll(pattern)) {
      const value = token[0]

      if (value.endsWith('Tf')) {
        flush()
        font = token[1]
      } else if (value.startsWith('(')) {
        const decoded = value
          .slice(1, -1)
          .replace(/\\(\d{1,3})/g, (_, code) => String.fromCharCode(parseInt(code, 8)))
          .replace(/\\([()\\])/g, '$1')

        text += [...decoded].map(char => unicode.get(char.charCodeAt(0)) ?? char).join('')
      } else if (value.startsWith('<')) {
        const hex = value.slice(1, -1).replace(/\s+/g, '')
        text += (hex.match(/.{1,4}/g) ?? []).map(code => unicode.get(parseInt(code, 16)) ?? '').join('')
      } else {
        text += ' '
      }
    }

    flush()
  }

  return runs.filter(run => run.font)
}

// ---------------------------------------------------------------- metadados

function toIsoDate(day, month, year) {
  const fullYear = year.length === 2 ? (Number(year) > 50 ? `19${year}` : `20${year}`) : year
  const iso = `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return Number.isNaN(new Date(iso).getTime()) ? null : iso
}

function findDate(text) {
  // Aceita "Sorocaba, 28/03/2001" e intervalos como "Sorocaba, 17 a 23/09/ 97".
  const numeric = text.match(/Sorocaba,[^\n]{0,20}?(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{2,4})/i)
  if (numeric) return toIsoDate(numeric[1], Number(numeric[2]), numeric[3])

  const named = text.match(/Sorocaba,\s*([A-Za-zçÇãÃéÉ]+)\s*\/\s*(\d{4})/i)
  if (named) {
    const month = MONTHS[named[1].toLowerCase()]
    if (month) return toIsoDate('01', month, named[2])
  }

  return null
}

function findSource(text) {
  if (/i\s*p\s*a\s*n\s*e\s*m\s*a/i.test(text)) return 'Jornal Ipanema'
  if (/di[áa]rio de sorocaba/i.test(text)) return 'Diário de Sorocaba'
  return null
}

function isMasthead(text) {
  return MASTHEAD.some(pattern => pattern.test(text))
}

/** Assinatura do autor que aparece logo abaixo do título nas colunas mais recentes. */
const BYLINE = /Prof\.?\s*V[áa]lter\s+Franceschini/i

function cleanTitle(candidate) {
  const trimmed = candidate
    .replace(/^[\s—–-]+/, '')
    // Resto do cabeçalho quando a data vem em intervalo ("a 23/09/ 97 Título").
    .replace(/^(?:a\s*)?\d{1,2}\s*\/\s*\d{1,2}\s*\/\s*\d{2,4}\s*/, '')
    .split(BYLINE)[0]
    .replace(/\s+Prof\.?$/i, '')
    .trim()

  if (!trimmed) return null

  // Nos PDFs o título costuma vir colado à primeira palavra do corpo
  // ("Rosto e Humor de CinzasEstamos em plena..."): o corte é a letra
  // minúscula imediatamente seguida de maiúscula, sem espaço no meio.
  const glued = trimmed.match(/^(.{4,}?[a-zà-ÿ0-9?!.])(?=[A-ZÀ-Ý])/u)
  const question = trimmed.match(/^(.{4,80}?[?!])\s/u)

  // Entre o corte por pontuação e o corte pela emenda com o corpo, vale o menor:
  // os dois padrões coexistem em textos que começam com citação.
  const candidates = [question?.[1], glued?.[1], trimmed].filter(Boolean)
  let title = candidates.sort((a, b) => a.length - b.length)[0]

  title = title
    .replace(/\s+/g, ' ')
    // Sobra da primeira letra do corpo colada ao fim ("...no recintoU"),
    // sem mutilar títulos em caixa alta.
    .replace(/([a-zà-ÿ])[A-ZÀ-Ý]$/u, '$1')
    .replace(/[\s.,;:—–-]+$/u, '')
    .trim()

  if (title.length > MAX_TITLE_LENGTH) {
    const words = title.split(' ')
    title = words.slice(0, 9).join(' ')
  }

  if (/^(prof|dr|sr|sra)\.?$/i.test(title)) return null

  return title.length >= 6 ? title : null
}

function extractMetadata(runs) {
  const fullText = runs.map(run => run.text).join(' ')
  const data = findDate(fullText)
  const veiculo = findSource(fullText)

  // Caso 1: o título está isolado em uma fonte própria.
  const titleRun = runs
    .slice(0, 6)
    .find(run => !isMasthead(run.text) && run.text.length >= 8 && run.text.length <= MAX_TITLE_LENGTH)

  let titulo = titleRun ? cleanTitle(titleRun.text) : null
  let body = ''

  if (!titulo) {
    // Caso 2: cabeçalho, título e corpo vieram no mesmo bloco.
    const afterDate = fullText.split(/Sorocaba,\s*[^\s]+\s?/i).slice(1).join(' ')
    titulo = cleanTitle(afterDate)
    body = titulo ? afterDate.slice(afterDate.indexOf(titulo) + titulo.length) : afterDate
  } else {
    const index = fullText.indexOf(titleRun.text)
    body = index === -1 ? fullText : fullText.slice(index + titleRun.text.length)
  }

  const resumo = body
    .replace(/Coluna Parapsicologia[^\]]*\]/g, ' ')
    .replace(BYLINE, ' ')
    .replace(/^[\s.,;:—–-]+/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220)

  return { titulo, data, veiculo, resumo: resumo || null }
}

// ---------------------------------------------------------------- execução

try {
  if (!fs.existsSync(pdfDir)) {
    throw new Error(`diretório não encontrado: ${pdfDir}`)
  }

  const files = fs.readdirSync(pdfDir).filter(file => file.toLowerCase().endsWith('.pdf')).sort()
  const catalog = {}
  const failures = []

  for (const file of files) {
    try {
      const runs = extractRuns(fs.readFileSync(path.join(pdfDir, file)))
      const { titulo, data, veiculo, resumo } = extractMetadata(runs)

      if (!titulo && !data) {
        failures.push(file)
        continue
      }

      catalog[file] = {
        ...(titulo ? { titulo } : {}),
        ...(data ? { data } : {}),
        ...(veiculo ? { veiculo } : {}),
        ...(resumo ? { resumo } : {})
      }
    } catch (error) {
      failures.push(`${file} (${error.message})`)
    }
  }

  fs.writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`)

  const withTitle = Object.values(catalog).filter(entry => entry.titulo).length
  const withDate = Object.values(catalog).filter(entry => entry.data).length

  console.log(`[catálogo] ${files.length} PDFs lidos`)
  console.log(`[catálogo] ${withTitle} com título · ${withDate} com data`)
  if (failures.length) console.log(`[catálogo] sem metadados: ${failures.join(', ')}`)
} catch (error) {
  console.error(`[catálogo] erro: ${error.message}`)
  process.exit(1)
}
