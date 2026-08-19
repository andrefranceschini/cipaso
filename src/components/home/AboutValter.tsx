import { Link } from 'react-router-dom'
import valterPhoto from '@/assets/png/vaf/VAF-1.jpg'
import { Reveal } from '@/components/motion/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const tools = [
  'Relaxamento e meditação guiada',
  'Visualização criativa e reprogramação mental',
  'Técnicas de autocura e autoconhecimento',
  'Vivência prática das Leis da Mente',
  'Investigação de fenômenos PSI'
]

export function AboutValter() {
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
          <figure>
            <img
              src={valterPhoto}
              alt="Retrato do Prof. Valter Álfredo Franceschini"
              width={384}
              height={512}
              loading="lazy"
              decoding="async"
              className="w-full border border-rule bg-sunken object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
            />
            <figcaption className="mt-3 flex justify-between border-t border-rule pt-3 text-xs text-muted tabular">
              <span>Campinas, 02.08.1940</span>
              <span>Sorocaba, 18.02.2016</span>
            </figcaption>
          </figure>
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

          <ol className="divide-y divide-rule border-y border-rule">
            {tools.map((tool, index) => (
              <li key={tool} className="flex gap-4 py-3">
                <span className="eyebrow tabular pt-1 text-brand-ink">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-ink">{tool}</span>
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
