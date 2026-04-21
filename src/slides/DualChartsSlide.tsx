import { TextCard } from '@/components/cards/TextCard'
import { ChartPlaceholder, type ChartType } from '@/components/cards/ChartPlaceholder'
import './DualChartsSlide.css'

interface DualChartsSlideProps {
  eyebrow?: string
  title: string
  description?: string
  highlights?: string[]
  chart1: { title: string; chartType: ChartType; unit?: string }
  chart2: { title: string; chartType: ChartType; unit?: string }
}

export function DualChartsSlide({
  eyebrow,
  title,
  description,
  highlights,
  chart1,
  chart2,
}: DualChartsSlideProps) {
  return (
    <div className="dual-charts">
      <div className="dual-charts__top">
        <div className="dual-charts__text">
          <TextCard
            eyebrow={eyebrow}
            title={title}
            description={description}
            highlights={highlights}
          />
        </div>
        <ChartPlaceholder
          title={chart2.title}
          chartType={chart2.chartType}
          unit={chart2.unit}
          className="dual-charts__chart dual-charts__chart--secondary"
        />
      </div>
      <ChartPlaceholder
        title={chart1.title}
        chartType={chart1.chartType}
        unit={chart1.unit}
        className="dual-charts__chart dual-charts__chart--primary"
      />
    </div>
  )
}
