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

      {/* Masthead */}
      <section className="paper-grain border-b border-rule">
        <div className="container-editorial py-16 md:py-24">
          <Reveal immediate>
            <p className="eyebrow">Memorial digital · Sorocaba, São Paulo</p>

            <h1 className="mt-6 font-display text-[clamp(2.5rem,8.5vw,6.5rem)] leading-[0.95] text-ink">
              Centro de Investigação
              <br />
              <span className="text-brand-ink">Parapsicológica</span>
              <br />
              de Sorocaba
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
              Um arquivo aberto da pesquisa, do ensino e da produção do CIPASO entre 1989 e 2016, e do trabalho
              do Prof. Valter Álfredo Franceschini.
            </p>
          </Reveal>

          <Reveal immediate delay={0.1}>
            <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
              {[
                { label: 'Fundação', value: '1989' },
                { label: 'Encerramento', value: '2016' },
                { label: 'Itens no acervo', value: String(totalFiles) },
                { label: 'Artigos', value: String(getAllPosts().length) }
              ].map(item => (
                <div key={item.label} className="bg-paper p-4">
                  <dt className="eyebrow">{item.label}</dt>
                  <dd className="mt-2 font-display text-2xl tabular text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink to="/acervo">
                Explorar o acervo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink to="/sobre" variant="outline">
                Conhecer a história
              </ButtonLink>
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

          <ol className="mt-10 border-t border-rule">
            {posts.map((post, index) => (
              <Reveal as="li" key={post.slug} delay={index * 0.05}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group grid gap-3 border-b border-rule py-7 md:grid-cols-[7rem_1fr_auto] md:items-baseline md:gap-8"
                >
                  <span className="eyebrow tabular text-brand-ink">
                    {String(index + 1).padStart(2, '0')} · {CATEGORY_LABELS[post.categoria]}
                  </span>

                  <span>
                    <span className="font-display text-2xl leading-tight text-ink transition-colors group-hover:text-brand-ink">
                      {post.titulo}
                    </span>
                    <span className="mt-2 block text-muted measure">{post.resumo}</span>
                  </span>

                  <time dateTime={post.data} className="text-xs text-muted tabular">
                    {formatDate(post.data, 'short')}
                  </time>
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

          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
              <p>
                O CIPASO estudava, identificava e classificava os fenômenos exteriorizados através da
                paranormalidade — a capacidade de percepção hiperestésica e de conhecimento extrassensorial.
              </p>
              <p>
                Fundado em 1989, desenvolveu métodos de cura, orientação e aconselhamento apoiados em observação
                sistemática. Este memorial preserva esse material e o mantém acessível a pesquisadores, alunos e
                familiares.
              </p>
              <figure className="sheet p-6">
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

            <Reveal delay={0.08}>
              <dl className="divide-y divide-rule border-y border-rule">
                {values.map(value => (
                  <div key={value.term} className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                    <dt className="eyebrow pt-1">{value.term}</dt>
                    <dd className="text-ink">{value.definition}</dd>
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
