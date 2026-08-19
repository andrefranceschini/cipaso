import { SEO } from '@/components/SEO'
import { Reveal } from '@/components/motion/Reveal'

const sections = [
  {
    id: 'aviso',
    title: 'Aviso legal',
    paragraphs: [
      'O Memorial Digital CIPASO preserva a memória e o legado do Prof. Valter Álfredo Franceschini e do Centro de Investigação Parapsicológica de Sorocaba (CIPASO).',
      'O site é mantido com finalidade educacional, histórica e informativa. Os documentos, imagens, áudios e vídeos são cedidos pela Família Franceschini e por amigos.',
      'CIPASO e Parâmetros Holísticos estão inativos. Nada aqui constitui oferta de serviço, consulta, diagnóstico ou tratamento de saúde.'
    ]
  },
  {
    id: 'conteudo',
    title: 'Sobre o conteúdo',
    paragraphs: [
      'Os arquivos são disponibilizados para consulta, estudo e preservação da memória do trabalho do Prof. Valter Franceschini.',
      'Os direitos de propriedade intelectual dos materiais históricos pertencem aos seus respectivos titulares. A reprodução ou distribuição sem autorização prévia é proibida, exceto para fins educacionais e não comerciais, com citação da fonte.'
    ]
  },
  {
    id: 'direitos',
    title: 'Direitos autorais',
    paragraphs: [
      'O design e o desenvolvimento deste memorial são de autoria de André Franceschini e estão protegidos por direitos autorais.',
      'Os materiais históricos conservam seus direitos originais. Qualquer uso comercial requer autorização prévia da Família Franceschini.'
    ]
  },
  {
    id: 'responsabilidade',
    title: 'Isenção de responsabilidade',
    paragraphs: [
      'As informações são fornecidas no estado em que se encontram, sem garantias de qualquer natureza. O memorial não se responsabiliza por interrupções de acesso, perdas decorrentes do uso do site, conteúdo de terceiros ou eventuais imprecisões nos materiais históricos.'
    ]
  },
  {
    id: 'privacidade',
    title: 'Privacidade e armazenamento local',
    paragraphs: [
      'Este site não possui formulários, não cria contas e não coleta dados pessoais identificáveis. Nenhum dado é enviado a terceiros e não há rastreamento publicitário.',
      'Um service worker armazena arquivos do site em cache para permitir carregamento mais rápido e leitura offline. Esse cache pode ser apagado a qualquer momento nas configurações do navegador.'
    ]
  },
  {
    id: 'uso',
    title: 'Condições de uso',
    list: [
      'Usar o site apenas para fins lícitos.',
      'Respeitar os direitos de propriedade intelectual de terceiros.',
      'Não tentar contornar medidas de segurança.',
      'Não realizar downloads massivos automatizados do acervo.'
    ]
  }
]

export function Legal() {
  return (
    <>
      <SEO
        title="Termos & privacidade"
        description="Aviso legal, direitos autorais, isenção de responsabilidade e política de privacidade do Memorial Digital CIPASO."
        path="/termos"
      />

      <section className="border-b border-rule paper-grain">
        <div className="container-editorial py-14">
          <Reveal immediate>
            <p className="eyebrow">Documentação</p>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,3.75rem)] leading-none text-ink">Termos & privacidade</h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              Como este memorial é mantido, o que pode ser reutilizado e quais dados o site guarda.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-editorial grid gap-12 py-14 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <nav aria-label="Sumário" className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="eyebrow">Sumário</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {sections.map((section, index) => (
              <li key={section.id} className="flex gap-3">
                <span className="tabular text-faint">{String(index + 1).padStart(2, '0')}</span>
                <a href={`#${section.id}`} className="link-ink">
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-14">
          {sections.map((section, index) => (
            <Reveal as="section" key={section.id} id={section.id}>
              <h2 className="border-t border-rule pt-5 font-display text-2xl text-ink">
                <span className="eyebrow tabular mr-3 text-brand-ink">{String(index + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>

              {section.paragraphs?.map(paragraph => (
                <p key={paragraph.slice(0, 40)} className="mt-4 leading-relaxed text-muted measure">
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="mt-4 space-y-2 text-muted">
                  {section.list.map(item => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="text-brand-ink">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}

          <section className="border-t border-rule pt-8">
            <h2 className="eyebrow">Contato</h2>
            <p className="mt-4 text-muted">
              Para contribuições, correções ou pedidos de remoção de material:{' '}
              <a href="mailto:contato@cipaso.com" className="link-ink">
                contato@cipaso.com
              </a>{' '}
              ·{' '}
              <a href="tel:+5515997234932" className="link-ink tabular">
                +55 (15) 99723-4932
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
