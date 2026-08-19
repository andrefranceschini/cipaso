import { Download } from 'lucide-react'
import { getVideoForDay } from '@/data/files'
import { ButtonAnchor } from '@/components/ui/Button'
import { formatFileSize } from '@/lib/utils'

export function FeaturedVideo() {
  const video = getVideoForDay()

  if (!video) return null

  return (
    <div className="sheet grid gap-0 lg:grid-cols-[1.4fr_1fr]">
      <div className="bg-black">
        <video
          src={video.path}
          controls
          preload="metadata"
          playsInline
          className="aspect-video h-full w-full"
        >
          Seu navegador não reproduz este vídeo.
        </video>
      </div>

      <div className="flex flex-col justify-between gap-6 border-t border-rule p-7 lg:border-l lg:border-t-0">
        <div>
          <p className="eyebrow">Vídeo do acervo</p>
          <h3 className="mt-4 font-display text-2xl leading-tight text-ink">{video.titulo}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{video.descricao}</p>
        </div>

        <ButtonAnchor href={video.path} download variant="outline" className="self-start">
          <Download className="h-4 w-4" aria-hidden="true" />
          Baixar ({formatFileSize(video.tamanho)})
        </ButtonAnchor>
      </div>
    </div>
  )
}
