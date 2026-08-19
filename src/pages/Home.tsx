import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Reveal } from '@/components/motion/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ButtonLink } from '@/components/ui/Button'
import { DailyQuote } from '@/components/home/DailyQuote'
import { FeaturedFile } from '@/components/home/FeaturedFile'
import { FeaturedVideo } from '@/components/home/FeaturedVideo'
import { AboutValter } from '@/components/home/AboutValter'
import { getAllPosts, getRecentPosts, CATEGORY_LABELS } from '@/data/blog'
import { getAllFiles } from '@/data/files'
import { formatDate } from '@/lib/utils'

const values = [
  {
    term: 'Investigação',
    definition: 'Estudo experimental e classificação dos fenômenos exteriorizados pela paranormalidade.'
  },
  {
    term: 'Reprogramação',
    definition: 'Trabalho consciente sobre os padrões mentais para segurança emocional e saúde.'
  },
  {
    term: 'Comunidade',
    definition: 'Fortalecimento dos vínculos familiares e comunitários como base do desenvolvimento.'
  },
  {
    term: 'Divulgação',
    definition: 'Educação acessível, sem hermetismo, para quem quiser estudar o material.'
  }
]

export function Home() {
  const posts = getRecentPosts(4)
  const totalFiles = getAllFiles().length

  return (
    <>
      <SEO
        title="Memorial CIPASO — Centro de Investigação Parapsicológica de Sorocaba"
        description="Memorial digital do CIPASO: 240 colunas de parapsicologia publicadas entre 1997 e 2006, artigos e a metodologia do Prof. Valter Franceschini sobre reprogramação mental."
        path="/"
      />

      {/* Masthead: dimensionado para caber inteiro na viewport em qualquer tela */}
      <section className="paper-grain relative border-b border-rule">
        {/* Símbolo do CIPASO como marca d'água, fora do fluxo do texto */}
        <img
          src="/favicon.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-[8%] top-1/2 hidden w-[46vw] max-w-2xl -translate-y-1/2 opacity-[0.07] select-none md:block"
        />

        <div className="container-editorial flex min-h-[calc(100svh-4.35rem)] flex-col justify-center gap-[clamp(1.25rem,3vh,2.5rem)] py-[clamp(1.5rem,4vh,3.5rem)]">
          <Reveal immediate>
            <p className="eyebrow flex items-center gap-3">
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
              Memorial digital · Sorocaba, São Paulo
            </p>

            <h1 className="mt-[clamp(0.75rem,2vh,1.5rem)]">
              <span className="text-glow block font-display text-[clamp(4rem,17vw,11rem)] leading-[0.85] tracking-tight text-brand-ink">
                CIPASO
              </span>
              <span className="mt-[clamp(0.5rem,1.5vh,1rem)] block max-w-3xl font-display text-[clamp(1.15rem,3vw,1.9rem)] leading-tight text-ink">
                Centro de Investigação Parapsicológica de Sorocaba
              </span>
            </h1>

            <p className="mt-[clamp(0.75rem,2vh,1.5rem)] max-w-xl text-[clamp(0.9375rem,1.2vw,1.0625rem)] leading-relaxed text-muted">
              Um arquivo aberto da pesquisa, do ensino e da produção do CIPASO entre 1989 e 2016, e do trabalho
              do Prof. Valter Álfredo Franceschini.
            </p>
          </Reveal>

          <Reveal immediate delay={0.1}>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex flex-wrap gap-3">
                <ButtonLink to="/acervo">
                  Explorar o acervo
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink to="/sobre" variant="outline">
                  Conhecer a história
                </ButtonLink>
              </div>

              <dl className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {[
                  { label: 'Fundação', value: '1989' },
                  { label: 'Encerramento', value: '2016' },
                  { label: 'Itens', value: String(totalFiles) },
                  { label: 'Artigos', value: String(getAllPosts().length) }
                ].map(item => (
                  <div key={item.label} className="flex items-baseline gap-2">
                    <dd className="font-display text-lg tabular text-ink">{item.value}</dd>
                    <dt className="eyebrow text-[0.575rem]">{item.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

        </div>
      </section>

      {/* Destaques do dia */}
      <section className="container-editorial py-20" aria-labelledby="hoje">
        <Reveal>
          <SectionHeading
            index="01"
            eyebrow="Seleção diária"
            title={<span id="hoje">Do acervo, hoje</span>}
            description="Um documento e uma citação escolhidos por dia — iguais para todos os visitantes, renovados à meia-noite."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal>
            <DailyQuote />
          </Reveal>
          <Reveal delay={0.08}>
            <FeaturedFile />
          </Reveal>
        </div>
      </section>

      <AboutValter />

      {/* Vídeo */}
      <section className="container-editorial py-20" aria-labelledby="video">
        <Reveal>
          <SectionHeading
            index="03"
            eyebrow="Registro audiovisual"
            title={<span id="video">Acervo em vídeo</span>}
            description="Palestras e registros históricos digitalizados a partir das fitas originais."
          />
        </Reveal>

        <Reveal className="mt-10">
          <FeaturedVideo />
        </Reveal>
      </section>

      {/* Artigos */}
      {posts.length > 0 && (
        <section className="container-editorial py-20" aria-labelledby="artigos">
          <Reveal>
            <SectionHeading
              index="04"
              eyebrow="Textos do professor"
              title={<span id="artigos">Últimos artigos</span>}
              description="Colunas e materiais didáticos transcritos do acervo original."
            />
          </Reveal>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2">
            {posts.map((post, index) => (
              <Reveal as="li" key={post.slug} delay={index * 0.06} className="h-full">
                <Link
                  to={`/blog/${post.slug}`}
                  className="sheet sheet-interactive group flex h-full flex-col gap-4 p-7"
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="eyebrow eyebrow-lum tabular">
                      {String(index + 1).padStart(2, '0')} · {CATEGORY_LABELS[post.categoria]}
                    </span>
                    <time dateTime={post.data} className="text-xs text-faint tabular">
                      {formatDate(post.data, 'short')}
                    </time>
                  </span>

                  <span className="font-display text-2xl leading-tight text-ink transition-colors group-hover:text-brand-ink">
                    {post.titulo}
                  </span>

                  <span className="text-sm leading-relaxed text-muted">{post.resumo}</span>

                  <span className="mt-auto inline-flex items-center gap-2 border-t border-rule pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink">
                    Ler artigo
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>

          <div className="mt-10">
            <ButtonLink to="/blog" variant="outline">
              Ver todos os artigos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </section>
      )}

      {/* Legado */}
      <section className="border-t border-rule bg-sunken" aria-labelledby="legado">
        <div className="container-editorial py-20">
          <Reveal>
            <SectionHeading
              index="05"
              eyebrow="Legado"
              title={<span id="legado">Ciência experimental e humanismo</span>}
            />
          </Reveal>

          {/* Colunas com a mesma altura: a citação absorve a folga à esquerda
              e os quatro cartões dividem igualmente a altura à direita */}
          <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
            <Reveal className="flex h-full flex-col gap-5 text-lg leading-relaxed text-muted">
              <p>
                O CIPASO estudava, identificava e classificava os fenômenos exteriorizados através da
                paranormalidade — a capacidade de percepção hiperestésica e de conhecimento extrassensorial.
              </p>
              <p>
                Fundado em 1989, desenvolveu métodos de cura, orientação e aconselhamento apoiados em observação
                sistemática. Este memorial preserva esse material e o mantém acessível a pesquisadores, alunos e
                familiares.
              </p>
              <figure className="sheet flex flex-1 flex-col justify-center p-6">
                <figcaption className="eyebrow">A 3ª Lei da Mente</figcaption>
                <blockquote className="mt-4 font-display text-xl leading-snug text-ink">
                  “O seu corpo reage de acordo com como age a sua mente.”
                </blockquote>
                <p className="mt-4 text-sm text-muted">
                  Origem das doenças psicossomáticas segundo o método: pensamentos destrutivos atraem aquilo que
                  prejudica — daí a necessidade de trabalhar a programação mental de forma consciente.
                </p>
              </figure>
            </Reveal>

            <Reveal delay={0.08} className="h-full">
              <dl className="grid h-full auto-rows-fr gap-5 sm:grid-cols-2">
                {values.map((value, index) => (
                  <div key={value.term} className="sheet flex flex-col p-6">
                    <dt className="flex items-baseline gap-3">
                      <span className="font-display text-xl leading-none text-brand-ink tabular">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="eyebrow">{value.term}</span>
                    </dt>
                    <dd className="mt-4 text-sm leading-relaxed text-muted">{value.definition}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
