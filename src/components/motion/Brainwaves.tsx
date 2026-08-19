import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface BrainwavesProps {
  className?: string
  /** Exibe os rótulos beta/alfa/teta/delta ao lado das ondas. */
  labeled?: boolean
}

interface WaveSpec {
  label: string
  hz: string
  /** Ciclos dentro do período de 220px (frequência visual da onda). */
  cycles: number
  amplitude: number
  opacity: number
}

/**
 * Assinatura visual do site: os quatro níveis cerebrais da metodologia
 * (beta, alfa, teta e delta) desenhados como traçado de eletroencefalograma.
 * O padrão tem período de 220px e o CSS o desloca exatamente um período,
 * fazendo o traçado correr sem emenda visível.
 */
const WAVES: WaveSpec[] = [
  { label: 'beta', hz: '14–30 Hz', cycles: 12, amplitude: 7, opacity: 0.9 },
  { label: 'alfa', hz: '8–13 Hz', cycles: 7, amplitude: 11, opacity: 0.7 },
  { label: 'teta', hz: '4–7 Hz', cycles: 4, amplitude: 15, opacity: 0.5 },
  { label: 'delta', hz: '0,5–3 Hz', cycles: 2, amplitude: 19, opacity: 0.35 }
]

const PERIOD = 220
const ROW_HEIGHT = 52

function wavePath(cycles: number, amplitude: number, baseline: number): string {
  const points: string[] = []
  const steps = 480
  // Dois períodos de largura: o excedente cobre o deslocamento da animação.
  const width = PERIOD * 2

  for (let index = 0; index <= steps; index++) {
    const x = (index / steps) * width
    const y = baseline + Math.sin((x / PERIOD) * cycles * Math.PI * 2) * amplitude
    points.push(`${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
  }

  return points.join(' ')
}

export function Brainwaves({ className, labeled = false }: BrainwavesProps) {
  const paths = useMemo(
    () => WAVES.map((wave, index) => wavePath(wave.cycles, wave.amplitude, ROW_HEIGHT * index + ROW_HEIGHT / 2)),
    []
  )

  const height = ROW_HEIGHT * WAVES.length

  return (
    <div className={cn('pointer-events-none select-none', className)} aria-hidden="true">
      <div className={cn('grid h-full items-stretch', labeled && 'grid-cols-[1fr_auto] gap-6')}>
        <div className="h-full overflow-hidden">
          <svg
            viewBox={`0 0 ${PERIOD * 2} ${height}`}
            preserveAspectRatio="none"
            className="h-full w-[200%] max-w-none"
          >
            {paths.map((d, index) => (
              <g key={WAVES[index].label} className="wave-drift" style={{ animationDelay: `${index * -3.5}s` }}>
                <path
                  d={d}
                  className="wave-path"
                  vectorEffect="non-scaling-stroke"
                  style={{ opacity: WAVES[index].opacity }}
                />
              </g>
            ))}
          </svg>
        </div>

        {labeled && (
          <div className="hidden flex-col justify-around text-right sm:flex">
            {WAVES.map(wave => (
              <p key={wave.label} className="leading-tight">
                <span className="eyebrow block text-brand-ink">{wave.label}</span>
                <span className="text-[0.625rem] text-faint tabular">{wave.hz}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
