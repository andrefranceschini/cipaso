import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Maximize2 } from 'lucide-react'
import valterPhoto from '@/assets/png/vaf/VAF-1.jpg'
import { Reveal } from '@/components/motion/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Modal } from '@/components/common/Modal'

const tools = [
  'Relaxamento e meditação guiada',
  'Visualização criativa e reprogramação mental',
  'Técnicas de autocura e autoconhecimento',
  'Vivência prática das Leis da Mente',
  'Investigação de fenômenos PSI'
]

export function AboutValter() {
  const [isPortraitOpen, setIsPortraitOpen] = useState(false)

  return (
    <section className="container-editorial py-20" aria-labelledby="valter">
      <Reveal>
        <SectionHeading
          index="02"
          eyebrow="In memoriam"
          title={<span id="valter">Prof. Valter Álfredo Franceschini</span>}
          description="Escritor, conferencista, parapsicólogo e professor. Idealizador do CIPASO e autor da metodologia que o memorial preserva."
        />
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
        <Reveal>
          <figure className="relative mx-auto max-w-sm lg:mx-0">
            {/* Moldura de fundo deslocada, como retrato apoiado em um painel */}
            <span
              aria-hidden="true"
              className="absolute -left-3 -top-3 h-full w-full border border-brand-dim/40"
            />

            <div className="sheet relative -rotate-1 p-3 transition-transform duration-500 hover:rotate-0">
              <button
                type="button"
                onClick={() => setIsPortraitOpen(true)}
                aria-label="Ampliar retrato do Prof. Valter Franceschini"
                className="group relative block w-full cursor-zoom-in overflow-hidden"
              >
                <img
                  src={valterPhoto}
                  alt="Retrato do Prof. Valter Álfredo Franceschini"
                  width={384}
                  height={512}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand/15 via-transparent to-transparent mix-blend-screen"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-sheet border border-rule-strong bg-paper/80 text-muted opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <Maximize2 className="h-4 w-4" />
                </span>
              </button>

              <figcaption className="px-2 pb-1 pt-4">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="eyebrow">Nascimento</dt>
                    <dd className="mt-1 text-sm text-ink tabular">02.08.1940</dd>
                    <dd className="text-xs text-faint">Campinas, SP</dd>
                  </div>
                  <div className="border-l border-rule pl-4">
                    <dt className="eyebrow">Falecimento</dt>
                    <dd className="mt-1 text-sm text-ink tabular">18.02.2016</dd>
                    <dd className="text-xs text-faint">Sorocaba, SP · 75 anos</dd>
                  </div>
                </dl>
              </figcaption>
            </div>
          </figure>

          <Modal
            isOpen={isPortraitOpen}
            onClose={() => setIsPortraitOpen(false)}
            title="Prof. Valter Álfredo Franceschini"
            description="Campinas, 02.08.1940 — Sorocaba, 18.02.2016"
          >
            <img
              src={valterPhoto}
              alt="Retrato do Prof. Valter Álfredo Franceschini"
              className="mx-auto max-h-[72vh] w-auto"
            />
          </Modal>
        </Reveal>

        <Reveal delay={0.08} className="space-y-6">
          <p className="text-lg leading-relaxed text-ink measure">
            Com mais de 55 anos de magistério, o Prof. Valter uniu <strong>investigação científica</strong> e{' '}
            <strong>desenvolvimento humano</strong> em um método próprio de trabalho com a mente — aplicado em
            atendimentos, cursos e nas colunas que publicou na imprensa de Sorocaba.
          </p>

          <blockquote className="border-l-2 border-brand pl-5 font-display text-xl leading-snug text-ink">
            “O seu corpo reage de acordo com como age a sua mente.”
          </blockquote>

          <p className="text-muted measure">
            Sua metodologia se apoia nas cinco ferramentas mentais, trabalhadas nos níveis cerebrais beta, alfa,
            teta e delta:
          </p>

          <ol className="flex flex-wrap gap-2.5">
            {tools.map((tool, index) => (
              <li
                key={tool}
                className="sheet flex items-center gap-3 px-4 py-2.5 text-sm text-ink"
              >
                <span className="font-display text-lg leading-none text-brand-ink tabular">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {tool}
              </li>
            ))}
          </ol>

          <p>
            <Link to="/sobre" className="link-ink text-sm">
              Ler a história completa do CIPASO
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
