import { getQuoteForDay } from '@/data/quotes'

export function DailyQuote() {
  const quote = getQuoteForDay()

  return (
    <figure className="sheet paper-grain flex h-full flex-col justify-between p-7">
      <figcaption className="eyebrow">Citação do dia</figcaption>

      <blockquote className="mt-6 font-display text-2xl leading-[1.25] text-ink sm:text-[1.75rem]">
        <span aria-hidden="true" className="text-brand">
          “
        </span>
        {quote.content}
        <span aria-hidden="true" className="text-brand">
          ”
        </span>
      </blockquote>

      <p className="mt-6 border-t border-rule pt-4 text-sm text-muted">{quote.author}</p>
    </figure>
  )
}
