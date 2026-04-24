import { useMemo, useState } from 'react'
import * as d3 from 'd3'
import { Card } from '@/components/ui/Card'
import './LiquidityActivitySlide.css'

// ─────────── Posiciones table ───────────

interface PositionRow {
  ticker: string
  region: string
  sector: string
  rating: string
  position: number
  pct: string
  isTotal?: boolean
}

const POSITIONS: PositionRow[] = [
  { ticker: 'IBRD', region: 'Multilateral', sector: 'Multilateral', rating: 'AAA', position: 110, pct: '8%' },
  { ticker: 'KFW', region: 'Europa', sector: 'Soberano', rating: 'AAA', position: 104, pct: '7%' },
  { ticker: 'AFDB', region: 'Multilateral', sector: 'Multilateral', rating: 'AAA', position: 83, pct: '6%' },
  { ticker: 'BLX', region: 'LATAM', sector: 'Financiero', rating: 'BBB', position: 72, pct: '5%' },
  { ticker: 'ZUERCHER', region: 'Europa', sector: 'Financiero', rating: 'AAA', position: 70, pct: '5%' },
  { ticker: 'Total', region: '—', sector: '—', rating: '—', position: 439, pct: '32%', isTotal: true },
]

const nfPos = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 })

function PositionsTable() {
  const [hover, setHover] = useState<{ col: string; ticker: string } | null>(null)

  return (
    <Card padding="none" className="liq-inst__table-card">
      <div className="liq-inst__card-header">
        <span className="text-card__eyebrow">Cartera de liquidez</span>
        <h2 className="text-card__title">Posiciones de liquidez por Instrumentos</h2>
      </div>
      <div className="liq-inst__table-body" onMouseLeave={() => setHover(null)}>
        <table className="liq-inst__table">
          <thead>
            <tr>
              <th className="liq-inst__th liq-inst__th--metric">Ticker</th>
              <th className="liq-inst__th">Región</th>
              <th className="liq-inst__th">Sector</th>
              <th className="liq-inst__th">Calificación</th>
              <th className="liq-inst__th">Posición (USD MM Nominal)</th>
              <th className="liq-inst__th">% Liquidez</th>
            </tr>
          </thead>
          <tbody>
            {POSITIONS.map((row) => (
              <tr
                key={row.ticker}
                className={`liq-inst__tr ${row.isTotal ? 'liq-inst__tr--total' : ''} ${
                  hover?.ticker === row.ticker ? 'liq-inst__tr--active' : ''
                }`}
              >
                <td className="liq-inst__td liq-inst__td--metric">{row.ticker}</td>
                <td
                  className="liq-inst__td"
                  onMouseEnter={() => setHover({ col: 'Región', ticker: row.ticker })}
                >
                  {row.region}
                </td>
                <td
                  className="liq-inst__td"
                  onMouseEnter={() => setHover({ col: 'Sector', ticker: row.ticker })}
                >
                  {row.sector}
                </td>
                <td
                  className="liq-inst__td"
                  onMouseEnter={() => setHover({ col: 'Calificación', ticker: row.ticker })}
                >
                  {row.rating}
                </td>
                <td
                  className="liq-inst__td"
                  onMouseEnter={() => setHover({ col: 'Posición', ticker: row.ticker })}
                >
                  {nfPos.format(row.position)}
                </td>
                <td
                  className="liq-inst__td"
                  onMouseEnter={() => setHover({ col: '% Liquidez', ticker: row.ticker })}
                >
                  {row.pct}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ─────────── Donut chart ───────────

interface DonutDatum {
  id: string
  label: string
  value: number
  color: string
}

interface DonutProps {
  data: DonutDatum[]
  size: number
}

function Donut({ data, size }: DonutProps) {
  const [hover, setHover] = useState<string | null>(null)
  const r = size / 2
  const innerR = r * 0.62

  const pie = useMemo(
    () =>
      d3
        .pie<DonutDatum>()
        .value((d) => d.value)
        .padAngle(0.012)
        .sort(null)(data),
    [data],
  )
  const arc = useMemo(
    () =>
      d3
        .arc<d3.PieArcDatum<DonutDatum>>()
        .innerRadius(innerR)
        .outerRadius(r)
        .cornerRadius(2),
    [innerR, r],
  )

  const hovered = hover ? data.find((d) => d.id === hover) : null

  return (
    <div
      className="liq-donut"
      onMouseLeave={() => setHover(null)}
      style={{ width: size, height: size }}
    >
      {hovered && (
        <div className="liq-donut__tooltip" role="status" aria-live="polite">
          <span className="liq-donut__tooltip-head">
            <span
              className="liq-donut__tooltip-swatch"
              style={{ background: hovered.color }}
            />
            {hovered.label}
          </span>
          <span className="liq-donut__tooltip-value">{hovered.value}%</span>
        </div>
      )}
      <svg
        viewBox={`${-r} ${-r} ${size} ${size}`}
        className="liq-donut__svg"
        width={size}
        height={size}
      >
        {pie.map((slice) => {
          const d = arc(slice) ?? ''
          const isHover = hover === slice.data.id
          const faded = hover !== null && !isHover
          return (
            <path
              key={slice.data.id}
              className="liq-donut__slice"
              d={d}
              fill={slice.data.color}
              opacity={faded ? 0.15 : 0.82}
              onMouseEnter={() => setHover(slice.data.id)}
              style={{ cursor: 'pointer' }}
            />
          )
        })}
        {pie.map((slice) => {
          if (slice.data.value < 6) return null
          const [cx, cy] = arc.centroid(slice)
          return (
            <text
              key={`t-${slice.data.id}`}
              x={cx}
              y={cy}
              textAnchor="middle"
              dy="0.32em"
              className="liq-donut__label"
            >
              {slice.data.value}%
            </text>
          )
        })}
      </svg>
    </div>
  )
}

// ─────────── Data palettes & sets ───────────

const PALETTE_SECTOR = {
  soberano: '#1d3557',
  multilateral: '#457b9d',
  financiero: '#e63946',
}

const PALETTE_REGION = {
  europa: '#1d3557',
  asia: '#457b9d',
  usa: '#a8dadc',
  latam: '#fcbf49',
  multilateral: '#e63946',
}

const PALETTE_RATING = {
  aaa: '#1d3557',
  aa: '#457b9d',
  a: '#f77f00',
  bbb: '#e63946',
}

const SECTOR_DATA: DonutDatum[] = [
  { id: 'soberano', label: 'Soberano', value: 46, color: PALETTE_SECTOR.soberano },
  { id: 'multilateral', label: 'Multilateral', value: 42, color: PALETTE_SECTOR.multilateral },
  { id: 'financiero', label: 'Financiero', value: 11, color: PALETTE_SECTOR.financiero },
]

const REGION_DATA: DonutDatum[] = [
  { id: 'multilateral', label: 'Multilateral', value: 42, color: PALETTE_REGION.multilateral },
  { id: 'europa', label: 'Europa', value: 32, color: PALETTE_REGION.europa },
  { id: 'usa', label: 'USA & Canadá', value: 11, color: PALETTE_REGION.usa },
  { id: 'asia', label: 'Asia', value: 9, color: PALETTE_REGION.asia },
  { id: 'latam', label: 'LATAM', value: 5, color: PALETTE_REGION.latam },
]

const RATING_DATA: DonutDatum[] = [
  { id: 'aaa', label: 'AAA', value: 55, color: PALETTE_RATING.aaa },
  { id: 'aa', label: 'AA+ / AA / AA-', value: 29, color: PALETTE_RATING.aa },
  { id: 'a', label: 'A+ / A / A-', value: 11, color: PALETTE_RATING.a },
  { id: 'bbb', label: 'BBB+ / BBB / BB-', value: 5, color: PALETTE_RATING.bbb },
]

// ─────────── Donut card ───────────

interface DonutCardProps {
  title: string
  data: DonutDatum[]
  size?: number
}

function DonutCard({ title, data, size = 140 }: DonutCardProps) {
  return (
    <Card padding="md" className="liq-inst__chart-card">
      <div className="liq-inst__chart-header">
        <span className="liq-inst__chart-title">{title}</span>
      </div>
      <div className="liq-inst__chart-body">
        <Donut data={data} size={size} />
        <div className="liq-inst__legend">
          {data.map((d) => (
            <div key={d.id} className="liq-inst__legend-item">
              <span
                className="liq-inst__legend-swatch"
                style={{ background: d.color }}
              />
              <span>{d.label}</span>
              <strong>{d.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ─────────── Slide ───────────

export function LiquidityActivitySlide() {
  return (
    <div className="liq-inst">
      <div className="liq-inst__table-wrap">
        <PositionsTable />
      </div>
      <div className="liq-inst__charts">
        <div className="liq-inst__charts-left">
          <DonutCard title="Sector" data={SECTOR_DATA} />
          <DonutCard title="Región" data={REGION_DATA} />
        </div>
        <div className="liq-inst__charts-right">
          <DonutCard title="Calificación" data={RATING_DATA} size={200} />
        </div>
      </div>
    </div>
  )
}
