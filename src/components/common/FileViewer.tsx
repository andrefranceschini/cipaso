import { Download, ExternalLink } from 'lucide-react'
import type { DigitalFile } from '@/data/files'
import { ButtonAnchor } from '@/components/ui/Button'
import { formatDate, formatFileSize } from '@/lib/utils'

interface FileViewerProps {
  file: DigitalFile
}

function Actions({ file }: FileViewerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <ButtonAnchor href={file.path} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        Abrir em nova aba
      </ButtonAnchor>
      <ButtonAnchor href={file.path} download variant="outline">
        <Download className="h-4 w-4" aria-hidden="true" />
        Baixar ({formatFileSize(file.tamanho)})
      </ButtonAnchor>
    </div>
  )
}

/**
 * Visualização do item do acervo dentro do modal.
 * PDFs usam iframe (navegadores móveis costumam não renderizar <embed>), sempre
 * com as ações de abrir e baixar visíveis como alternativa.
 */
export function FileViewer({ file }: FileViewerProps) {
  return (
    <div className="space-y-5">
      {file.tipo === 'pdf' && (
        <div className="h-[65vh] min-h-80 w-full overflow-hidden border border-rule bg-sunken">
          <iframe src={file.path} title={`Documento: ${file.titulo}`} className="h-full w-full" loading="lazy" />
        </div>
      )}

      {file.tipo === 'imagem' && (
        <img
          src={file.path}
          alt={file.titulo}
          className="mx-auto max-h-[65vh] w-auto border border-rule"
          loading="lazy"
          decoding="async"
        />
      )}

      {file.tipo === 'video' && (
        <video src={file.path} controls preload="metadata" className="w-full border border-rule bg-black">
          Seu navegador não reproduz este vídeo.
        </video>
      )}

      {file.tipo === 'audio' && <audio src={file.path} controls preload="metadata" className="w-full" />}

      <p className="text-sm text-muted">{file.descricao}</p>

      <dl className="grid grid-cols-2 gap-4 border-t border-rule pt-4 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div>
          <dt className="eyebrow">Publicado</dt>
          <dd className="mt-1 text-ink tabular">
            {file.data ? <time dateTime={file.data}>{formatDate(file.data)}</time> : "Sem data"}
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Origem</dt>
          <dd className="mt-1 text-ink">{file.serie}</dd>
        </div>
        <div>
          <dt className="eyebrow">Formato</dt>
          <dd className="mt-1 text-ink uppercase">{file.tipo}</dd>
        </div>
        <div>
          <dt className="eyebrow">Tamanho</dt>
          <dd className="mt-1 text-ink tabular">{formatFileSize(file.tamanho)}</dd>
        </div>
        <div>
          <dt className="eyebrow">Arquivo</dt>
          <dd className="mt-1 break-all text-ink">{file.arquivo}</dd>
        </div>
      </dl>

      <Actions file={file} />
    </div>
  )
}
