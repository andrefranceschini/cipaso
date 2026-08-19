import { useMemo, useState } from 'react'
import { FileText, Film, Image as ImageIcon, Music, Search, X } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Modal } from '@/components/common/Modal'
import { FileViewer } from '@/components/common/FileViewer'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/Button'
import { CATEGORY_LABELS, getAllFiles, getSeries, type DigitalFile, type FileType } from '@/data/files'
import { cn, formatDate, formatFileSize } from '@/lib/utils'

type SortOption = 'recentes' | 'antigos' | 'az' | 'za'

const sortLabels: Record<SortOption, string> = {
  recentes: 'Publicação mais recente',
  antigos: 'Publicação mais antiga',
  az: 'Título (A → Z)',
  za: 'Título (Z → A)'
}

const typeIcons: Record<FileType, typeof FileText> = {
  pdf: FileText,
  imagem: ImageIcon,
  audio: Music,
  video: Film
}

const PAGE_SIZE = 24

export function Acervo() {
  const allFiles = getAllFiles()
  const series = getSeries()

  const [query, setQuery] = useState('')
  const [serie, setSerie] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('recentes')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [selected, setSelected] = useState<DigitalFile | null>(null)

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    const filtered = allFiles.filter(file => {
      if (serie && file.serie !== serie) return false
      if (!normalized) return true

      return (
        file.titulo.toLowerCase().includes(normalized) ||
        file.descricao.toLowerCase().includes(normalized) ||
        file.arquivo.toLowerCase().includes(normalized)
      )
    })

    const sorted = [...filtered]

    // Itens sem data catalogada ficam sempre no fim das ordenações cronológicas.
    const byDate = (a: DigitalFile, b: DigitalFile, direction: 1 | -1) => {
      if (!a.data && !b.data) return 0
      if (!a.data) return 1
      if (!b.data) return -1
      return direction * b.data.localeCompare(a.data)
    }

    switch (sort) {
      case 'antigos':
        sorted.sort((a, b) => byDate(a, b, -1))
        break
      case 'az':
        sorted.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR', { numeric: true }))
        break
      case 'za':
        sorted.sort((a, b) => b.titulo.localeCompare(a.titulo, 'pt-BR', { numeric: true }))
        break
      default:
        sorted.sort((a, b) => byDate(a, b, 1))
        break
    }

    return sorted
  }, [allFiles, query, serie, sort])

  const shown = results.slice(0, visible)

  const resetPagination = () => setVisible(PAGE_SIZE)

  return (
    <>
      <SEO
        title="Acervo digital"
        description={`Consulte ${allFiles.length} itens do acervo do CIPASO: colunas de parapsicologia publicadas no Diário de Sorocaba e no Jornal Ipanema entre 1997 e 2006, além de registros em vídeo.`}
        path="/acervo"
      />

      <section className="border-b border-rule paper-grain">
        <div className="container-editorial py-14">
          <Reveal immediate>
            <p className="eyebrow">Catálogo</p>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,3.75rem)] leading-none text-ink">Acervo digital</h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              {allFiles.length} itens digitalizados a partir dos originais. Títulos, datas e veículos foram lidos
              do próprio documento; a revisão manual da catalogação segue em andamento.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-editorial py-10">
        {/* Filtros */}
        <div className="grid gap-5 border-b border-rule pb-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label htmlFor="busca-acervo" className="eyebrow block">
              Buscar no acervo
            </label>
            <div className="relative mt-3">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
                aria-hidden="true"
              />
              <input
                id="busca-acervo"
                type="search"
                value={query}
                onChange={event => {
                  setQuery(event.target.value)
                  resetPagination()
                }}
                placeholder="Título, descrição ou nome do arquivo"
                className="w-full border border-rule bg-raised py-2.5 pl-9 pr-9 text-ink placeholder:text-faint focus:border-brand-ink focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    resetPagination()
                  }}
                  aria-label="Limpar busca"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="ordem-acervo" className="eyebrow block">
              Ordenar por
            </label>
            <select
              id="ordem-acervo"
              value={sort}
              onChange={event => setSort(event.target.value as SortOption)}
              className="mt-3 w-full border border-rule bg-raised px-3 py-2.5 text-ink focus:border-brand-ink focus:outline-none md:w-56"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="eyebrow">Origem</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setSerie(null)
                resetPagination()
              }}
              aria-pressed={serie === null}
              className={cn(
                'border px-3 py-1.5 text-sm transition-colors',
                serie === null
                  ? 'border-brand-ink bg-brand-ink text-on-brand-ink'
                  : 'border-rule text-muted hover:border-brand-ink hover:text-ink'
              )}
            >
              Tudo ({allFiles.length})
            </button>

            {series.map(name => {
              const total = allFiles.filter(file => file.serie === name).length
              const isActive = serie === name

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setSerie(isActive ? null : name)
                    resetPagination()
                  }}
                  aria-pressed={isActive}
                  className={cn(
                    'border px-3 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'border-brand-ink bg-brand-ink text-on-brand-ink'
                      : 'border-rule text-muted hover:border-brand-ink hover:text-ink'
                  )}
                >
                  {name} ({total})
                </button>
              )
            })}
          </div>
        </fieldset>

        <p aria-live="polite" className="mt-6 text-sm text-muted tabular">
          {results.length === 0
            ? 'Nenhum item encontrado.'
            : `${results.length} ${results.length === 1 ? 'item' : 'itens'} · exibindo ${shown.length}`}
        </p>

        {/* Índice do acervo */}
        {results.length > 0 ? (
          <>
            <ol className="mt-4 border-t border-rule">
              {shown.map((file, index) => {
                const Icon = typeIcons[file.tipo]

                return (
                  <li key={file.id} className="border-b border-rule">
                    <button
                      type="button"
                      onClick={() => setSelected(file)}
                      className="group grid w-full grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-1.5 py-4 text-left transition-colors hover:bg-brand-wash/60 md:grid-cols-[3rem_1fr_8rem_11rem_4.5rem]"
                    >
                      <span className="eyebrow tabular text-faint">{String(index + 1).padStart(3, '0')}</span>

                      <span className="flex items-baseline gap-2 min-w-0">
                        <Icon className="h-4 w-4 shrink-0 translate-y-0.5 text-brand-ink" aria-hidden="true" />
                        <span className="truncate text-ink group-hover:text-brand-ink">{file.titulo}</span>
                      </span>

                      <span className="col-start-2 text-xs text-muted tabular md:col-start-3">
                        {file.data ? (
                          <time dateTime={file.data}>{formatDate(file.data, 'short')}</time>
                        ) : (
                          <span className="text-faint">sem data</span>
                        )}
                      </span>

                      <span className="col-start-2 truncate text-xs text-muted md:col-start-4">{file.serie}</span>

                      <span className="col-start-2 text-xs text-muted tabular md:col-start-5 md:text-right">
                        {formatFileSize(file.tamanho)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            {visible < results.length && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline" onClick={() => setVisible(current => current + PAGE_SIZE)}>
                  Carregar mais ({results.length - visible} restantes)
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-10 border border-rule bg-raised p-10 text-center">
            <p className="text-muted">Nada corresponde a essa busca no acervo.</p>
            <div className="mt-5">
              <Button
                variant="outline"
                onClick={() => {
                  setQuery('')
                  setSerie(null)
                  resetPagination()
                }}
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.titulo ?? ''}
        description={selected ? `${CATEGORY_LABELS[selected.categoria]} · ${selected.serie}` : undefined}
      >
        {selected && <FileViewer file={selected} />}
      </Modal>
    </>
  )
}
