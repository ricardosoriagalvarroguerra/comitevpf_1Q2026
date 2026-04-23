import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { TextCard } from '@/components/cards/TextCard'
import {
  RateStackedBarChart,
  type RateSeries,
} from '@/components/charts/RateStackedBarChart'
import { Card } from '@/components/ui/Card'
import { MultiSelect } from '@/components/ui/MultiSelect'
import './RateAnalysisSlide.css'

interface RateChart {
  id: string
  label: string
  unit?: string
  description?: ReactNode
  data?: { labels: string[]; series: RateSeries[] }
}

interface RateAnalysisSlideProps {
  eyebrow: string
  title: string
  description?: ReactNode
  charts: RateChart[]
}

export function RateAnalysisSlide({ eyebrow, title, description, charts }: RateAnalysisSlideProps) {
  const [activeChart, setActiveChart] = useState(0)
  const current = charts[activeChart]
  const activeTitle = current?.label ?? title
  const activeDescription = current?.description ?? description

  const seriesOptions = useMemo(
    () =>
      (current?.data?.series ?? []).map((s) => ({
        value: s.name,
        label: s.name,
        color: s.color,
      })),
    [current],
  )

  const [selectedSeries, setSelectedSeries] = useState<Set<string>>(
    () => new Set(seriesOptions.map((o) => o.value)),
  )

  useEffect(() => {
    setSelectedSeries(new Set(seriesOptions.map((o) => o.value)))
  }, [seriesOptions])

  const filteredSeries = useMemo(
    () => (current?.data?.series ?? []).filter((s) => selectedSeries.has(s.name)),
    [current, selectedSeries],
  )

  return (
    <div className="rate-analysis">
      <div className="rate-analysis__text">
        <TextCard
          eyebrow={eyebrow}
          title={activeTitle}
          description={activeDescription}
        />
      </div>
      <div className="rate-analysis__gallery">
        <Card padding="md" className="rate-analysis__card">
          <div className="rate-analysis__nav">
            <div className="rate-analysis__tabs">
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
            {seriesOptions.length > 0 && (
              <div className="rate-analysis__filter">
                <MultiSelect
                  label="Categorías"
                  options={seriesOptions}
                  selected={selectedSeries}
                  onChange={setSelectedSeries}
                />
              </div>
            )}
          </div>
          {current?.data ? (
            <RateStackedBarChart
              key={current.id}
              title={current.label}
              labels={current.data.labels}
              series={filteredSeries}
              unit={current.unit ?? '%'}
            />
          ) : null}
        </Card>
      </div>
    </div>
  )
}
