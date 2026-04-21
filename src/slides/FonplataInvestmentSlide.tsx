import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import * as d3 from 'd3'
import { Card } from '@/components/ui/Card'
import { TextCard } from '@/components/cards/TextCard'
import './FonplataInvestmentSlide.css'

// ─────────── Métricas table data ───────────

const PERIODS = [
  'Sept-22', 'Dic-22', 'Mar-23', 'Jun-23', 'Sept-23', 'Dic-23',
  'Mar-24', 'Jun-24', 'Sept-24', 'Dic-24',
  'Mar-25', 'Jun-25', 'Sept-25', 'Dic-25',
  'Mar-26',
] as const

interface MetricRow {
  metric: string
  values: Array<string | number | null>
  isTotal?: boolean
}

const METRIC_ROWS: MetricRow[] = [
  {
    metric: 'AUM (MM)',
    values: [465, 536, 694, 671, 723, 494, 494, 718, 667, 743, 927, 1292, 1404, 1447, 1439.01],
    isTotal: true,
  },
  {
    metric: 'Rend. Mensual',
    values: ['0,20%', '0,34%', '0,56%', '0,26%', '0,23%', '0,67%', '0,44%', '0,46%', '0,63%', '0,44%', '0,37%', '0,55%', '0,27%', '0,27%', '-0,24%'],
  },
  {
    metric: 'Rend. YTD',
    values: ['1,00%', '1,08%', '1,13%', '1,96%', '3,06%', '4,64%', '1,06%', '2,61%', '4,56%', '5,22%', '1,24%', '2,49%', '3,62%', '4,72%', '0,57%'],
  },
  {
    metric: 'Rend. Benchmark YTD',
    values: ['0,99%', '1,00%', '1,27%', '1,88%', '3,08%', '4,89%', '1,02%', '2,28%', '4,16%', '5,03%', '1,22%', '2,33%', '3,45%', '4,55%', '0,73%'],
  },
  {
    metric: 'SOFR Promedio 12 m.',
    values: ['—', '1,64%', '—', '—', '—', '5,01%', '—', '—', '—', '5,15%', '—', '—', '—', '4,24%', '—'],
  },
  {
    metric: 'Calificación Promedio',
    values: ['AA+', 'AA+', 'AA', 'AA', 'AA', 'AA', 'AA', 'AA', 'AA', 'AA', 'AA', 'AA', 'AA', 'AA', 'AA+'],
  },
  {
    metric: 'Duración Portafolio',
    values: [0.35, 0.37, 0.41, 0.46, 0.54, 0.83, 0.83, 0.49, 0.98, 0.63, 0.52, 1.04, 1.40, 1.44, 1.40],
  },
  {
    metric: 'Duración Bonos',
    values: [0.01, 0.59, 0.59, 0.74, 1.07, 1.18, 1.16, 1.17, 1.42, 1.00, 1.06, 1.81, 1.90, 1.84, 1.69],
  },
  {
    metric: 'Duración Benchmark',
    values: [0.67, 0.66, 0.69, 0.69, 0.68, 0.64, 0.65, 0.66, 0.67, 0.61, 0.64, 0.68, 0.68, 0.65, 0.68],
  },
]

const nfAUM = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  useGrouping: true,
})
const nfDur = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatValue(v: string | number | null, metricIdx: number): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'string') return v
  if (metricIdx === 0) return nfAUM.format(v)
  return nfDur.format(v)
}

// ─────────── Interactive metrics table ───────────

interface HoverCell {
  period: string
  metric: string
  value: string
}

function parseNumeric(v: string | number | null): number | null {
  if (v === null || v === undefined) return null
  if (typeof v === 'number') return v
  if (v === '—') return null
  // percentage string: "1,00%" or "-0,24%"
  const pct = v.match(/^(-?[\d.,]+)\s*%$/)
  if (pct) return parseFloat(pct[1].replace(',', '.'))
  // plain number with comma
  const n = parseFloat(v.replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function metricIsNumeric(ri: number): boolean {
  // rows: 0 AUM, 1 Rend. Mensual, 2 Rend. YTD, 3 Rend. Benchmark YTD,
  // 4 SOFR, 5 Calificación (NOT numeric), 6/7/8 Duración
  return ri !== 5
}

function metricUnit(ri: number): string {
  if (ri === 0) return 'USD MM'
  if (ri >= 1 && ri <= 4) return '%'
  return ''
}

// ─────────── Metric line chart ───────────

interface MetricLineChartProps {
  metricIdx: number
}

function MetricLineChart({ metricIdx }: MetricLineChartProps) {
  const row = METRIC_ROWS[metricIdx]
  const unit = metricUnit(metricIdx)

  const points = useMemo(
    () =>
      row.values
        .map((v, i) => ({ period: PERIODS[i], value: parseNumeric(v) }))
        .filter(
          (p): p is { period: (typeof PERIODS)[number]; value: number } =>
            p.value !== null,
        ),
    [row],
  )

  const [hover, setHover] = useState<number | null>(null)

  const W = 1000
  const H = 260
  const margin = { top: 14, right: 20, bottom: 36, left: 60 }
  const innerW = W - margin.left - margin.right
  const innerH = H - margin.top - margin.bottom

  const x = d3
    .scalePoint<string>()
    .domain(points.map((p) => p.period))
    .range([0, innerW])
    .padding(0.5)

  const extent = d3.extent(points, (p) => p.value) as [number, number]
  const pad = (extent[1] - extent[0]) * 0.1 || Math.abs(extent[1]) * 0.1 || 1
  const y = d3
    .scaleLinear()
    .domain([extent[0] - pad, extent[1] + pad])
    .nice()
    .range([innerH, 0])

  const yTicks = y.ticks(5)

  const linePath = useMemo(() => {
    const gen = d3
      .line<typeof points[number]>()
      .x((d) => x(d.period) ?? 0)
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX)
    return gen(points) ?? ''
  }, [points, x, y])

  const fmtVal = (v: number) => {
    if (unit === '%') return `${v.toFixed(2).replace('.', ',')}%`
    if (unit === 'USD MM') return nfAUM.format(v)
    return nfDur.format(v)
  }

  const hoveredPt = hover !== null ? points[hover] : null

  return (
    <div className="metric-line" onMouseLeave={() => setHover(null)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="metric-line__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={0}
                x2={innerW}
                y1={y(t)}
                y2={y(t)}
                className="metric-line__grid"
              />
              <text
                x={-6}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className="metric-line__axis-label"
              >
                {fmtVal(t)}
              </text>
            </g>
          ))}
          <line
            x1={0}
            x2={innerW}
            y1={innerH}
            y2={innerH}
            className="metric-line__axis-line"
          />
          <path
            d={linePath}
            className="metric-line__path"
            fill="none"
          />
          {points.map((p, i) => {
            const cx = x(p.period) ?? 0
            const cy = y(p.value)
            const isHover = hover === i
            return (
              <g key={p.period}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHover ? 5 : 3.2}
                  className="metric-line__dot"
                />
                <rect
                  x={cx - 20}
                  y={0}
                  width={40}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            )
          })}
          {points.map((p) => (
            <text
              key={`xt-${p.period}`}
              x={x(p.period) ?? 0}
              y={innerH + 18}
              textAnchor="middle"
              className="metric-line__axis-label"
            >
              {p.period}
            </text>
          ))}
        </g>
      </svg>
      {hoveredPt && (
        <div className="metric-line__tooltip" role="status" aria-live="polite">
          <span className="metric-line__tooltip-period">{hoveredPt.period}</span>
          <strong>{fmtVal(hoveredPt.value)}</strong>
        </div>
      )}
    </div>
  )
}

function MetricsTable() {
  const [hover, setHover] = useState<HoverCell | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<number | null>(null)

  const selectedRow = selectedMetric !== null ? METRIC_ROWS[selectedMetric] : null

  return (
    <Card padding="none" className="fonplata-inv__metrics-card">
      <div className="fonplata-inv__metrics-header">
        {selectedRow ? (
          <>
            <button
              type="button"
              className="fonplata-inv__back-btn"
              onClick={() => setSelectedMetric(null)}
              aria-label="Volver a la tabla"
              title="Volver a la tabla"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3L5 8l5 5" />
              </svg>
              <span>Volver</span>
            </button>
            <h3 className="fonplata-inv__metrics-title">
              Evolución · <span className="fonplata-inv__metrics-title-accent">{selectedRow.metric}</span>
            </h3>
          </>
        ) : (
          <>
            <h3 className="fonplata-inv__metrics-title">Evolución de métricas</h3>
            <div
              className={`fonplata-inv__metrics-hover ${hover ? 'fonplata-inv__metrics-hover--on' : ''}`}
              aria-live="polite"
            >
              {hover ? (
                <>
                  <span className="fonplata-inv__metrics-hover-period">{hover.period}</span>
                  <span className="fonplata-inv__metrics-hover-sep">·</span>
                  <span className="fonplata-inv__metrics-hover-metric">{hover.metric}</span>
                  <span className="fonplata-inv__metrics-hover-sep">·</span>
                  <strong className="fonplata-inv__metrics-hover-value">{hover.value}</strong>
                </>
              ) : (
                <span className="fonplata-inv__metrics-hover-hint">
                  Pasa el cursor sobre una celda · Click en una métrica para ver evolución
                </span>
              )}
            </div>
          </>
        )}
      </div>
      {selectedRow ? (
        <div className="fonplata-inv__metrics-body fonplata-inv__metrics-body--chart">
          <MetricLineChart metricIdx={selectedMetric!} />
        </div>
      ) : (
        <div className="fonplata-inv__metrics-body" onMouseLeave={() => setHover(null)}>
          <table className="fonplata-inv__metrics-table">
            <thead>
              <tr>
                <th className="fonplata-inv__metrics-th fonplata-inv__metrics-th--metric">
                  Métrica
                </th>
                {PERIODS.map((p) => (
                  <th
                    key={p}
                    className={`fonplata-inv__metrics-th ${
                      hover?.period === p ? 'fonplata-inv__metrics-th--active' : ''
                    }`}
                  >
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRIC_ROWS.map((row, ri) => {
                const clickable = metricIsNumeric(ri)
                return (
                  <tr
                    key={row.metric}
                    className={`fonplata-inv__metrics-tr ${
                      row.isTotal ? 'fonplata-inv__metrics-tr--total' : ''
                    } ${hover?.metric === row.metric ? 'fonplata-inv__metrics-tr--active' : ''}`}
                  >
                    <td
                      className={`fonplata-inv__metrics-td fonplata-inv__metrics-td--metric ${
                        clickable ? 'fonplata-inv__metrics-td--clickable' : ''
                      }`}
                      onClick={clickable ? () => setSelectedMetric(ri) : undefined}
                      title={clickable ? 'Ver evolución' : undefined}
                    >
                      {row.metric}
                      {clickable && (
                        <svg
                          className="fonplata-inv__metrics-chart-icon"
                          viewBox="0 0 16 16"
                          width="11"
                          height="11"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M2 12l4-4 3 3 5-6" />
                        </svg>
                      )}
                    </td>
                    {row.values.map((v, i) => {
                      const period = PERIODS[i]
                      const formatted = formatValue(v, ri)
                      const isHover =
                        hover?.period === period && hover?.metric === row.metric
                      return (
                        <td
                          key={period}
                          className={`fonplata-inv__metrics-td ${
                            isHover ? 'fonplata-inv__metrics-td--hover' : ''
                          }`}
                          onMouseEnter={() =>
                            setHover({ period, metric: row.metric, value: formatted })
                          }
                        >
                          {formatted}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

// ─────────── Asset classes donut ───────────

const ASSET_CLASSES = [
  { id: 'bonos', label: 'Bonos', value: 76, color: '#1d3557' },
  { id: 'cds', label: "CD's", value: 16, color: '#457b9d' },
  { id: 'etfs', label: "ETF's", value: 3, color: '#a8dadc' },
  { id: 'ecps', label: "ECP's", value: 4, color: '#e63946' },
  { id: 'dep', label: 'Depósitos a la vista', value: 1, color: '#c4c6c9' },
]

const AUM_TOTAL_USD = 1_439_010_357
const AUM_TOTAL_MM = AUM_TOTAL_USD / 1_000_000

interface AssetDonutProps {
  size: number
}

function AssetDonut({ size }: AssetDonutProps) {
  const [hover, setHover] = useState<string | null>(null)
  const r = size / 2
  const innerR = r * 0.62

  const pie = useMemo(
    () =>
      d3
        .pie<typeof ASSET_CLASSES[number]>()
        .value((d) => d.value)
        .padAngle(0.012)
        .sort(null)(ASSET_CLASSES),
    [],
  )
  const arc = useMemo(
    () =>
      d3
        .arc<d3.PieArcDatum<typeof ASSET_CLASSES[number]>>()
        .innerRadius(innerR)
        .outerRadius(r)
        .cornerRadius(2),
    [innerR, r],
  )

  const hovered = hover ? ASSET_CLASSES.find((c) => c.id === hover) : null

  return (
    <div
      className="asset-donut"
      onMouseLeave={() => setHover(null)}
      style={{ width: size, height: size }}
    >
      {hovered && (
        <div className="asset-donut__tooltip" role="status" aria-live="polite">
          <span className="asset-donut__tooltip-head">
            <span
              className="asset-donut__tooltip-swatch"
              style={{ background: hovered.color }}
            />
            {hovered.label}
          </span>
          <span className="asset-donut__tooltip-value">{hovered.value}%</span>
        </div>
      )}
      <svg
        viewBox={`${-r} ${-r} ${size} ${size}`}
        className="asset-donut__svg"
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
              className="asset-donut__slice"
              d={d}
              fill={slice.data.color}
              opacity={faded ? 0.15 : 0.78}
              onMouseEnter={() => setHover(slice.data.id)}
              style={{ cursor: 'pointer' }}
            />
          )
        })}
        {pie.map((slice) => {
          if (slice.data.value < 4) return null
          const [cx, cy] = arc.centroid(slice)
          return (
            <text
              key={`t-${slice.data.id}`}
              x={cx}
              y={cy}
              textAnchor="middle"
              dy="0.32em"
              className="asset-donut__label"
            >
              {slice.data.value}%
            </text>
          )
        })}
        <text
          x={0}
          y={-6}
          textAnchor="middle"
          className="asset-donut__total-value"
          style={{ fontSize: Math.max(16, size * 0.11) }}
        >
          {nfAUM.format(AUM_TOTAL_MM)}
        </text>
        <text
          x={0}
          y={size * 0.09}
          textAnchor="middle"
          className="asset-donut__total-unit"
          style={{ fontSize: Math.max(10, size * 0.055) }}
        >
          USD MM
        </text>
      </svg>
    </div>
  )
}

// ─────────── Maturity bar chart ───────────

const MATURITY = [
  { period: '2Q26', value: 303.246626 },
  { period: '3Q26', value: 353.434 },
  { period: '4Q26', value: 0 },
  { period: '1Q27', value: 88.869 },
  { period: '2Q27', value: 53.737 },
  { period: '3Q27', value: 61.66 },
  { period: '4Q27', value: 70.5 },
  { period: '2028', value: 305.365 },
  { period: '2029', value: 126.275 },
  { period: '2030', value: 126.811 },
]

const COLOR_BAR = '#c1121f'

interface MaturityChartProps {
  width: number
  height: number
}

function MaturityChart({ width, height }: MaturityChartProps) {
  const [hover, setHover] = useState<number | null>(null)
  const margin = { top: 14, right: 14, bottom: 36, left: 56 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const x = useMemo(
    () =>
      d3
        .scaleBand<string>()
        .domain(MATURITY.map((d) => d.period))
        .range([0, innerW])
        .padding(0.22),
    [innerW],
  )

  const maxVal = d3.max(MATURITY, (d) => d.value) ?? 1
  const y = useMemo(
    () => d3.scaleLinear().domain([0, maxVal * 1.1]).nice().range([innerH, 0]),
    [maxVal, innerH],
  )

  const yTicks = y.ticks(5)
  const hovered = hover !== null ? MATURITY[hover] : null

  return (
    <div className="maturity-chart" onMouseLeave={() => setHover(null)}>
      {hovered && (
        <div className="maturity-chart__tooltip" role="status" aria-live="polite">
          <span className="maturity-chart__tooltip-period">{hovered.period}</span>
          <strong>
            {nfAUM.format(hovered.value)} USD MM
          </strong>
        </div>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="maturity-chart__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={0}
                x2={innerW}
                y1={y(t)}
                y2={y(t)}
                className="maturity-chart__grid"
              />
              <text
                x={-6}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className="maturity-chart__axis-label"
              >
                {nfAUM.format(t)}
              </text>
            </g>
          ))}
          <line
            x1={0}
            x2={innerW}
            y1={innerH}
            y2={innerH}
            className="maturity-chart__axis-line"
          />
          {MATURITY.map((d, i) => {
            if (d.value === 0) return null
            const isHover = hover === i
            const faded = hover !== null && !isHover
            return (
              <rect
                key={d.period}
                className="maturity-chart__bar"
                x={x(d.period) ?? 0}
                y={y(d.value)}
                width={x.bandwidth()}
                height={innerH - y(d.value)}
                fill={COLOR_BAR}
                opacity={faded ? 0.3 : 0.85}
              />
            )
          })}
          {MATURITY.map((d) => (
            <text
              key={`xt-${d.period}`}
              x={(x(d.period) ?? 0) + x.bandwidth() / 2}
              y={innerH + 16}
              textAnchor="middle"
              className="maturity-chart__axis-label"
            >
              {d.period}
            </text>
          ))}
          {MATURITY.map((d, i) => (
            <rect
              key={`hit-${d.period}`}
              x={x(d.period) ?? 0}
              y={0}
              width={x.bandwidth()}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

// ─────────── Fullscreen wrapper ───────────

function useFullscreen(): [boolean, (v: boolean | ((p: boolean) => boolean)) => void] {
  const [fullscreen, setFullscreen] = useState(false)
  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('is-chart-fullscreen')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      document.body.classList.remove('is-chart-fullscreen')
    }
  }, [fullscreen])
  return [fullscreen, setFullscreen]
}

function FsIcon({ fullscreen }: { fullscreen: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {fullscreen ? (
        <>
          <path d="M6 2v4H2" />
          <path d="M10 2v4h4" />
          <path d="M6 14v-4H2" />
          <path d="M10 14v-4h4" />
        </>
      ) : (
        <>
          <path d="M2 6V2h4" />
          <path d="M14 6V2h-4" />
          <path d="M2 10v4h4" />
          <path d="M14 10v4h-4" />
        </>
      )}
    </svg>
  )
}

function AssetCard() {
  const [fullscreen, setFullscreen] = useFullscreen()
  const size = fullscreen ? 380 : 155
  const content = (
    <Card
      padding="md"
      className={`fonplata-inv__chart-card ${fullscreen ? 'fonplata-inv__chart-card--fullscreen' : ''}`}
    >
      <div className="fonplata-inv__chart-header">
        <span className="fonplata-inv__chart-title">Clases de activos</span>
        <button
          type="button"
          className="fonplata-inv__fs-btn"
          onClick={() => setFullscreen((f) => !f)}
          aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          title={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          <FsIcon fullscreen={fullscreen} />
        </button>
      </div>
      <div className="fonplata-inv__chart-body fonplata-inv__chart-body--donut">
        <AssetDonut size={size} />
        <div className="fonplata-inv__legend">
          {ASSET_CLASSES.map((a) => (
            <div key={a.id} className="fonplata-inv__legend-item">
              <span
                className="fonplata-inv__legend-swatch"
                style={{ background: a.color }}
              />
              <span>{a.label}</span>
              <strong>{a.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
  return fullscreen ? createPortal(content, document.body) : content
}

function MaturityCard() {
  const [fullscreen, setFullscreen] = useFullscreen()
  const width = fullscreen ? 1200 : 820
  const height = fullscreen ? 600 : 260
  const content = (
    <Card
      padding="md"
      className={`fonplata-inv__chart-card ${fullscreen ? 'fonplata-inv__chart-card--fullscreen' : ''}`}
    >
      <div className="fonplata-inv__chart-header">
        <span className="fonplata-inv__chart-title">
          Perfil de vencimientos nominal <span className="fonplata-inv__chart-unit">USD M</span>
        </span>
        <button
          type="button"
          className="fonplata-inv__fs-btn"
          onClick={() => setFullscreen((f) => !f)}
          aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          title={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          <FsIcon fullscreen={fullscreen} />
        </button>
      </div>
      <div className="fonplata-inv__chart-body">
        <MaturityChart width={width} height={height} />
      </div>
    </Card>
  )
  return fullscreen ? createPortal(content, document.body) : content
}

// ─────────── Slide ───────────

export function FonplataInvestmentSlide() {
  return (
    <div className="fonplata-inv">
      <TextCard
        eyebrow="Cartera de inversiones"
        title="Cartera de Inversiones FONPLATA"
      />
      <div className="fonplata-inv__metrics">
        <MetricsTable />
      </div>
      <div className="fonplata-inv__charts">
        <AssetCard />
        <MaturityCard />
      </div>
    </div>
  )
}
