import { ChartPlaceholder } from '@/components/cards/ChartPlaceholder'
import { Card } from '@/components/ui/Card'
import './CapitalAdequacySlide.css'

interface CapitalAdequacySlideProps {
  eyebrow?: string
  title: string
  description?: string
  policyHighlights?: string[]
  detailTitle?: string
  detailDescription?: string
}

export function CapitalAdequacySlide({
  eyebrow,
  title,
  description,
  policyHighlights,
  detailTitle,
  detailDescription,
}: CapitalAdequacySlideProps) {
  return (
    <div className="capital-adequacy">
      <div className="capital-adequacy__top">
        <div className="capital-adequacy__chart-main">
          <ChartPlaceholder
            title={title}
            subtitle={eyebrow}
            chartType="line"
            unit="%"
            height="full"
          />
        </div>
        <div className="capital-adequacy__policy">
          <Card padding="md" className="capital-adequacy__policy-card">
            <span className="capital-adequacy__policy-label">Política financiera</span>
            <p className="capital-adequacy__policy-text">{description}</p>
            {policyHighlights && (
              <ul className="capital-adequacy__policy-list">
                {policyHighlights.map((h, i) => (
                  <li key={i} className="capital-adequacy__policy-item">{h}</li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
      <div className="capital-adequacy__bottom">
        <div className="capital-adequacy__chart-detail">
          <ChartPlaceholder
            title={detailTitle ?? 'RAC S&P'}
            chartType="line"
            unit="%"
            height="full"
          />
        </div>
        <div className="capital-adequacy__detail-text">
          <Card padding="md" className="capital-adequacy__detail-card">
            <span className="capital-adequacy__detail-label">Detalle</span>
            <p className="capital-adequacy__detail-desc">
              {detailDescription ?? 'Niveles de adecuación del capital según metodología S&P y proyecciones.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
