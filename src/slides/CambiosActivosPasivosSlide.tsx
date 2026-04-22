import { TextCard } from '@/components/cards/TextCard'
import { TableCard } from '@/components/cards/TableCard'
import './FinancialTableSlide.css'

const columns = [
  { key: 'concepto', label: '', align: 'left' as const },
  { key: 'mar26', label: 'mar-26', align: 'right' as const },
  { key: 'mar25', label: 'mar-25', align: 'right' as const },
  { key: 'var', label: 'Var. %', align: 'right' as const },
]

const rows = [
  { concepto: 'Préstamos', mar26: '$2.622,00', mar25: '$2.469,70', var: '6,2%' },
  { concepto: 'Inversiones', mar26: '$1.424,00', mar25: '$832,70', var: '71,0%' },
  { concepto: 'Bancos', mar26: '$25,00', mar25: '$108,90', var: '(77,0%)' },
  { concepto: 'Otros activos', mar26: '$16,66', mar25: '$22,83', var: '(27,0%)' },
  { concepto: 'Total activos', mar26: '$4.087,66', mar25: '$3.434,13', var: '19,0%', isTotal: true },
  { concepto: 'Endeudamientos', mar26: '$2.175,50', mar25: '$1.617,90', var: '34,5%' },
  { concepto: 'Otros pasivos', mar26: '$41,20', mar25: '$(39,68)', var: '203,8%' },
  { concepto: 'Total pasivo', mar26: '$2.216,70', mar25: '$1.578,22', var: '40,5%', isTotal: true },
  { concepto: 'Patrimonio', mar26: '$1.871,10', mar25: '$1.776,60', var: '5,3%' },
]

export function CambiosActivosPasivosSlide() {
  return (
    <div className="fin-table-slide">
      <TextCard
        eyebrow="1 · SITUACIÓN FINANCIERA"
        title="Cambios en activos y pasivos financieros"
        description="USD Millones"
      />
      <div className="fin-table-slide__body">
        <TableCard
          columns={columns}
          rows={rows}
          className="fin-table-slide__table"
        />
      </div>
    </div>
  )
}
