import type { ReactNode } from 'react'

/**
 * Renderizador de Markdown mínimo para os artigos do acervo.
 * Gera elementos React em vez de HTML — sem dangerouslySetInnerHTML e sem
 * dependência externa. Suporta títulos, listas, citações, ênfase e links.
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(INLINE)
    .filter(Boolean)
    .map((token, index) => {
      const key = `${keyPrefix}-${index}`

      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={key}>{token.slice(2, -2)}</strong>
      }

      if (token.startsWith('*') && token.endsWith('*')) {
        return <em key={key}>{token.slice(1, -1)}</em>
      }

      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) {
        const [, label, href] = link
        const external = /^https?:\/\//.test(href)

        return (
          <a key={key} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {label}
          </a>
        )
      }

      return <span key={key}>{token}</span>
    })
}

export function renderMarkdown(source: string): ReactNode[] {
  const blocks = source.replace(/\r\n?/g, '\n').split(/\n{2,}/)

  return blocks.flatMap((block, blockIndex) => {
    const trimmed = block.trim()
    if (!trimmed) return []

    const key = `block-${blockIndex}`
    const lines = trimmed.split('\n')

    if (trimmed.startsWith('### ')) {
      return <h3 key={key}>{renderInline(trimmed.slice(4), key)}</h3>
    }

    if (trimmed.startsWith('## ')) {
      return <h2 key={key}>{renderInline(trimmed.slice(3), key)}</h2>
    }

    if (trimmed.startsWith('# ')) {
      return <h2 key={key}>{renderInline(trimmed.slice(2), key)}</h2>
    }

    if (lines.every(line => line.startsWith('> '))) {
      return <blockquote key={key}>{renderInline(lines.map(line => line.slice(2)).join(' '), key)}</blockquote>
    }

    if (lines.every(line => /^[-*]\s/.test(line))) {
      return (
        <ul key={key}>
          {lines.map((line, index) => (
            <li key={`${key}-${index}`}>{renderInline(line.replace(/^[-*]\s/, ''), `${key}-${index}`)}</li>
          ))}
        </ul>
      )
    }

    if (lines.every(line => /^\d+[.)]\s/.test(line))) {
      return (
        <ol key={key}>
          {lines.map((line, index) => (
            <li key={`${key}-${index}`}>{renderInline(line.replace(/^\d+[.)]\s/, ''), `${key}-${index}`)}</li>
          ))}
        </ol>
      )
    }

    return <p key={key}>{renderInline(lines.join(' '), key)}</p>
  })
}
