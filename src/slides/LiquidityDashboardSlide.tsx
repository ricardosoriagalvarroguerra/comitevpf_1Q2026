import { ChartPlaceholder, type ChartType, type ChartSeries } from '@/components/cards/ChartPlaceholder'
import { Card } from '@/components/ui/Card'
import { TextCard } from '@/components/cards/TextCard'
import {
  LiquidityMonitoringChart,
  type LiquidityPoint,
} from '@/components/charts/LiquidityMonitoringChart'
import {
  LiquidityCoverageChart,
  type CoveragePoint,
} from '@/components/charts/LiquidityCoverageChart'
import {
  LiquidityCoverageSpChart,
  type SpCoveragePoint,
} from '@/components/charts/LiquidityCoverageSpChart'
import {
  AssetStructureChart,
  type AssetPoint,
} from '@/components/charts/AssetStructureChart'
import './LineCardsSlide.css'
import './LiquidityDashboardSlide.css'

interface LiquidityCard {
  id: string
  title: string
  subtitle?: string
  chartType?: ChartType
  data?: { labels?: string[]; series: ChartSeries[] }
}

interface LiquidityDashboardSlideProps {
  eyebrow?: string
  title: string
  description?: string
  cards: LiquidityCard[]
  columns?: 2 | 3 | 4 | 6
}

const COVERAGE_DATA: CoveragePoint[] = [
  { year: 2021, fonplata: 162 },
  { year: 2022, fonplata: 150 },
  { year: 2023, fonplata: 103 },
  { year: 2024, fonplata: 160 },
  { year: 2025, fonplata: 159 },
  { year: 2026, fonplata: 168, projected: true },
  { year: 2027, fonplata: 192, projected: true },
]

const SP_COVERAGE_DATA: SpCoveragePoint[] = [
  { year: 2021, fonplata: 1.5 },
  { year: 2022, fonplata: 1.0 },
  { year: 2023, fonplata: 1.0 },
  { year: 2024, fonplata: 1.3 },
  { year: 2025, fonplata: 1.6 },
  { year: 2026, fonplata: 1.63, projected: true },
  { year: 2027, fonplata: 1.60, projected: true },
]

const ASSET_STRUCTURE_DATA: AssetPoint[] = [
  { year: 2021, ratio: 29.3 },
  { year: 2022, ratio: 23.8 },
  { year: 2023, ratio: 27.7 },
  { year: 2024, ratio: 24.2 },
  { year: 2025, ratio: 35.6 },
  { year: 2026, ratio: 36.5, projected: true },
  { year: 2027, ratio: 36.4, projected: true },
]

const LIQUIDITY_DATA: LiquidityPoint[] = [
  { date: 'mar-26', minimaRequerida: 632.41, liquidez: 1387.89 },
  { date: 'abr-26', minimaRequerida: 674.09, liquidez: 1378.78 },
  { date: 'may-26', minimaRequerida: 682.41, liquidez: 1513.11 },
  { date: 'jun-26', minimaRequerida: 745.80, liquidez: 1590.64 },
  { date: 'jul-26', minimaRequerida: 745.37, liquidez: 1551.70 },
  { date: 'ago-26', minimaRequerida: 791.22, liquidez: 1555.01 },
  { date: 'sept-26', minimaRequerida: 569.85, liquidez: 1290.26 },
  { date: 'oct-26', minimaRequerida: 537.91, liquidez: 1253.11 },
  { date: 'nov-26', minimaRequerida: 750.12, liquidez: 1211.94 },
  { date: 'dic-26', minimaRequerida: 792.24, liquidez: 1191.62 },
  { date: 'ene-27', minimaRequerida: 816.78, liquidez: 1192.08 },
  { date: 'feb-27', minimaRequerida: 876.45, liquidez: 1186.50 },
  { date: 'mar-27', minimaRequerida: 944.07, liquidez: 1203.25 },
  { date: 'abr-27', minimaRequerida: 930.67, liquidez: 1151.41 },
  { date: 'may-27', minimaRequerida: 914.60, liquidez: 1079.32 },
  { date: 'jun-27', minimaRequerida: 860.51, liquidez: 995.35 },
  { date: 'jul-27', minimaRequerida: 873.25, liquidez: 958.74 },
  { date: 'ago-27', minimaRequerida: 882.55, liquidez: 918.10 },
  { date: 'sept-27', minimaRequerida: 915.06, liquidez: 876.63 },
  { date: 'oct-27', minimaRequerida: 889.28, liquidez: 907.98 },
  { date: 'nov-27', minimaRequerida: 719.12, liquidez: 656.50 },
  { date: 'dic-27', minimaRequerida: 874.60, liquidez: 592.48 },
]

export function LiquidityDashboardSlide({
  eyebrow,
  title,
  description,
  cards,
  columns = 2,
}: LiquidityDashboardSlideProps) {
  const [first, second, third, fourth, ...rest] = cards

  return (
    <div className="line-cards-slide">
      <div className="line-cards-slide__header">
        <TextCard
          eyebrow={eyebrow}
          title={title}
          description={description}
          variant="default"
        />
      </div>
      <div
        className="line-cards-slide__grid"
        style={{ '--card-columns': columns } as React.CSSProperties}
      >
        {first && (
          <Card padding="md" className="liq-dashboard__card">
            <header className="liq-dashboard__card-header">
              <span className="liq-dashboard__card-title">{first.title}</span>
            </header>
            <div className="liq-dashboard__card-body">
              <LiquidityMonitoringChart data={LIQUIDITY_DATA} unit="USD MM" />
            </div>
          </Card>
        )}
        {second && (
          <Card padding="md" className="liq-dashboard__card">
            <header className="liq-dashboard__card-header">
              <span className="liq-dashboard__card-title">{second.title}</span>
            </header>
            <div className="liq-dashboard__card-body">
              <LiquidityCoverageChart data={COVERAGE_DATA} />
            </div>
          </Card>
        )}
        {third && (
          <Card padding="md" className="liq-dashboard__card">
            <header className="liq-dashboard__card-header">
              <span className="liq-dashboard__card-title">{third.title}</span>
            </header>
            <div className="liq-dashboard__card-body">
              <LiquidityCoverageSpChart data={SP_COVERAGE_DATA} />
            </div>
          </Card>
        )}
        {fourth && (
          <Card padding="md" className="liq-dashboard__card">
            <header className="liq-dashboard__card-header">
              <span className="liq-dashboard__card-title">{fourth.title}</span>
            </header>
            <div className="liq-dashboard__card-body">
              <AssetStructureChart data={ASSET_STRUCTURE_DATA} />
            </div>
          </Card>
        )}
        {rest.map((card) => (
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
