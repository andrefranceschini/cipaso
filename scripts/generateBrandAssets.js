/**
 * Gera os PNGs de marca (ícones PWA, apple-touch-icon e imagem Open Graph)
 * a partir do símbolo vetorial em public/favicon.svg e do logotipo em
 * src/assets/png/cipaso-logo.png.
 *
 * Script de uso pontual — rode com `npm run assets` quando a marca mudar.
 * Sem dependências: rasterizador de path SVG + encoder PNG próprios.
 */
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')
const faviconPath = path.join(publicDir, 'favicon.svg')
const wordmarkPath = path.join(__dirname, '../src/assets/png/cipaso-logo.png')

// Identidade escura do site: ícones e imagem social no mesmo fundo profundo
const PAPER = [6, 9, 13]
const BRAND = [92, 189, 191]
const INK = [233, 241, 242]
const SUPERSAMPLE = 4

// ---------------------------------------------------------------- PNG encode

const crcTable = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
})()

function crc32(buffer) {
  let c = -1
  for (let i = 0; i < buffer.length; i++) c = crcTable[(c ^ buffer[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function encodePng(canvas) {
  const { width, height, data } = canvas
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)

  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0
    data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }

  const chunk = (type, payload) => {
    const size = Buffer.alloc(4)
    size.writeUInt32BE(payload.length)
    const body = Buffer.concat([Buffer.from(type, 'ascii'), payload])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(body))
    return Buffer.concat([size, body, crc])
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])
}

// ---------------------------------------------------------------- PNG decode

function decodePng(buffer) {
  const width = buffer.readUInt32BE(16)
  const height = buffer.readUInt32BE(20)
  const bitDepth = buffer[24]
  const colorType = buffer[25]
  const interlace = buffer[28]

  if (bitDepth !== 8 || interlace !== 0 || (colorType !== 6 && colorType !== 2)) {
    throw new Error(`PNG não suportado (depth ${bitDepth}, color ${colorType}, interlace ${interlace})`)
  }

  const channels = colorType === 6 ? 4 : 3
  const parts = []
  let offset = 8

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString('ascii', offset + 4, offset + 8)
    if (type === 'IDAT') parts.push(buffer.subarray(offset + 8, offset + 8 + length))
    if (type === 'IEND') break
    offset += 12 + length
  }

  const inflated = zlib.inflateSync(Buffer.concat(parts))
  const stride = width * channels
  const data = Buffer.alloc(width * height * 4)
  let previous = Buffer.alloc(stride)

  for (let y = 0; y < height; y++) {
    const filter = inflated[y * (stride + 1)]
    const line = Buffer.from(inflated.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride))

    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? line[x - channels] : 0
      const b = previous[x]
      const c = x >= channels ? previous[x - channels] : 0
      let value = line[x]

      if (filter === 1) value += a
      else if (filter === 2) value += b
      else if (filter === 3) value += (a + b) >> 1
      else if (filter === 4) {
        const p = a + b - c
        const pa = Math.abs(p - a)
        const pb = Math.abs(p - b)
        const pc = Math.abs(p - c)
        value += pa <= pb && pa <= pc ? a : pb <= pc ? b : c
      }

      line[x] = value & 0xff
    }

    for (let x = 0; x < width; x++) {
      const from = x * channels
      const to = (y * width + x) * 4
      data[to] = line[from]
      data[to + 1] = line[from + 1]
      data[to + 2] = line[from + 2]
      data[to + 3] = channels === 4 ? line[from + 3] : 255
    }

    previous = line
  }

  return { width, height, data }
}

// ---------------------------------------------------------------- canvas

function createCanvas(width, height, color) {
  const data = Buffer.alloc(width * height * 4)

  for (let i = 0; i < width * height; i++) {
    data[i * 4] = color[0]
    data[i * 4 + 1] = color[1]
    data[i * 4 + 2] = color[2]
    data[i * 4 + 3] = 255
  }

  return { width, height, data }
}

function fillRect(canvas, x0, y0, width, height, color) {
  for (let y = y0; y < y0 + height; y++) {
    if (y < 0 || y >= canvas.height) continue
    for (let x = x0; x < x0 + width; x++) {
      if (x < 0 || x >= canvas.width) continue
      const i = (y * canvas.width + x) * 4
      canvas.data[i] = color[0]
      canvas.data[i + 1] = color[1]
      canvas.data[i + 2] = color[2]
      canvas.data[i + 3] = 255
    }
  }
}

/** Redimensiona por média de área (box filter) e compõe sobre a canvas. */
function drawImage(canvas, image, targetX, targetY, targetWidth, targetHeight) {
  const scaleX = image.width / targetWidth
  const scaleY = image.height / targetHeight

  for (let y = 0; y < targetHeight; y++) {
    const sourceY0 = Math.floor(y * scaleY)
    const sourceY1 = Math.max(sourceY0 + 1, Math.floor((y + 1) * scaleY))

    for (let x = 0; x < targetWidth; x++) {
      const sourceX0 = Math.floor(x * scaleX)
      const sourceX1 = Math.max(sourceX0 + 1, Math.floor((x + 1) * scaleX))

      let r = 0
      let g = 0
      let b = 0
      let a = 0
      let count = 0

      for (let sy = sourceY0; sy < sourceY1; sy++) {
        for (let sx = sourceX0; sx < sourceX1; sx++) {
          const i = (sy * image.width + sx) * 4
          r += image.data[i]
          g += image.data[i + 1]
          b += image.data[i + 2]
          a += image.data[i + 3]
          count++
        }
      }

      blend(canvas, targetX + x, targetY + y, [r / count, g / count, b / count], a / count / 255)
    }
  }
}

function blend(canvas, x, y, color, alpha) {
  if (alpha <= 0 || x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return

  const i = (y * canvas.width + x) * 4
  canvas.data[i] = Math.round(canvas.data[i] * (1 - alpha) + color[0] * alpha)
  canvas.data[i + 1] = Math.round(canvas.data[i + 1] * (1 - alpha) + color[1] * alpha)
  canvas.data[i + 2] = Math.round(canvas.data[i + 2] * (1 - alpha) + color[2] * alpha)
  canvas.data[i + 3] = 255
}

// ---------------------------------------------------------------- SVG paths

/** Extrai os atributos `d` e o viewBox do SVG. */
function parseSvg(source) {
  const viewBox = source.match(/viewBox="([^"]+)"/)
  if (!viewBox) throw new Error('SVG sem viewBox')

  const [minX, minY, width, height] = viewBox[1].trim().split(/[\s,]+/).map(Number)
  const paths = [...source.matchAll(/\sd="([^"]+)"/g)].map(match => match[1])

  return { minX, minY, width, height, paths }
}

/** Converte um path (M/C/L/z absolutos e relativos) em polígonos. */
function pathToPolygons(d, steps = 16) {
  const tokens = d.match(/[MmLlHhVvCcSsQqZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []
  const polygons = []

  let current = []
  let command = ''
  let x = 0
  let y = 0
  let startX = 0
  let startY = 0
  let index = 0

  const number = () => Number(tokens[index++])

  const closeCurrent = () => {
    if (current.length > 2) polygons.push(current)
    current = []
  }

  const cubic = (x1, y1, x2, y2, x3, y3) => {
    for (let step = 1; step <= steps; step++) {
      const t = step / steps
      const u = 1 - t
      current.push([
        u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
        u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
      ])
    }
    x = x3
    y = y3
  }

  while (index < tokens.length) {
    const token = tokens[index]

    if (/[MmLlHhVvCcZz]/.test(token)) {
      command = token
      index++
    }

    switch (command) {
      case 'M':
      case 'm': {
        const nx = number()
        const ny = number()
        closeCurrent()
        x = command === 'M' ? nx : x + nx
        y = command === 'M' ? ny : y + ny
        startX = x
        startY = y
        current.push([x, y])
        command = command === 'M' ? 'L' : 'l'
        break
      }
      case 'L':
      case 'l': {
        const nx = number()
        const ny = number()
        x = command === 'L' ? nx : x + nx
        y = command === 'L' ? ny : y + ny
        current.push([x, y])
        break
      }
      case 'H':
      case 'h': {
        const nx = number()
        x = command === 'H' ? nx : x + nx
        current.push([x, y])
        break
      }
      case 'V':
      case 'v': {
        const ny = number()
        y = command === 'V' ? ny : y + ny
        current.push([x, y])
        break
      }
      case 'C':
      case 'c': {
        const relative = command === 'c'
        const x1 = number() + (relative ? x : 0)
        const y1 = number() + (relative ? y : 0)
        const x2 = number() + (relative ? x : 0)
        const y2 = number() + (relative ? y : 0)
        const x3 = number() + (relative ? x : 0)
        const y3 = number() + (relative ? y : 0)
        cubic(x1, y1, x2, y2, x3, y3)
        break
      }
      case 'Z':
      case 'z': {
        current.push([startX, startY])
        closeCurrent()
        x = startX
        y = startY
        index++
        break
      }
      default:
        index++
    }
  }

  closeCurrent()
  return polygons
}

/**
 * Preenche os polígonos com regra even-odd (o símbolo usa contornos internos
 * como recortes) usando supersampling para suavizar as bordas.
 */
function fillPolygons(canvas, polygons, color, transform) {
  const scale = SUPERSAMPLE
  const coverage = new Float32Array(canvas.width * canvas.height)

  const edges = []
  let minY = Infinity
  let maxY = -Infinity

  for (const polygon of polygons) {
    for (let i = 0; i < polygon.length - 1; i++) {
      const [ax, ay] = transform(polygon[i])
      const [bx, by] = transform(polygon[i + 1])
      if (ay === by) continue
      edges.push({ ax: ax * scale, ay: ay * scale, bx: bx * scale, by: by * scale })
      minY = Math.min(minY, ay * scale, by * scale)
      maxY = Math.max(maxY, ay * scale, by * scale)
    }
  }

  const yStart = Math.max(0, Math.floor(minY))
  const yEnd = Math.min(canvas.height * scale, Math.ceil(maxY))

  for (let sy = yStart; sy < yEnd; sy++) {
    const scanY = sy + 0.5
    const crossings = []

    for (const edge of edges) {
      const { ax, ay, bx, by } = edge
      if (scanY < Math.min(ay, by) || scanY >= Math.max(ay, by)) continue
      crossings.push(ax + ((scanY - ay) / (by - ay)) * (bx - ax))
    }

    if (crossings.length < 2) continue
    crossings.sort((a, b) => a - b)

    for (let i = 0; i + 1 < crossings.length; i += 2) {
      const from = Math.max(0, Math.ceil(crossings[i] - 0.5))
      const to = Math.min(canvas.width * scale - 1, Math.floor(crossings[i + 1] - 0.5))

      for (let sx = from; sx <= to; sx++) {
        coverage[Math.floor(sy / scale) * canvas.width + Math.floor(sx / scale)] += 1
      }
    }
  }

  const max = scale * scale
  for (let i = 0; i < coverage.length; i++) {
    if (coverage[i] <= 0) continue
    blend(canvas, i % canvas.width, Math.floor(i / canvas.width), color, Math.min(1, coverage[i] / max))
  }
}

function drawSymbol(canvas, svg, boxX, boxY, boxSize, color) {
  const artWidth = svg.width
  const artHeight = svg.height
  const scale = boxSize / Math.max(artWidth, artHeight)
  const offsetX = boxX + (boxSize - artWidth * scale) / 2
  const offsetY = boxY + (boxSize - artHeight * scale) / 2

  const transform = ([x, y]) => [(x - svg.minX) * scale + offsetX, (y - svg.minY) * scale + offsetY]

  for (const d of svg.paths) {
    fillPolygons(canvas, pathToPolygons(d), color, transform)
  }
}

// ---------------------------------------------------------------- saída

/**
 * O PNG do logotipo é uma captura de tela: traz o xadrez cinza/branco que os
 * editores usam para indicar transparência. Recupera o alfa real removendo
 * pixels cinzas claros e preservando o turquesa e o texto escuro.
 */
function keyOutCheckerboard(image) {
  const data = Buffer.from(image.data)

  for (let i = 0; i < image.width * image.height; i++) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const neutral = max - min < 18

    if (!neutral) continue

    if (max > 200) data[i * 4 + 3] = 0
    else if (max > 170) data[i * 4 + 3] = Math.round(((200 - max) / 30) * 255)
  }

  return { width: image.width, height: image.height, data }
}

/**
 * O subtítulo do logotipo é azul-marinho escuro — invisível sobre o fundo
 * escuro do site. Repinta os glifos escuros com a cor de tinta clara,
 * preservando o turquesa do CIPASO.
 */
function recolorDarkGlyphs(image, color) {
  const data = Buffer.from(image.data)

  for (let i = 0; i < image.width * image.height; i++) {
    if (data[i * 4 + 3] === 0) continue

    const max = Math.max(data[i * 4], data[i * 4 + 1], data[i * 4 + 2])
    if (max < 130) {
      data[i * 4] = color[0]
      data[i * 4 + 1] = color[1]
      data[i * 4 + 2] = color[2]
    }
  }

  return { width: image.width, height: image.height, data }
}

/** Recorta a área com conteúdo visível, descartando as margens transparentes. */
function trimTransparent(image) {
  let minX = image.width
  let minY = image.height
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      if (image.data[(y * image.width + x) * 4 + 3] < 24) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }

  if (maxX < 0) return image

  const width = maxX - minX + 1
  const height = maxY - minY + 1
  const data = Buffer.alloc(width * height * 4)

  for (let y = 0; y < height; y++) {
    image.data.copy(
      data,
      y * width * 4,
      ((y + minY) * image.width + minX) * 4,
      ((y + minY) * image.width + minX + width) * 4
    )
  }

  return { width, height, data }
}

function writeAsset(name, canvas) {
  const target = path.join(publicDir, name)
  fs.writeFileSync(target, encodePng(canvas))
  console.log(`[marca] ✓ ${name} (${canvas.width}×${canvas.height})`)
}

function buildIcon(svg, size, background, color) {
  const canvas = createCanvas(size, size, background)
  const padding = Math.round(size * 0.14)
  drawSymbol(canvas, svg, padding, padding, size - padding * 2, color)
  return canvas
}

function buildOgImage(svg, wordmark) {
  const canvas = createCanvas(1200, 630, PAPER)

  // Faixa superior turquesa: assinatura visual do memorial
  fillRect(canvas, 0, 0, 1200, 10, BRAND)
  fillRect(canvas, 0, 620, 1200, 10, BRAND)

  drawSymbol(canvas, svg, 96, 195, 240, BRAND)

  const wordmarkWidth = 640
  const wordmarkHeight = Math.round((wordmark.height / wordmark.width) * wordmarkWidth)
  drawImage(canvas, wordmark, 400, Math.round(315 - wordmarkHeight / 2), wordmarkWidth, wordmarkHeight)

  fillRect(canvas, 400, Math.round(315 + wordmarkHeight / 2) + 28, 640, 2, INK)

  return canvas
}

try {
  const svg = parseSvg(fs.readFileSync(faviconPath, 'utf-8'))
  const wordmark = recolorDarkGlyphs(
    trimTransparent(keyOutCheckerboard(decodePng(fs.readFileSync(wordmarkPath)))),
    INK
  )

  writeAsset('pwa-192x192.png', buildIcon(svg, 192, PAPER, BRAND))
  writeAsset('pwa-512x512.png', buildIcon(svg, 512, PAPER, BRAND))
  writeAsset('apple-touch-icon.png', buildIcon(svg, 180, PAPER, BRAND))
  writeAsset('og-image.png', buildOgImage(svg, wordmark))
} catch (error) {
  console.error(`[marca] erro: ${error.message}`)
  process.exit(1)
}
