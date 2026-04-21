import { Card } from '@/components/ui/Card'
import './DonutPlaceholder.css'

interface DonutSegment {
  id: string
  label: string
  value: number
  color: string
}

interface DonutPlaceholderProps {
  data?: DonutSegment[]
  title?: string
  size?: 'sm' | 'md' | 'lg'
  showLegend?: boolean
  className?: string
}

export function DonutPlaceholder({
  data,
  title,
  size = 'md',
  showLegend = false,
  className = '',
}: DonutPlaceholderProps) {
  const svgSize = size === 'sm' ? 100 : size === 'md' ? 140 : 180
  const stroke = size === 'sm' ? 16 : size === 'md' ? 20 : 24
  const radius = (svgSize - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const center = svgSize / 2

  const total = data?.reduce((s, d) => s + d.value, 0) ?? 0
  let offset = 0

  return (
    <Card variant="flat" padding="none" className={`donut-ph donut-ph--${size} ${className}`}>
      {title && <span className="donut-ph__title">{title}</span>}
      <div className="donut-ph__ring-wrap">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="donut-ph__svg"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-gray-100)"
            strokeWidth={stroke}
          />
          {data && total > 0 && data.map((seg) => {
            const pct = seg.value / total
            const dash = pct * circumference
            const currentOffset = offset
            offset += pct
            return (
              <circle
                key={seg.id}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-currentOffset * circumference}
                transform={`rotate(-90 ${center} ${center})`}
                opacity={0.8}
              />
            )
          })}
        </svg>
      </div>
      {showLegend && data && (
        <div className="donut-ph__legend">
          {data.map((seg) => (
            <div key={seg.id} className="donut-ph__legend-item">
              <span className="donut-ph__legend-swatch" style={{ background: seg.color }} />
              <span className="donut-ph__legend-label">{seg.label}</span>
              <span className="donut-ph__legend-value">
                {total > 0 ? `${Math.round((seg.value / total) * 100)}%` : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
