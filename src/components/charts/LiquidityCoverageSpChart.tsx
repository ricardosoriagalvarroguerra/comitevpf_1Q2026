import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as d3 from 'd3'
import './LiquidityCoverageSpChart.css'

interface SpCoveragePoint {
  year: number
  fonplata: number
}

interface LiquidityCoverageSpChartProps {
  data: SpCoveragePoint[]
}

const LINE_COLOR = 'var(--color-accent, #c1121f)'
const WEAK_COLOR = '#c1121f'
const STRONG_COLOR = '#55a630'
const THRESHOLD = 1.0

const VB_WIDTH = 720
const VB_HEIGHT = 360

export function LiquidityCoverageSpChart({ data }: LiquidityCoverageSpChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
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

  const width = VB_WIDTH
  const height = VB_HEIGHT
  const margin = { top: 24, right: 56, bottom: 36, left: 52 }
  const innerW = Math.max(10, width - margin.left - margin.right)
  const innerH = Math.max(10, height - margin.top - margin.bottom)

  const yMin = 0.4
  const yMax = 1.8

  const x = useMemo(
    () =>
      d3
        .scalePoint<number>()
        .domain(data.map((d) => d.year))
        .range([0, innerW])
        .padding(0.5),
    [data, innerW],
  )

  const y = useMemo(
    () => d3.scaleLinear().domain([yMin, yMax]).range([innerH, 0]),
    [innerH],
  )

  const line = useMemo(
    () =>
      d3
        .line<SpCoveragePoint>()
        .x((d) => x(d.year) ?? 0)
        .y((d) => y(d.fonplata))
        .curve(d3.curveMonotoneX),
    [x, y],
  )

  const yTicks = [0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8]

  const hovered = hoverIdx !== null ? data[hoverIdx] : null
  const hoverX = hovered ? (x(hovered.year) ?? 0) : 0

  const strongTop = y(yMax)
  const thresholdY = y(THRESHOLD)
  const weakBottom = y(yMin)

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const vbX = ((e.clientX - rect.left) / rect.width) * width - margin.left
    if (vbX < 0 || vbX > innerW) {
      setHoverIdx(null)
      return
    }
    let closest = 0
    let closestD = Infinity
    data.forEach((d, i) => {
      const dx = Math.abs((x(d.year) ?? 0) - vbX)
      if (dx < closestD) {
        closestD = dx
        closest = i
      }
    })
    setHoverIdx(closest)
  }

  const tooltipLeftPct =
    hovered != null ? ((margin.left + hoverX) / width) * 100 : 0
  const tooltipTopPct =
    hovered != null ? ((margin.top + y(hovered.fonplata)) / height) * 100 : 0

  const chartNode = (
    <div className={`liq-sp ${fullscreen ? 'liq-sp--fullscreen' : ''}`}>
      <button
        type="button"
        className="liq-sp__fs-btn"
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
      <svg
        ref={svgRef}
        className="liq-sp__svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIdx(null)}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Strong band */}
          <rect
            x={0}
            y={strongTop}
            width={innerW}
            height={Math.max(0, thresholdY - strongTop)}
            fill={STRONG_COLOR}
            fillOpacity={0.18}
          />
          {/* Weak band */}
          <rect
            x={0}
            y={thresholdY}
            width={innerW}
            height={Math.max(0, weakBottom - thresholdY)}
            fill={WEAK_COLOR}
            fillOpacity={0.14}
          />

          {/* Band labels */}
          <text
            x={innerW + 6}
            y={strongTop + (thresholdY - strongTop) / 2}
            dy="0.32em"
            textAnchor="start"
            className="liq-sp__band-label liq-sp__band-label--strong"
          >
            Strong
          </text>
          <text
            x={innerW + 6}
            y={thresholdY + (weakBottom - thresholdY) / 2}
            dy="0.32em"
            textAnchor="start"
            className="liq-sp__band-label liq-sp__band-label--weak"
          >
            Weak
          </text>

          {/* Threshold line */}
          <line
            x1={0}
            x2={innerW}
            y1={thresholdY}
            y2={thresholdY}
            className="liq-sp__threshold"
          />

          {/* Grid + Y axis */}
          {yTicks.map((t) => (
            <g key={t} transform={`translate(0,${y(t)})`}>
              <line
                x1={0}
                x2={innerW}
                className="liq-sp__grid"
              />
              <text
                x={-8}
                y={0}
                dy="0.32em"
                textAnchor="end"
                className="liq-sp__axis-label"
              >
                {t.toFixed(1)}
              </text>
            </g>
          ))}

          {/* X axis labels */}
          {data.map((d) => (
            <text
              key={d.year}
              x={x(d.year) ?? 0}
              y={innerH + 20}
              textAnchor="middle"
              className="liq-sp__axis-label"
            >
              {d.year}
            </text>
          ))}

          {/* Hover guide */}
          {hovered && (
            <line
              x1={hoverX}
              x2={hoverX}
              y1={0}
              y2={innerH}
              className="liq-sp__hover-guide"
            />
          )}

          {/* FONPLATA line */}
          <path
            d={line(data) ?? ''}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data labels */}
          {data.map((d) => (
            <text
              key={`lbl-${d.year}`}
              x={x(d.year) ?? 0}
              y={y(d.fonplata) - 10}
              textAnchor="middle"
              className="liq-sp__data-label"
            >
              {d.fonplata.toFixed(2)}
            </text>
          ))}

          {/* Dots */}
          {data.map((d, i) => (
            <circle
              key={`pt-${d.year}`}
              cx={x(d.year) ?? 0}
              cy={y(d.fonplata)}
              r={hoverIdx === i ? 5.5 : 3.5}
              fill={LINE_COLOR}
              stroke="var(--color-surface, #fff)"
              strokeWidth={1.5}
            />
          ))}
        </g>
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div
          className="liq-sp__tooltip"
          role="status"
          aria-live="polite"
          style={{
            left: `${tooltipLeftPct}%`,
            top: `${tooltipTopPct}%`,
          }}
        >
          <div className="liq-sp__tooltip-date">{hovered.year}</div>
          <div className="liq-sp__tooltip-row">
            <span
              className="liq-sp__tooltip-swatch"
              style={{ background: LINE_COLOR }}
            />
            <span className="liq-sp__tooltip-label">FONPLATA</span>
            <strong>{hovered.fonplata.toFixed(2)}</strong>
          </div>
          <div className="liq-sp__tooltip-row">
            <span className="liq-sp__tooltip-label">Rating (S&amp;P)</span>
            <strong>{hovered.fonplata >= THRESHOLD ? 'Strong' : 'Weak'}</strong>
          </div>
        </div>
      )}
    </div>
  )

  return fullscreen ? createPortal(chartNode, document.body) : chartNode
}

export type { SpCoveragePoint }
