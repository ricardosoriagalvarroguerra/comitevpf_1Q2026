import { TextCard } from '@/components/cards/TextCard'
import { DonutPlaceholder } from '@/components/cards/DonutPlaceholder'
import { ChartPlaceholder } from '@/components/cards/ChartPlaceholder'
import { Card } from '@/components/ui/Card'
import './DebtAuthorizationSlide.css'

const sampleDonut = [
  { id: 'utilizado', label: 'Utilizado', value: 65, color: 'var(--color-series-1)' },
  { id: 'disponible', label: 'Disponible', value: 35, color: 'var(--color-gray-300)' },
]

interface DebtAuthorizationSlideProps {
  eyebrow?: string
  title: string
  description?: string
}

export function DebtAuthorizationSlide({
  eyebrow,
  title,
  description,
}: DebtAuthorizationSlideProps) {
  return (
    <div className="debt-auth">
      <div className="debt-auth__text">
        <TextCard
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </div>
      <div className="debt-auth__right">
        <Card padding="md" className="debt-auth__donut-card">
          <div className="debt-auth__donut-header">
            <span className="debt-auth__donut-title">Capacidad autorizada</span>
          </div>
          <div className="debt-auth__donut-body">
            <DonutPlaceholder data={sampleDonut} size="md" showLegend />
          </div>
        </Card>
        <ChartPlaceholder
          title="Evolución del endeudamiento"
          chartType="line"
          unit="USD MM"
        />
      </div>
    </div>
  )
}
