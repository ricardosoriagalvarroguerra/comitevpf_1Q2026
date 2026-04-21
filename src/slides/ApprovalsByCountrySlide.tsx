import { useState } from 'react'
import { TextCard } from '@/components/cards/TextCard'
import { Card } from '@/components/ui/Card'
import {
  ApprovalsCountryChart,
  type ApprovalPoint,
} from '@/components/charts/ApprovalsCountryChart'
import './ApprovalsByCountrySlide.css'

const fmtN = (n: number) =>
  n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })

type Country = 'ARG' | 'BOL' | 'BRA' | 'PAR' | 'URU'

const COUNTRIES: Country[] = ['ARG', 'BOL', 'BRA', 'PAR', 'URU']

function buildGeneral(data: Record<Country, ApprovalPoint[]>): ApprovalPoint[] {
  const periods = data.ARG.map((p) => p.period)
  return periods.map((period, i) => {
    let aprobaciones = 0
    let cancelaciones = 0
    let netas = 0
    for (const c of COUNTRIES) {
      const row = data[c][i]
      aprobaciones += row.aprobaciones
      cancelaciones += row.cancelaciones
      netas += row.netas
    }
    return { period, aprobaciones, cancelaciones, netas }
  })
}

const DATA: Record<Country, ApprovalPoint[]> = {
  ARG: [
    { period: '2014', aprobaciones: 56.523, cancelaciones: 0, netas: 56.523 },
    { period: '2015', aprobaciones: 70, cancelaciones: 0, netas: 70 },
    { period: '2016', aprobaciones: 142.5, cancelaciones: -0.58, netas: 141.92 },
    { period: '2017', aprobaciones: 92.2, cancelaciones: -29.69, netas: 62.51 },
    { period: '2018', aprobaciones: 105.064, cancelaciones: -0.016, netas: 105.048 },
    { period: '2019', aprobaciones: 150, cancelaciones: -54.868, netas: 95.132 },
    { period: '2020', aprobaciones: 147, cancelaciones: -40.303, netas: 106.697 },
    { period: '2021', aprobaciones: 121.3, cancelaciones: -7.377, netas: 113.923 },
    { period: '2022', aprobaciones: 177, cancelaciones: -3.999, netas: 173.001 },
    { period: '2023', aprobaciones: 0, cancelaciones: 0, netas: 0 },
    { period: '2024', aprobaciones: 200, cancelaciones: -85.626, netas: 114.374 },
    { period: '2025', aprobaciones: 95, cancelaciones: -195.736, netas: -100.736 },
    { period: 'Q1-26', aprobaciones: 0, cancelaciones: -14.285515, netas: -14.285515 },
  ],
  BOL: [
    { period: '2014', aprobaciones: 59.931, cancelaciones: 0, netas: 59.931 },
    { period: '2015', aprobaciones: 55, cancelaciones: 0, netas: 55 },
    { period: '2016', aprobaciones: 60, cancelaciones: 0, netas: 60 },
    { period: '2017', aprobaciones: 50, cancelaciones: 0, netas: 50 },
    { period: '2018', aprobaciones: 65, cancelaciones: 0, netas: 65 },
    { period: '2019', aprobaciones: 41.943, cancelaciones: -0.03, netas: 41.913 },
    { period: '2020', aprobaciones: 35, cancelaciones: 0, netas: 35 },
    { period: '2021', aprobaciones: 100, cancelaciones: -0.63, netas: 99.37 },
    { period: '2022', aprobaciones: 40, cancelaciones: -4.776, netas: 35.224 },
    { period: '2023', aprobaciones: 113.296, cancelaciones: 0, netas: 113.296 },
    { period: '2024', aprobaciones: 75, cancelaciones: 0, netas: 75 },
    { period: '2025', aprobaciones: 17.8, cancelaciones: -1.749, netas: 16.051 },
    { period: 'Q1-26', aprobaciones: 0, cancelaciones: 0, netas: 0 },
  ],
  BRA: [
    { period: '2014', aprobaciones: 40, cancelaciones: 0, netas: 40 },
    { period: '2015', aprobaciones: 0, cancelaciones: 0, netas: 0 },
    { period: '2016', aprobaciones: 0, cancelaciones: -0.003, netas: -0.003 },
    { period: '2017', aprobaciones: 141.95, cancelaciones: -0.066, netas: 141.884 },
    { period: '2018', aprobaciones: 62.5, cancelaciones: -50, netas: 12.5 },
    { period: '2019', aprobaciones: 68.597, cancelaciones: -34.7, netas: 33.897 },
    { period: '2020', aprobaciones: 112.88, cancelaciones: 0, netas: 112.88 },
    { period: '2021', aprobaciones: 132.13, cancelaciones: -20.497, netas: 111.633 },
    { period: '2022', aprobaciones: 194, cancelaciones: -46.88, netas: 147.12 },
    { period: '2023', aprobaciones: 211, cancelaciones: -11.13, netas: 199.87 },
    { period: '2024', aprobaciones: 167, cancelaciones: 0, netas: 167 },
    { period: '2025', aprobaciones: 224, cancelaciones: -35.166, netas: 188.834 },
    { period: 'Q1-26', aprobaciones: 0, cancelaciones: 0, netas: 0 },
  ],
  PAR: [
    { period: '2014', aprobaciones: 0, cancelaciones: 0, netas: 0 },
    { period: '2015', aprobaciones: 93.5, cancelaciones: 0, netas: 93.5 },
    { period: '2016', aprobaciones: 85.661, cancelaciones: -0.22, netas: 85.441 },
    { period: '2017', aprobaciones: 42.857, cancelaciones: 0, netas: 42.857 },
    { period: '2018', aprobaciones: 82, cancelaciones: 0, netas: 82 },
    { period: '2019', aprobaciones: 200, cancelaciones: 0, netas: 200 },
    { period: '2020', aprobaciones: 134.246, cancelaciones: -0.124, netas: 134.122 },
    { period: '2021', aprobaciones: 0, cancelaciones: 0, netas: 0 },
    { period: '2022', aprobaciones: 45, cancelaciones: -12, netas: 33 },
    { period: '2023', aprobaciones: 0, cancelaciones: 0, netas: 0 },
    { period: '2024', aprobaciones: 0, cancelaciones: 0, netas: 0 },
    { period: '2025', aprobaciones: 0, cancelaciones: 0, netas: 0 },
    { period: 'Q1-26', aprobaciones: 0, cancelaciones: 0, netas: 0 },
  ],
  URU: [
    { period: '2014', aprobaciones: 70.5, cancelaciones: 0, netas: 70.5 },
    { period: '2015', aprobaciones: 65.5, cancelaciones: -40, netas: 25.5 },
    { period: '2016', aprobaciones: 27.5, cancelaciones: -1.83, netas: 25.67 },
    { period: '2017', aprobaciones: 0, cancelaciones: -1.83, netas: -1.83 },
    { period: '2018', aprobaciones: 110.535, cancelaciones: 0, netas: 110.535 },
    { period: '2019', aprobaciones: 0, cancelaciones: 0, netas: 0 },
    { period: '2020', aprobaciones: 36, cancelaciones: 0, netas: 36 },
    { period: '2021', aprobaciones: 0, cancelaciones: -6, netas: -6 },
    { period: '2022', aprobaciones: 0, cancelaciones: -1.152, netas: -1.152 },
    { period: '2023', aprobaciones: 210, cancelaciones: 0, netas: 210 },
    { period: '2024', aprobaciones: 247.96, cancelaciones: 0, netas: 247.96 },
    { period: '2025', aprobaciones: 0, cancelaciones: 0, netas: 0 },
    { period: 'Q1-26', aprobaciones: 0, cancelaciones: 0, netas: 0 },
  ],
}

interface Props {
  eyebrow?: string
  title?: string
  description?: string
}

export function ApprovalsByCountrySlide({
  eyebrow = '2 · CARTERA',
  title = 'Aprobaciones y Cancelaciones',
  description = 'Evolución por país 2014–Q1 2026 · USD Millones',
}: Props = {}) {
  const sharedDomain: [number, number] = (() => {
    let max = 0
    let min = 0
    for (const c of COUNTRIES) {
      for (const p of DATA[c]) {
        max = Math.max(max, p.aprobaciones, p.netas)
        min = Math.min(min, p.cancelaciones, p.netas)
      }
    }
    return [Math.min(0, min) * 1.08, Math.max(0, max) * 1.08]
  })()

  const [hover, setHover] = useState<{ source: string; point: ApprovalPoint } | null>(null)

  return (
    <div className="approvals-slide">
      <div className="approvals-slide__header">
        <TextCard eyebrow={eyebrow} title={title} description={description} />
        <div
          className={`approvals-slide__legend ${hover ? 'approvals-slide__legend--hover' : ''}`}
          role="status"
          aria-live="polite"
        >
          {hover ? (
            <span className="approvals-slide__legend-period">
              {hover.source} · {hover.point.period}
            </span>
          ) : null}
          <div className="approvals-slide__legend-item">
            <span
              className="approvals-slide__legend-swatch"
              style={{ background: '#c1121f' }}
            />
            <span>Aprobaciones</span>
            {hover && (
              <strong className="approvals-slide__legend-value">
                {fmtN(hover.point.aprobaciones)}
              </strong>
            )}
          </div>
          <div className="approvals-slide__legend-item">
            <span
              className="approvals-slide__legend-swatch"
              style={{ background: '#c4c6c9' }}
            />
            <span>Cancelaciones</span>
            {hover && (
              <strong className="approvals-slide__legend-value">
                {fmtN(hover.point.cancelaciones)}
              </strong>
            )}
          </div>
          <div className="approvals-slide__legend-item">
            <span className="approvals-slide__legend-line" />
            <span>Aprobaciones netas</span>
            {hover && (
              <strong className="approvals-slide__legend-value">
                {fmtN(hover.point.netas)}
              </strong>
            )}
          </div>
        </div>
      </div>
      <div className="approvals-slide__grid">
        {COUNTRIES.map((c) => (
          <Card key={c} padding="md" className="approvals-slide__card">
            <ApprovalsCountryChart
              title={c}
              data={DATA[c]}
              width={400}
              height={200}
              domainOverride={sharedDomain}
              onHoverChange={(p) =>
                setHover(p ? { source: c, point: p } : null)
              }
            />
          </Card>
        ))}
        <Card padding="md" className="approvals-slide__card">
          <ApprovalsCountryChart
            title="General"
            data={buildGeneral(DATA)}
            width={400}
            height={200}
            onHoverChange={(p) =>
              setHover(p ? { source: 'General', point: p } : null)
            }
          />
        </Card>
      </div>
    </div>
  )
}
