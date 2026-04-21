import { TextCard } from '@/components/cards/TextCard'
import { ChartPlaceholder } from '@/components/cards/ChartPlaceholder'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { useState } from 'react'
import './PrevisionSlide.css'

export function PrevisionSlide() {
  const [view, setView] = useState('monto')

  return (
    <div className="prevision-slide">
      <div className="prevision-slide__text">
        <TextCard
          eyebrow="Previsión de pérdidas"
          title="Previsión para Pérdida de Cartera de Préstamos"
          description="Evolución de la previsión para pérdida y ratio de cobertura de la cartera de préstamos."
          highlights={[
            'Previsión total vs cartera vencida',
            'Ratio de cobertura trimestral',
            'Vista por monto absoluto o índice base 100',
          ]}
        />
      </div>
      <div className="prevision-slide__chart">
        <div className="prevision-slide__controls">
          <SegmentedControl
            options={[
              { value: 'monto', label: 'Monto' },
              { value: 'indice100', label: 'Índice 100' },
            ]}
            value={view}
            onChange={setView}
          />
        </div>
        <ChartPlaceholder
          title="Previsión para pérdida"
          subtitle={view === 'monto' ? 'USD millones' : 'Base 100 = Q1 2020'}
          chartType="line"
          unit={view === 'monto' ? 'USD MM' : 'Índice'}
          height="full"
        />
      </div>
    </div>
  )
}
