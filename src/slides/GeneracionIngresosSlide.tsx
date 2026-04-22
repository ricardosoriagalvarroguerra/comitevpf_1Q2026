import { TextCard } from '@/components/cards/TextCard'
import { Card } from '@/components/ui/Card'
import './FinancialTableSlide.css'

interface Row {
  label: string
  saldo26?: string
  ing26?: string
  ret26?: string
  saldo25?: string
  ing25?: string
  ret25?: string
  kind?: 'subtotal' | 'total' | 'soft'
}

const ROWS: Row[] = [
  { label: 'Préstamos por cobrar', saldo26: '2.545,9', ing26: '43,7', ret26: '1,72%', saldo25: '2.231,4', ing25: '46,5', ret25: '2,08%' },
  { label: 'Inversiones', saldo26: '1.128,4', ing26: '11,7', ret26: '1,04%', saldo25: '664,9', ing25: '7,4', ret25: '1,11%' },
  { label: 'Liquidez', saldo26: '67,0', ing26: '—', ret26: '0,00%', saldo25: '66,5', ing25: '0,1', ret25: '0,15%' },
  { label: 'Activos financieros', saldo26: '3.741,3', ing26: '55,4', ret26: '1,48%', saldo25: '2.962,8', ing25: '54,0', ret25: '1,82%', kind: 'subtotal' },
  { label: 'Endeudamientos', saldo26: '(1.896,7)', ing26: '(29,6)', ret26: '1,56%', saldo25: '(1.270,4)', ing25: '(20,8)', ret25: '1,64%' },
  { label: 'Activos financieros netos', saldo26: '1.844,6', ing26: '25,8', ret26: '1,40%', saldo25: '1.692,4', ing25: '33,2', ret25: '1,96%', kind: 'subtotal' },
  { label: 'Previsiones, depreciación, diferencia de cambio y participación fondos especiales', saldo26: '', ing26: '2,6', ret26: '0,14%', saldo25: '', ing25: '(4,0)', ret25: '-0,24%', kind: 'soft' },
  { label: 'Gastos administrativos', saldo26: '', ing26: '(4,3)', ret26: '-0,23%', saldo25: '', ing25: '(3,6)', ret25: '-0,21%', kind: 'soft' },
  { label: 'Activos netos', saldo26: '1.844,6', ing26: '24,1', ret26: '1,31%', saldo25: '1.692,4', ing25: '25,6', ret25: '1,51%', kind: 'subtotal' },
  { label: 'Patrimonio', saldo26: '1.823,8', ing26: '24,1', ret26: '1,32%', saldo25: '1.673,6', ing25: '25,6', ret25: '1,53%', kind: 'total' },
]

export function GeneracionIngresosSlide() {
  return (
    <div className="fin-table-slide">
      <TextCard
        eyebrow="1 · SITUACIÓN FINANCIERA"
        title="¿Cómo se generan los ingresos?"
        description="USD Millones"
      />
      <div className="fin-table-slide__body">
        <Card padding="none" className="fin-table-slide__grouped">
          <table>
            <thead>
              <tr>
                <th rowSpan={2}>Concepto</th>
                <th colSpan={3}>mar-26</th>
                <th colSpan={3} className="fin-table-slide__group-sep">mar-25</th>
              </tr>
              <tr>
                <th>Saldo Promedio</th>
                <th>Resultados</th>
                <th>Retorno %</th>
                <th className="fin-table-slide__group-sep">Saldo Promedio</th>
                <th>Resultados</th>
                <th>Retorno %</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr
                  key={i}
                  className={
                    r.kind === 'subtotal'
                      ? 'fin-table-slide__row-subtotal'
                      : r.kind === 'total'
                        ? 'fin-table-slide__total'
                        : r.kind === 'soft'
                          ? 'fin-table-slide__row-soft'
                          : ''
                  }
                >
                  <td>{r.label}</td>
                  <td>{r.saldo26}</td>
                  <td>{r.ing26}</td>
                  <td>{r.ret26}</td>
                  <td className="fin-table-slide__group-sep">{r.saldo25}</td>
                  <td>{r.ing25}</td>
                  <td>{r.ret25}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
