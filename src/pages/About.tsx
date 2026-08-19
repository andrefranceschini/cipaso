import { ArrowRight } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Reveal } from '@/components/motion/Reveal'
import { Brainwaves } from '@/components/motion/Brainwaves'
import { cn } from '@/lib/utils'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ButtonLink } from '@/components/ui/Button'
import valterPhoto from '@/assets/png/vaf/Valter Franceschini.jpg'

const tools = [
  {
    title: 'Relaxamento e meditação guiada',
    description:
      'Técnicas para acalmar a mente consciente e acessar estados alterados de consciência de forma controlada.'
  },
  {
    title: 'Visualização criativa e reprogramação mental',
    description: 'Uso dirigido da imaginação para substituir padrões mentais limitantes.'
  },
  {
    title: 'Técnicas de autocura e autoconhecimento',
    description: 'Ferramentas para reconhecer e resolver conflitos internos pela autodescoberta.'
  },
  {
    title: 'Vivência prática das Leis da Mente',
    description: 'Aplicação cotidiana dos princípios, transformando estudo em experiência.'
  },
  {
    title: 'Investigação de fenômenos PSI',
    description: 'Pesquisa sistemática das capacidades extrassensoriais e dos fenômenos observados.'
  }
]

const timeline = [
  { year: '1940', event: 'Nascimento de Valter Álfredo Franceschini, em Campinas (SP).' },
  { year: '1989', event: 'Fundação do CIPASO e da Parâmetros Holísticos, em Sorocaba (SP).' },
  { year: '1989–2016', event: 'Atendimentos, cursos, colunas na imprensa e produção do acervo.' },
  { year: '2016', event: 'Falecimento do Prof. Valter e encerramento das atividades.' },
  { year: 'Hoje', event: 'O acervo é digitalizado e publicado neste memorial pela família.' }
]

export function About() {
  return (
    <>
      <SEO
        title="Sobre o CIPASO"
        description="História do CIPASO, a metodologia das 5 Ferramentas Mentais, a 3ª Lei da Mente e a trajetória do Prof. Valter Álfredo Franceschini (1940–2016)."
        path="/sobre"
      />

      <section className="border-b border-rule paper-grain">
        <div className="container-editorial py-14">
          <Reveal immediate>
            <p className="eyebrow">História e metodologia</p>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,7vw,3.75rem)] leading-none text-ink">
              O que foi o CIPASO
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              Uma instituição de investigação parapsicológica que funcionou em Sorocaba entre 1989 e 2016, e o
              trabalho de quem a idealizou.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-editorial py-20">
        <Reveal>
          <p className="max-w-4xl text-xl leading-relaxed text-ink md:text-2xl md:leading-relaxed">
            O <strong className="text-brand-ink">Centro de Investigação Parapsicológica de Sorocaba</strong>{' '}
            dedicava-se ao estudo experimental dos fenômenos exteriorizados através da paranormalidade —
            capacidade humana de percepção hiperestésica e de conhecimento extrassensorial.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-10 grid gap-8 border-t border-rule pt-8 leading-relaxed text-muted md:grid-cols-2 md:gap-12">
          <p>
            Fundado em 1989 pelo Prof. Valter Álfredo Franceschini, o centro desenvolveu e divulgou métodos de
            cura, orientação e aconselhamento, sempre acompanhados de ensino aberto ao público — em cursos,
            palestras e colunas publicadas na imprensa local.
          </p>
          <p>
            Junto dele funcionou a <strong className="text-ink">Parâmetros Holísticos — Formação Humana LTDA.</strong>,
            braço responsável pela formação e pelas publicações. As duas organizações estão inativas; este
            memorial existe para preservar o que produziram.
          </p>
        </Reveal>

        {/* Linha do tempo horizontal */}
        <Reveal delay={0.08} className="mt-16">
          <h2 className="sr-only">Linha do tempo</h2>
          <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {timeline.map((item, index) => (
              <li key={item.year} className="relative border-t border-rule pt-6">
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute -top-[3.5px] left-0 h-1.5 w-1.5 rounded-full bg-brand',
                    'shadow-[0_0_10px_rgb(92_189_191/0.9)]',
                    index === timeline.length - 1 && 'pulse-dot'
                  )}
                />
                <span className="font-display text-2xl leading-none text-brand-ink tabular">{item.year}</span>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.event}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="border-y border-rule bg-sunken" aria-labelledby="lei">
        <div className="container-editorial grid gap-10 py-20 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading index="01" eyebrow="Princípio central" title={<span id="lei">A 3ª Lei da Mente</span>} />
            <blockquote className="mt-8 font-display text-3xl leading-tight text-brand-ink">
              “O seu corpo reage de acordo com como age a sua mente.”
            </blockquote>
          </Reveal>

          <Reveal delay={0.08} className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              É a explicação que o método dá para as doenças psicossomáticas:{' '}
              <strong className="text-ink">pensamentos destrutivos atraem aquilo que prejudica</strong>. A mudança,
              portanto, começa pela programação mental consciente.
            </p>
            <p>
              A prática se dava por exercícios repetidos e pela vivência das Leis da Mente no cotidiano — não por
              adesão a crenças.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-editorial py-20" aria-labelledby="ferramentas">
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow="Metodologia"
            title={<span id="ferramentas">As 5 Ferramentas Mentais</span>}
            description="Trabalhadas nos níveis cerebrais beta, alfa, teta e delta — os quatro ritmos elétricos do cérebro."
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="sheet mt-10 overflow-hidden px-6 py-4">
            <Brainwaves labeled className="h-40" />
          </div>
        </Reveal>

        <ol className="mt-6 grid gap-5 lg:grid-cols-2">
          {tools.map((tool, index) => (
            <Reveal as="li" key={tool.title} delay={index * 0.05} className={index === 4 ? 'lg:col-span-2' : undefined}>
              <div className="sheet flex h-full gap-5 p-6">
                <span className="font-display text-3xl leading-none text-brand-ink text-glow tabular">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-xl leading-tight text-ink">{tool.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{tool.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="container-editorial pb-20" aria-labelledby="professor">
        <Reveal>
          <SectionHeading index="03" eyebrow="Biografia" title={<span id="professor">Prof. Valter Franceschini</span>} />
        </Reveal>

        <Reveal delay={0.06}>
          <div className="sheet mt-10 grid overflow-hidden lg:grid-cols-[minmax(0,22rem)_1fr]">
            <figure className="border-b border-rule lg:border-b-0 lg:border-r">
              <img
                src={valterPhoto}
                alt="Prof. Valter Álfredo Franceschini, fundador do CIPASO"
                width={352}
                height={469}
                loading="lazy"
                decoding="async"
                className="h-64 w-full object-cover object-top sm:h-80 lg:h-auto lg:min-h-full"
              />
            </figure>

            <div className="flex flex-col gap-6 p-7 sm:p-9 lg:p-11">
              <p className="text-lg leading-relaxed text-muted measure">
                <strong className="text-ink">
                  Escritor, conferencista, parapsicólogo, professor e operador dos fenômenos PSI
                </strong>
                , foi o idealizador e mentor do CIPASO. Sua proposta de unir ciência e humanismo definiu a
                filosofia da instituição — foram mais de 55 anos de magistério e centenas de alunos formados.
              </p>

              <blockquote className="border-y border-rule py-5 text-center font-display text-2xl leading-snug text-brand-ink">
                “Sem Deus na vida, nada caminha.”
              </blockquote>

              <p className="leading-relaxed text-muted measure">
                O trabalho segue acessível aqui, em documentos, artigos e registros audiovisuais reunidos pela
                família e por amigos.
              </p>

              <div className="mt-auto flex flex-wrap items-end justify-between gap-6 border-t border-rule pt-6">
                <dl className="flex gap-10">
                  <div>
                    <dt className="eyebrow">Nascimento</dt>
                    <dd className="mt-1 text-sm text-ink tabular">02.08.1940</dd>
                    <dd className="text-xs text-faint whitespace-nowrap">Campinas, SP</dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Falecimento</dt>
                    <dd className="mt-1 text-sm text-ink tabular">18.02.2016</dd>
                    <dd className="text-xs text-faint whitespace-nowrap">Sorocaba, SP · 75 anos</dd>
                  </div>
                </dl>

                <ButtonLink to="/acervo">
                  Visitar o acervo digital
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
