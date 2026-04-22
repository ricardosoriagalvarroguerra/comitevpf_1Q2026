import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import * as d3 from 'd3'
import { CAPACIDAD_PRESTABLE } from '@/data/capacidadPrestable'
import './CapacityLimitChart.css'

const COLOR_UTILIZADA = '#c1121f'

const fmt = (n: number) =>
  n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

const fmt1 = (n: number) =>
  n.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

interface CapacityLimitChartProps {
  title?: string
}

export function CapacityLimitChart({
  title = 'Límite de Capacidad Prestable',
}: CapacityLimitChartProps) {
  const [hover, setHover] = useState<number | null>(null)
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

  const data = CAPACIDAD_PRESTABLE

  const effW = fullscreen ? 1280 : 1040
  const effH = fullscreen ? 620 : 280

  const margin = fullscreen
    ? { top: 44, right: 28, bottom: 44, left: 64 }
    : { top: 32, right: 16, bottom: 28, left: 48 }

  const innerW = effW - margin.left - margin.right
  const innerH = effH - margin.top - margin.bottom

  const x = useMemo(
    () =>
      d3
        .scaleBand<string>()
        .domain(data.map((d) => d.period))
        .range([0, innerW])
        .padding(0.32),
    [data, innerW],
  )

  const maxY = useMemo(
    () => (d3.max(data, (d) => d.capacidadMax) ?? 1) * 1.12,
    [data],
  )

  const y = useMemo(
    () => d3.scaleLinear().domain([0, maxY]).range([innerH, 0]).nice(),
    [maxY, innerH],
  )

  const yTicks = y.ticks(5)
  const hoveredPoint = hover !== null ? data[hover] : null

  const content = (
    <div
      className={`capacity-limit-chart ${fullscreen ? 'capacity-limit-chart--fullscreen' : ''}`}
      onMouseLeave={() => setHover(null)}
    >
      <div className="capacity-limit-chart__head">
        <span className="capacity-limit-chart__title">{title}</span>
        <div className="capacity-limit-chart__legend">
          <span className="capacity-limit-chart__legend-item">
            <span
              className="capacity-limit-chart__legend-swatch"
              style={{ background: COLOR_UTILIZADA }}
            />
            Utilizada
          </span>
          <span className="capacity-limit-chart__legend-item">
            <span className="capacity-limit-chart__legend-swatch capacity-limit-chart__legend-swatch--dashed" />
            Disponible
          </span>
          <span className="capacity-limit-chart__legend-item">
            <span style={{ fontWeight: 600 }}>◆</span>
            Máxima
          </span>
        </div>
        <button
          type="button"
          className="capacity-limit-chart__fs-btn"
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

      {hoveredPoint && (
        <div className="capacity-limit-chart__tooltip" role="status" aria-live="polite">
          <span className="capacity-limit-chart__tooltip-period">{hoveredPoint.period}</span>
          <span className="capacity-limit-chart__tooltip-row">
            <span
              className="capacity-limit-chart__tooltip-swatch"
              style={{ background: COLOR_UTILIZADA }}
            />
            Utilizada <strong>{fmt1(hoveredPoint.utilizadaTotal)}</strong>
          </span>
          <span className="capacity-limit-chart__tooltip-row">
            <span className="capacity-limit-chart__tooltip-swatch capacity-limit-chart__tooltip-swatch--dashed" />
            Disponible <strong>{fmt1(hoveredPoint.capacidadMax - hoveredPoint.utilizadaTotal)}</strong>
          </span>
          <span className="capacity-limit-chart__tooltip-row">
            Máxima <strong>{fmt1(hoveredPoint.capacidadMax)}</strong>
          </span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${effW} ${effH}`}
        className="capacity-limit-chart__svg"
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
                className="capacity-limit-chart__grid"
              />
              <text
                x={-8}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className="capacity-limit-chart__axis-label"
              >
                {fmt(t)}
              </text>
            </g>
          ))}

          <line
            x1={0}
            x2={innerW}
            y1={innerH}
            y2={innerH}
            className="capacity-limit-chart__axis-line"
          />

          {data.map((d, i) => {
            const cx = x(d.period) ?? 0
            const bw = x.bandwidth()
            const disponible = d.capacidadMax - d.utilizadaTotal

            const yUtilTop = y(d.utilizadaTotal)
            const hUtil = innerH - yUtilTop
            const yDispTop = y(d.capacidadMax)
            const hDisp = y(d.utilizadaTotal) - y(d.capacidadMax)

            const isHover = hover === i
            const faded = hover !== null && !isHover

            return (
              <g key={d.period}>
                <rect
                  className="capacity-limit-chart__bar"
                  x={cx}
                  y={yUtilTop}
                  width={bw}
                  height={Math.max(0, hUtil)}
                  fill={COLOR_UTILIZADA}
                  opacity={faded ? 0.35 : 0.92}
                />
                <rect
                  className="capacity-limit-chart__bar capacity-limit-chart__bar--disponible"
                  x={cx + 0.5}
                  y={yDispTop}
                  width={Math.max(0, bw - 1)}
                  height={Math.max(0, hDisp)}
                  opacity={faded ? 0.35 : 1}
                />

                {hUtil > 16 && (
                  <text
                    className="capacity-limit-chart__segment-label"
                    x={cx + bw / 2}
                    y={yUtilTop + hUtil / 2}
                    dy="0.32em"
                    textAnchor="middle"
                  >
                    {fmt1(d.utilizadaTotal)}
                  </text>
                )}

                {hDisp > 14 && (
                  <text
                    className="capacity-limit-chart__segment-label capacity-limit-chart__segment-label--disponible"
                    x={cx + bw / 2}
                    y={yDispTop + hDisp / 2}
                    dy="0.32em"
                    textAnchor="middle"
                  >
                    {fmt1(disponible)}
                  </text>
                )}

                <text
                  className="capacity-limit-chart__max-label"
                  x={cx + bw / 2}
                  y={yDispTop - 6}
                  textAnchor="middle"
                >
                  {fmt1(d.capacidadMax)}
                </text>

                <rect
                  x={cx}
                  y={0}
                  width={bw}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            )
          })}

          {data.map((d) => (
            <text
              key={`xt-${d.period}`}
              x={(x(d.period) ?? 0) + x.bandwidth() / 2}
              y={innerH + 18}
              textAnchor="middle"
              className="capacity-limit-chart__axis-label"
            >
              {d.period}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )

  return fullscreen ? createPortal(content, document.body) : content
}
