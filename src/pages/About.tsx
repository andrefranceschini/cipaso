import { ArrowRight } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Reveal } from '@/components/motion/Reveal'
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
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <Reveal className="space-y-6 text-lg leading-relaxed text-muted measure">
            <p>
              O <strong className="text-ink">Centro de Investigação Parapsicológica de Sorocaba</strong> dedicava-se
              ao estudo experimental dos fenômenos exteriorizados através da paranormalidade — capacidade humana
              de percepção hiperestésica e de conhecimento extrassensorial.
            </p>
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

          <Reveal delay={0.08}>
            <ol className="border-t border-rule">
              {timeline.map(item => (
                <li key={item.year} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-rule py-4">
                  <span className="eyebrow tabular pt-0.5 text-brand-ink">{item.year}</span>
                  <span className="text-sm text-ink">{item.event}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
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
            description="Trabalhadas nos níveis cerebrais beta, alfa, teta e delta."
          />
        </Reveal>

        <ol className="mt-10 border-t border-rule">
          {tools.map((tool, index) => (
            <Reveal as="li" key={tool.title} delay={index * 0.05}>
              <div className="grid gap-2 border-b border-rule py-6 md:grid-cols-[4rem_1fr_1fr] md:gap-8">
                <span className="eyebrow tabular text-brand-ink">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-xl leading-tight text-ink">{tool.title}</h3>
                <p className="text-muted">{tool.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="container-editorial pb-20" aria-labelledby="professor">
        <Reveal>
          <SectionHeading index="03" eyebrow="Biografia" title={<span id="professor">Prof. Valter Franceschini</span>} />
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-[22rem_1fr] lg:gap-16">
          <Reveal>
            <figure>
              <img
                src={valterPhoto}
                alt="Prof. Valter Álfredo Franceschini, fundador do CIPASO"
                width={352}
                height={469}
                loading="lazy"
                decoding="async"
                className="w-full border border-rule object-cover"
              />
              <figcaption className="mt-3 border-t border-rule pt-3 text-xs text-muted">
                Campinas, 02/08/1940 — Sorocaba, 18/02/2016 (75 anos)
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.08} className="space-y-5 text-lg leading-relaxed text-muted measure">
            <p>
              <strong className="text-ink">Escritor, conferencista, parapsicólogo, professor e operador dos
              fenômenos PSI</strong>, foi o idealizador e mentor do CIPASO.
            </p>
            <p>
              Sua proposta de unir ciência e humanismo definiu a filosofia da instituição. Foram mais de 55 anos
              de magistério e centenas de alunos formados.
            </p>
            <blockquote className="border-l-2 border-brand pl-5 font-display text-xl leading-snug text-ink">
              “Sem Deus na vida, nada caminha.”
            </blockquote>
            <p>
              O trabalho segue acessível aqui, em documentos, artigos e registros audiovisuais reunidos pela
              família e por amigos.
            </p>

            <div className="pt-4">
              <ButtonLink to="/acervo">
                Visitar o acervo digital
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
