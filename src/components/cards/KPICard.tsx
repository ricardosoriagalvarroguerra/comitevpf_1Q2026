import { Card } from '@/components/ui/Card'
import './KPICard.css'

interface KPICardProps {
  label: string
  value: string | number
  unit?: string
  trend?: { direction: 'up' | 'down' | 'flat'; label: string }
  size?: 'sm' | 'md' | 'lg'
}

export function KPICard({
  label,
  value,
  unit,
  trend,
  size = 'md',
}: KPICardProps) {
  return (
    <Card padding="md" className={`kpi-card kpi-card--${size}`}>
      <span className="kpi-card__label">{label}</span>
      <div className="kpi-card__value-row">
        <span className="kpi-card__value">{value}</span>
        {unit && <span className="kpi-card__unit">{unit}</span>}
      </div>
      {trend && (
        <span className={`kpi-card__trend kpi-card__trend--${trend.direction}`}>
          {trend.direction === 'up' && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2.5v7M6 2.5L3 5.5M6 2.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {trend.direction === 'down' && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 9.5v-7M6 9.5L3 6.5M6 9.5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {trend.label}
        </span>
      )}
    </Card>
  )
}
