import { useState } from 'react'
import { TextCard } from '@/components/cards/TextCard'
import {
  RateStackedBarChart,
  type RateSeries,
} from '@/components/charts/RateStackedBarChart'
import { Card } from '@/components/ui/Card'
import './RateAnalysisSlide.css'

interface RateChart {
  id: string
  label: string
  unit?: string
  data?: { labels: string[]; series: RateSeries[] }
}

interface RateAnalysisSlideProps {
  eyebrow: string
  title: string
  description?: string
  charts: RateChart[]
}

export function RateAnalysisSlide({ eyebrow, title, description, charts }: RateAnalysisSlideProps) {
  const [activeChart, setActiveChart] = useState(0)
  const current = charts[activeChart]
  const activeTitle = current?.label ?? title

  return (
    <div className="rate-analysis">
      <div className="rate-analysis__text">
        <TextCard
          eyebrow={eyebrow}
          title={activeTitle}
          description={description}
        />
      </div>
      <div className="rate-analysis__gallery">
        <Card padding="md" className="rate-analysis__card">
          <div className="rate-analysis__nav">
            {charts.map((c, i) => (
              <button
                key={c.id}
                className={`rate-analysis__tab ${i === activeChart ? 'rate-analysis__tab--active' : ''}`}
                onClick={() => setActiveChart(i)}
              >
                {c.label}
              </button>
            ))}
          </div>
          {current?.data ? (
            <RateStackedBarChart
              key={current.id}
              title={current.label}
              labels={current.data.labels}
              series={current.data.series}
              unit={current.unit ?? '%'}
            />
          ) : null}
        </Card>
      </div>
    </div>
  )
}
