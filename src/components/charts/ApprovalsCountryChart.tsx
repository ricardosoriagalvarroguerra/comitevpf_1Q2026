import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import * as d3 from 'd3'
import './ApprovalsCountryChart.css'

export interface ApprovalPoint {
  period: string
  aprobaciones: number
  cancelaciones: number
  netas: number
}

interface ApprovalsCountryChartProps {
  title: string
  data: ApprovalPoint[]
  width: number
  height: number
  domainOverride?: [number, number]
  onHoverChange?: (point: ApprovalPoint | null) => void
}

const COLOR_APR = '#c1121f'
const COLOR_CANC = '#c4c6c9'

const fmt = (n: number) =>
  n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })

export function ApprovalsCountryChart({
  title,
  data,
  width,
  height,
  domainOverride,
  onHoverChange,
}: ApprovalsCountryChartProps) {
  const [hover, setHover] = useState<number | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  const setHoverIdx = (idx: number | null) => {
    setHover(idx)
    onHoverChange?.(idx !== null ? data[idx] : null)
  }

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

  const effW = fullscreen ? 1280 : width
  const effH = fullscreen ? 620 : height

  const margin = fullscreen
    ? { top: 20, right: 24, bottom: 48, left: 60 }
    : { top: 10, right: 12, bottom: 28, left: 36 }
  const innerW = effW - margin.left - margin.right
  const innerH = effH - margin.top - margin.bottom

  const x = useMemo(
    () =>
      d3
        .scaleBand<string>()
        .domain(data.map((d) => d.period))
        .range([0, innerW])
        .padding(0.22),
    [data, innerW],
  )

  const domain = useMemo(() => {
    if (domainOverride) return domainOverride
    const maxVal = d3.max(data, (d) => Math.max(d.aprobaciones, d.netas)) ?? 0
    const minVal = d3.min(data, (d) => Math.min(d.cancelaciones, d.netas)) ?? 0
    return [Math.min(0, minVal) * 1.08, Math.max(0, maxVal) * 1.08]
  }, [data, domainOverride])

  const y = useMemo(
    () => d3.scaleLinear().domain(domain).range([innerH, 0]).nice(),
    [domain, innerH],
  )

  const yTicks = y.ticks(4)
  const barW = x.bandwidth() / 2

  const linePath = useMemo(() => {
    const gen = d3
      .line<ApprovalPoint>()
      .x((d) => (x(d.period) ?? 0) + x.bandwidth() / 2)
      .y((d) => y(d.netas))
      .curve(d3.curveMonotoneX)
    return gen(data) ?? ''
  }, [data, x, y])

  const xTickEvery = Math.ceil(data.length / 8)

  const content = (
    <div
      className={`approvals-chart ${fullscreen ? 'approvals-chart--fullscreen' : ''}`}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <div className="approvals-chart__head">
        <span className="approvals-chart__title">{title}</span>
        <button
          type="button"
          className="approvals-chart__fs-btn"
          onClick={() => setFullscreen((f) => !f)}
          aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          title={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
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
        </button>
      </div>
      <svg
        viewBox={`0 0 ${effW} ${effH}`}
        className="approvals-chart__svg"
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
                className="approvals-chart__grid"
              />
              <text
                x={-6}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className="approvals-chart__axis-label"
              >
                {fmt(t)}
              </text>
            </g>
          ))}

          <line
            x1={0}
            x2={innerW}
            y1={y(0)}
            y2={y(0)}
            className="approvals-chart__zero-line"
          />

          {/* Bars */}
          {data.map((d, i) => {
            const cx = x(d.period) ?? 0
            const isHover = hover === i
            const faded = hover !== null && !isHover
            const aprY = y(Math.max(0, d.aprobaciones))
            const aprH = Math.abs(y(d.aprobaciones) - y(0))
            const cancY = y(Math.max(0, d.cancelaciones))
            const cancH = Math.abs(y(d.cancelaciones) - y(0))
            return (
              <g key={d.period}>
                {d.aprobaciones !== 0 && (
                  <rect
                    className="approvals-chart__bar"
                    x={cx}
                    y={aprY}
                    width={barW}
                    height={aprH}
                    fill={COLOR_APR}
                    opacity={faded ? 0.3 : 0.85}
                  />
                )}
                {d.cancelaciones !== 0 && (
                  <rect
                    className="approvals-chart__bar"
                    x={cx + barW}
                    y={cancY}
                    width={barW}
                    height={cancH}
                    fill={COLOR_CANC}
                    opacity={faded ? 0.3 : 0.85}
                  />
                )}
              </g>
            )
          })}

          {/* Net line */}
          <path
            d={linePath}
            fill="none"
            strokeWidth={fullscreen ? 2.2 : 1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="approvals-chart__line"
          />
          {data.map((d, i) => {
            const cx = (x(d.period) ?? 0) + x.bandwidth() / 2
            const cy = y(d.netas)
            const isHover = hover === i
            return (
              <circle
                key={`n-${d.period}`}
                cx={cx}
                cy={cy}
                r={isHover ? 3.2 : 2.2}
                className="approvals-chart__dot"
              />
            )
          })}

          {/* X axis labels */}
          {data.map((d, i) =>
            i % xTickEvery === 0 || i === data.length - 1 ? (
              <text
                key={`xt-${d.period}`}
                x={(x(d.period) ?? 0) + x.bandwidth() / 2}
                y={innerH + 16}
                textAnchor="middle"
                className="approvals-chart__axis-label"
              >
                {d.period}
              </text>
            ) : null,
          )}

          {/* Hit areas for hover */}
          {data.map((d, i) => (
            <rect
              key={`hit-${d.period}`}
              x={x(d.period) ?? 0}
              y={0}
              width={x.bandwidth()}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </g>
      </svg>
    </div>
  )

  return fullscreen ? createPortal(content, document.body) : content
}
