import { SEO } from '@/components/SEO'
import { ButtonLink } from '@/components/ui/Button'
import { useLocation } from 'react-router-dom'

interface NotFoundProps {
  title?: string
  description?: string
  actionLabel?: string
  actionTo?: string
}

export function NotFound({
  title = 'Página não encontrada',
  description = 'O endereço acessado não existe neste memorial. Talvez o conteúdo esteja no acervo digital.',
  actionLabel = 'Ir para o acervo',
  actionTo = '/acervo'
}: NotFoundProps) {
  const { pathname } = useLocation()

  return (
    <>
      <SEO title={title} description={description} path={pathname} noindex />

      <div className="container-editorial py-24">
        <p className="eyebrow tabular text-brand-ink">Erro 404</p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.5rem,7vw,3.75rem)] leading-none text-ink">{title}</h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{description}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink to={actionTo}>{actionLabel}</ButtonLink>
          <ButtonLink to="/" variant="outline">
            Voltar ao início
          </ButtonLink>
        </div>
      </div>
    </>
  )
}
