import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/solid'
import parametrosLogo from '@/assets/svg/parametros-logo.svg'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-muted bg-bg mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Informações Institucionais */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">CIPASO</h3>
            <p className="text-sm text-muted-fg mb-4">
              Centro de Investigação Parapsicológica de Sorocaba
            </p>
            <div className="space-y-2 text-xs text-muted-fg">
              <p>CNPJ: 58.984.089/0001-58</p>
              <p>Fundação: 1989</p>
              <p className="text-yellow-600 dark:text-yellow-500 font-semibold">Status: Inativo</p>
            </div>
          </div>

          {/* Parâmetros Holísticos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={parametrosLogo}
                alt="Parâmetros Holísticos Logo"
                className="h-8 w-8 shrink-0"
                width={32}
                height={32}
                loading="lazy"
                decoding="async"
              />
              <h3 className="text-lg font-bold text-[#EDAF73]">Parâmetros Holísticos</h3>
            </div>
            <p className="text-sm text-muted-fg mb-4">
              Formação Humana LTDA.
            </p>
            <div className="space-y-2 text-xs text-muted-fg">
              <p>CNPJ: 67.361.410/0001-39</p>
              <p>Fundação: 1989</p>
              <p className="text-yellow-600 dark:text-yellow-500 font-semibold">Status: Inativo</p>
            </div>
          </div>

          {/* Localização Histórica */}
          <div>
            <h3 className="text-lg font-bold mb-4">Localização Histórica</h3>
            <div className="space-y-3 text-sm text-muted-fg">
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  Rua Oswaldo Segamarchi, 15<br />
                  Sorocaba/SP
                </p>
              </div>
            </div>
            <p className="text-xs mt-4 text-yellow-600 dark:text-yellow-500 font-semibold">
              CIPASO e Parâmetros Holísticos não existem mais neste local físico.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <div className="space-y-3 text-sm text-muted-fg">
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4 shrink-0" />
                <a href="mailto:contato@cipaso.com" className="hover:text-primary transition-colors break-all">
                  contato@cipaso.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 shrink-0" />
                <a href="tel:+5515997234932" className="hover:text-primary transition-colors">
                  +55 (15) 99723-4932
                </a>
              </div>
            </div>
            <p className="text-xs text-muted-fg mt-4 pt-4 border-t border-muted/30">
              Tem material, história ou mensagem positiva para contribuir? Entre em contato!
            </p>
          </div>
        </div>

        {/* Créditos e Copyright */}
        <div className="mt-12 pt-8 border-t border-muted space-y-3 text-center text-xs text-muted-fg">
          <p>
            Memorial Digital desenvolvido por <a href="https://www.linkedin.com/in/andrefranceschini/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors font-semibold">André Franceschini</a>
          </p>
          <p>
            Arquivos oferecidos e disponibilizados pela Família Franceschini e Amigos, com o intuito de preservar a memória do <strong>Prof. Valter Álfredo Franceschini</strong>, parte da história da parapsicologia e da cidade de Sorocaba. O material é disponibilizado a todos, com o objetivo de possibilitar a melhoria da qualidade de vida e o conhecimento de seu trabalho.
          </p>
          <p className="pt-4">
          <a href="https://cipaso.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors font-semibold">CIPASO©{currentYear}</a> | Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
