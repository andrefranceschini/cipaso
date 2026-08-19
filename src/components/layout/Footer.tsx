import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import parametrosLogo from '@/assets/svg/parametros-logo.svg'

const currentYear = new Date().getFullYear()

const institutions = [
  {
    name: 'CIPASO',
    subtitle: 'Centro de Investigação Parapsicológica de Sorocaba',
    cnpj: '58.984.089/0001-58',
    founded: '1989'
  },
  {
    name: 'Parâmetros Holísticos',
    subtitle: 'Formação Humana LTDA.',
    cnpj: '67.361.410/0001-39',
    founded: '1989',
    logo: parametrosLogo
  }
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-rule bg-sunken">
      <div className="container-editorial py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {institutions.map(institution => (
            <section key={institution.name}>
              <div className="flex items-center gap-2">
                {institution.logo && (
                  <img
                    src={institution.logo}
                    alt=""
                    width={24}
                    height={24}
                    loading="lazy"
                    decoding="async"
                    className="h-6 w-6 shrink-0"
                  />
                )}
                <h2 className="font-display text-lg text-ink">{institution.name}</h2>
              </div>

              <p className="mt-2 text-sm text-muted">{institution.subtitle}</p>

              <dl className="mt-4 space-y-1 text-xs text-muted tabular">
                <div className="flex gap-2">
                  <dt className="text-faint">CNPJ</dt>
                  <dd>{institution.cnpj}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-faint">Fundação</dt>
                  <dd>{institution.founded}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-faint">Situação</dt>
                  <dd className="text-mark">Inativa</dd>
                </div>
              </dl>
            </section>
          ))}

          <section>
            <h2 className="eyebrow">Endereço histórico</h2>
            <p className="mt-4 flex gap-2 text-sm text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-ink" aria-hidden="true" />
              <span>
                Rua Oswaldo Segamarchi, 15
                <br />
                Sorocaba — SP
              </span>
            </p>
            <p className="mt-4 text-xs text-muted">
              As instituições não funcionam mais neste endereço. O memorial existe apenas em formato digital.
            </p>
          </section>

          <section>
            <h2 className="eyebrow">Contato</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden="true" />
                <a href="mailto:contato@cipaso.com" className="link-ink break-all">
                  contato@cipaso.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden="true" />
                <a href="tel:+5515997234932" className="link-ink tabular">
                  +55 (15) 99723-4932
                </a>
              </li>
            </ul>

            <p className="mt-4 text-xs text-muted">
              Tem material, história ou lembrança para contribuir com o acervo? Escreva para nós.
            </p>

            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <Link to="/acervo" className="link-ink">
                  Acervo digital
                </Link>
              </li>
              <li>
                <Link to="/blog" className="link-ink">
                  Artigos
                </Link>
              </li>
              <li>
                <Link to="/termos" className="link-ink">
                  Termos & privacidade
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-14 border-t border-rule pt-8 text-xs leading-relaxed text-muted">
          <p className="measure">
            Arquivos cedidos pela Família Franceschini e amigos para preservar a memória do{' '}
            <strong className="text-ink">Prof. Valter Álfredo Franceschini</strong>, parte da história da
            parapsicologia e da cidade de Sorocaba.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Memorial desenvolvido por{' '}
              <a
                href="https://www.linkedin.com/in/andrefranceschini/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-ink"
              >
                André Franceschini
              </a>
            </p>
            <p className="tabular">CIPASO © {currentYear} — Todos os direitos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
