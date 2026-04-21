import { ChartPlaceholder, type ChartType, type ChartSeries } from '@/components/cards/ChartPlaceholder'
import { TextCard } from '@/components/cards/TextCard'
import './LineCardsSlide.css'

interface LineCard {
  id: string
  title: string
  subtitle?: string
  chartType?: ChartType
  data?: { labels?: string[]; series: ChartSeries[] }
}

interface LineCardsSlideProps {
  eyebrow?: string
  title: string
  description?: string
  cards: LineCard[]
  columns?: 2 | 3 | 4 | 6
  hideHeader?: boolean
}

export function LineCardsSlide({
  eyebrow,
  title,
  description,
  cards,
  columns = 3,
  hideHeader = false,
}: LineCardsSlideProps) {
  return (
    <div className="line-cards-slide">
      {!hideHeader && (
        <div className="line-cards-slide__header">
          <TextCard
            eyebrow={eyebrow}
            title={title}
            description={description}
            variant="default"
          />
        </div>
      )}
      <div
        className="line-cards-slide__grid"
        style={{ '--card-columns': columns } as React.CSSProperties}
      >
        {cards.map((card) => (
          <ChartPlaceholder
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            chartType={card.chartType ?? 'line'}
            data={card.data}
          />
        ))}
      </div>
    </div>
  )
}
