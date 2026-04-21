import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import * as d3 from 'd3'
import './RateStackedBarChart.css'

export interface RateSeries {
  name: string
  values: number[]
  color: string
}

interface RateStackedBarChartProps {
  title: string
  labels: string[]
  /** Orden bottom → top. */
  series: RateSeries[]
  unit?: string
}

const WIDTH = 760
const HEIGHT = 320
const MARGIN = { top: 16, right: 24, bottom: 44, left: 48 }

export function RateStackedBarChart({
  title,
  labels,
  series,
  unit = '%',
}: RateStackedBarChartProps) {
  const [hover, setHover] = useState<number | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('is-chart-fullscreen')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      document.body.classList.remove('is-chart-fullscreen')
    }
  }, [fullscreen])

  const innerW = WIDTH - MARGIN.left - MARGIN.right
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom

  const totals = useMemo(
    () => labels.map((_, i) => series.reduce((s, ss) => s + (ss.values[i] ?? 0), 0)),
    [labels, series],
  )
  const maxY = useMemo(() => d3.max(totals) ?? 1, [totals])

  const x = useMemo(
    () =>
      d3
        .scaleBand<string>()
        .domain(labels)
        .range([0, innerW])
        .padding(0.18),
    [labels, innerW],
  )
  const y = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, maxY * 1.05])
        .range([innerH, 0])
        .nice(),
    [maxY, innerH],
  )

  const yTicks = y.ticks(5)
  const xTickEvery = Math.ceil(labels.length / 12)

  const hoveredTotal = hover !== null ? totals[hover] : 0

  const chartNode = (
    <div className={`rate-chart ${fullscreen ? 'rate-chart--fullscreen' : ''}`}>
      <div className="rate-chart__header">
        <div className="rate-chart__heading">
          <h3 className="rate-chart__title">{title}</h3>
          {unit ? <span className="rate-chart__unit">{unit}</span> : null}
        </div>
        {hover !== null && (
          <div className="rate-chart__tooltip" role="status" aria-live="polite">
            <span className="rate-chart__tooltip-label">{labels[hover]}</span>
            {[...series].reverse().map((s) => (
              <span key={s.name} className="rate-chart__tooltip-item">
                <span
                  className="rate-chart__tooltip-swatch"
                  style={{ background: s.color }}
                />
                <span className="rate-chart__tooltip-name">{s.name}</span>
                <strong>
                  {(s.values[hover] ?? 0).toFixed(2)}
                  {unit}
                </strong>
              </span>
            ))}
            <span className="rate-chart__tooltip-item rate-chart__tooltip-item--total">
              <span className="rate-chart__tooltip-name">Total</span>
              <strong>
                {hoveredTotal.toFixed(2)}
                {unit}
              </strong>
            </span>
          </div>
        )}
        <button
          type="button"
          className="rate-chart__fs-btn"
          onClick={() => setFullscreen((f) => !f)}
          aria-label={fullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
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
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="rate-chart__svg"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setHover(null)}
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Y grid + axis labels */}
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={0}
                x2={innerW}
                y1={y(t)}
                y2={y(t)}
                className="rate-chart__grid"
              />
              <text
                x={-8}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className="rate-chart__axis-label"
              >
                {t}
                {unit}
              </text>
            </g>
          ))}

          {/* X baseline */}
          <line
            x1={0}
            x2={innerW}
            y1={innerH}
            y2={innerH}
            className="rate-chart__axis-line"
          />

          {/* Stacked bars */}
          {labels.map((l, i) => {
            let acc = 0
            return series.map((s) => {
              const v = Math.max(0, s.values[i] ?? 0)
              const y0 = y(acc + v)
              const y1 = y(acc)
              acc += v
              const isHover = hover === i
              return (
                <rect
                  key={`${l}-${s.name}`}
                  className="rate-chart__bar"
                  x={x(l) ?? 0}
                  y={y0}
                  width={x.bandwidth()}
                  height={Math.max(0, y1 - y0)}
                  rx={1.5}
                  fill={s.color}
                  opacity={hover === null ? 1 : isHover ? 1 : 0.3}
                />
              )
            })
          })}

          {/* X axis labels (thinned) */}
          {labels.map((l, i) =>
            i % xTickEvery === 0 ? (
              <text
                key={`xt-${l}`}
                x={(x(l) ?? 0) + x.bandwidth() / 2}
                y={innerH + 18}
                textAnchor="middle"
                className="rate-chart__axis-label"
              >
                {l}
              </text>
            ) : null,
          )}

          {/* Hover hit areas (full-height per column) */}
          {labels.map((l, i) => (
            <rect
              key={`hit-${l}`}
              x={x(l) ?? 0}
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

  return fullscreen ? createPortal(chartNode, document.body) : chartNode
}
