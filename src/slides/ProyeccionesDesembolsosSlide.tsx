import { TextCard } from '@/components/cards/TextCard'
import { TableCard } from '@/components/cards/TableCard'
import { Card } from '@/components/ui/Card'
import './DebtSourcesSlide.css'

interface ProyeccionesDesembolsosSlideProps {
  eyebrow?: string
  title?: string
  description?: string
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const nfMillions = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})
const nfMillions2 = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const GS_DATA: Record<string, number[]> = {
  Argentina: [0, 13846387, 16626139, 20000000, 0, 9400000, 0, 1600000, 6800000, 31369507, 5000000, 108815],
  Bolivia:   [0, 0, 26772500, 535000, 9375904, 3750000, 26500000, 2000000, 6500000, 1000000, 37477500, 5500000],
  Brasil:    [3443912, 3940482, 6895488, 22000000, 10000000, 4494400, 10000000, 7812775, 21732545, 10259518, 15100000, 19000000],
  Paraguay:  [0, 0, 27034137, 0, 0, 5000000, 0, 0, 7451576, 11897529, 0, 21337062],
  Uruguay:   [0, 17834774, 0, 0, 8000000, 0, 0, 4000000, 14532049, 7071547, 0, 5000000],
}

const SNS_DATA: Record<string, number[]> = {
  Argentina: Array(12).fill(0),
  Bolivia: Array(12).fill(0),
  Brasil: [0, 0, 0, 0, 55_000_000, 0, 0, 0, 0, 0, 0, 0],
  Paraguay: Array(12).fill(0),
  Uruguay: Array(12).fill(0),
}

type MonthKey = `m${number}`

function buildColumns(firstHeader = 'País') {
  return [
    { key: 'pais', label: firstHeader, align: 'left' as const },
    ...MESES.map((m, i) => ({
      key: `m${i}` as MonthKey,
      label: m,
      align: 'right' as const,
      className:
        i < 3
          ? 'month-cell month-cell--ejecutado'
          : `month-cell month-cell--proyectado${i === 3 ? ' month-cell--boundary' : ''}`,
    })),
  ]
}

function formatCell(n: number) {
  const inMillions = n / 1_000_000
  return n === 0 ? '0' : nfMillions.format(inMillions)
}

function buildRows(data: Record<string, number[]>) {
  const countries = Object.keys(data)
  const monthTotals = MESES.map((_, i) =>
    countries.reduce((s, c) => s + (data[c]?.[i] ?? 0), 0),
  )
  const grand = monthTotals.reduce((s, v) => s + v, 0)

  const countryRows = countries.map((c) => {
    const row: Record<string, string | number | boolean> = { pais: c }
    data[c].forEach((v, i) => {
      row[`m${i}`] = formatCell(v)
    })
    return row
  })

  const totalesRow: Record<string, string | number | boolean> = {
    pais: 'Totales',
    isTotal: true,
  }
  monthTotals.forEach((v, i) => {
    totalesRow[`m${i}`] = formatCell(v)
  })

  const pctRow: Record<string, string | number | boolean> = { pais: '%' }
  monthTotals.forEach((v, i) => {
    const pct = grand > 0 ? (v / grand) * 100 : 0
    pctRow[`m${i}`] = grand > 0
      ? pct.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'
      : '0,00%'
  })

  return { rows: [...countryRows, totalesRow, pctRow], grandTotal: grand, monthTotals }
}

export function ProyeccionesDesembolsosSlide({
  eyebrow = '2 · CARTERA',
  title = 'Proyecciones de Desembolsos',
  description = 'Programación mensual 2026 por riesgo soberano y no soberano.',
}: ProyeccionesDesembolsosSlideProps = {}) {
  const gs = buildRows(GS_DATA)
  const sns = buildRows(SNS_DATA)
  const combinedTotal = gs.grandTotal + sns.grandTotal

  return (
    <div className="debt-sources debt-sources--stacked">
      <div className="debt-sources__header">
        <div className="debt-sources__header-text">
          <TextCard eyebrow={eyebrow} title={title} description={description} />
        </div>
        <Card padding="md" className="debt-sources__value-card">
          <span className="debt-sources__value-label">Total Proyectado 2026</span>
          <span className="debt-sources__value-number">
            {nfMillions2.format(combinedTotal / 1_000_000)}
          </span>
          <span className="debt-sources__value-unit">USD MM</span>
          <span className="debt-sources__value-detail">
            Garantía Soberana <strong>{nfMillions2.format(gs.grandTotal / 1_000_000)}</strong>
          </span>
          <span className="debt-sources__value-detail">
            Sin Garantía Soberana <strong>{nfMillions2.format(sns.grandTotal / 1_000_000)}</strong>
          </span>
        </Card>
      </div>
      <div className="debt-sources__tables debt-sources__tables--stacked">
        <TableCard
          title="Garantía Soberana"
          columns={buildColumns()}
          rows={gs.rows}
          headerRight={
            <>
              <span className="proyecciones-legend">
                <span className="proyecciones-legend__chip proyecciones-legend__chip--ejecutado" />
                Ejecutado
                <span className="proyecciones-legend__chip proyecciones-legend__chip--proyectado" />
                Proyectado
              </span>
              <span>
                Total: <strong>{nfMillions.format(gs.grandTotal / 1_000_000)} M USD</strong>
              </span>
            </>
          }
        />
        <TableCard
          title="Sin Garantía Soberana"
          columns={buildColumns()}
          rows={sns.rows}
          headerRight={
            <span>
              Total: <strong>{nfMillions.format(sns.grandTotal / 1_000_000)} M USD</strong>
            </span>
          }
        />
      </div>
    </div>
  )
}
