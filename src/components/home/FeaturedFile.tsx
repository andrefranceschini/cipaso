import { useState } from 'react'
import { FileText } from 'lucide-react'
import { getFileForDay } from '@/data/files'
import { Modal } from '@/components/common/Modal'
import { FileViewer } from '@/components/common/FileViewer'
import { Button } from '@/components/ui/Button'
import { formatDate, formatFileSize } from '@/lib/utils'

export function FeaturedFile() {
  const [isOpen, setIsOpen] = useState(false)
  const file = getFileForDay({ exclude: ['audios'] })

  if (!file) return null

  return (
    <article className="sheet flex h-full flex-col p-7">
      <p className="eyebrow flex items-center gap-2">
        <FileText className="h-3.5 w-3.5 text-brand-ink" aria-hidden="true" />
        Documento do dia
      </p>

      <h3 className="mt-6 font-display text-2xl leading-tight text-ink sm:text-[1.75rem]">{file.titulo}</h3>

      <p className="mt-3 text-sm leading-relaxed text-muted">{file.descricao}</p>

      <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-rule pt-4 text-xs">
        <div>
          <dt className="eyebrow">Publicado</dt>
          <dd className="mt-1 text-ink tabular">{file.data ? formatDate(file.data, "short") : "—"}</dd>
        </div>
        <div>
          <dt className="eyebrow">Origem</dt>
          <dd className="mt-1 text-ink">{file.serie}</dd>
        </div>
        <div>
          <dt className="eyebrow">Tamanho</dt>
          <dd className="mt-1 tabular text-ink">{formatFileSize(file.tamanho)}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button onClick={() => setIsOpen(true)}>Consultar documento</Button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={file.titulo}>
        <FileViewer file={file} />
      </Modal>
    </article>
  )
}
