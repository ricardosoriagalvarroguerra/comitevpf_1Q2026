import { useState } from 'react'
import { TextCard } from '@/components/cards/TextCard'
import { DonutPlaceholder } from '@/components/cards/DonutPlaceholder'
import { ChartPlaceholder } from '@/components/cards/ChartPlaceholder'
import { TableCard } from '@/components/cards/TableCard'
import { Card } from '@/components/ui/Card'
import './InvestmentPortfolioSlide.css'

interface InvestmentPortfolioSlideProps {
  eyebrow: string
  title: string
  description?: string
  highlights?: string[]
  donutData: Array<{ id: string; label: string; value: number; color: string }>
  tableTitle: string
  tableColumns: Array<{ key: string; label: string; align?: 'left' | 'center' | 'right' }>
  tableRows: Array<Record<string, string | number | boolean | undefined>>
}

export function InvestmentPortfolioSlide({
  eyebrow,
  title,
  description,
  highlights,
  donutData,
  tableTitle,
  tableColumns,
  tableRows,
}: InvestmentPortfolioSlideProps) {
  const [galleryIndex, setGalleryIndex] = useState(0)
  const items = ['Clases de activo', 'Perfil de vencimiento', 'Rendimiento histórico']

  return (
    <div className="inv-portfolio">
      <div className="inv-portfolio__text">
        <TextCard
          eyebrow={eyebrow}
          title={title}
          description={description}
          highlights={highlights}
        />
      </div>
      <div className="inv-portfolio__gallery">
        <Card padding="md" className="inv-portfolio__card">
          <div className="inv-portfolio__gallery-nav">
            {items.map((item, i) => (
              <button
                key={item}
                className={`inv-portfolio__dot ${i === galleryIndex ? 'inv-portfolio__dot--active' : ''}`}
                onClick={() => setGalleryIndex(i)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="inv-portfolio__gallery-content">
            {galleryIndex === 0 && (
              <DonutPlaceholder data={donutData} size="md" showLegend />
            )}
            {galleryIndex === 1 && (
              <ChartPlaceholder
                title="Perfil de vencimiento"
                chartType="bar"
                unit="USD MM"
              />
            )}
            {galleryIndex === 2 && (
              <TableCard
                title={tableTitle}
                columns={tableColumns}
                rows={tableRows}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
