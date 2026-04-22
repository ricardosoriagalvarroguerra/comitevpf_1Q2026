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

const MESES_2027 = ['Enero 2027', 'Febrero 2027', 'Marzo 2027']

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

const GS_2027_Q1: Record<string, number[]> = {
  Argentina: [0, 17000000, 0],
  Bolivia:   [0, 5000000, 0],
  Brasil:    [0, 5209401, 4000000],
  Paraguay:  [0, 0, 0],
  Uruguay:   [0, 0, 0],
}

const GS_RESTANTE_2027: Record<string, number> = {
  Argentina: 140899899,
  Bolivia:   167125802,
  Brasil:    143279992,
  Paraguay:  94472337,
  Uruguay:   49540000,
}

const SNS_DATA: Record<string, number[]> = {
  Argentina: Array(12).fill(0),
  Bolivia: Array(12).fill(0),
  Brasil: [0, 0, 0, 0, 55_000_000, 0, 0, 0, 0, 0, 0, 0],
  Paraguay: Array(12).fill(0),
  Uruguay: Array(12).fill(0),
}

const SNS_2027_Q1: Record<string, number[]> = {
  Argentina: [0, 0, 0],
  Bolivia: [0, 0, 0],
  Brasil: [0, 0, 0],
  Paraguay: [0, 0, 0],
  Uruguay: [0, 0, 0],
}

const SNS_RESTANTE_2027: Record<string, number> = {
  Argentina: 0,
  Bolivia: 0,
  Brasil: 0,
  Paraguay: 0,
  Uruguay: 0,
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
    {
      key: 'total' as const,
      label: 'Total 2026',
      align: 'right' as const,
      className: 'month-cell month-cell--total',
    },
    ...MESES_2027.map((m, i) => ({
      key: `y27m${i}` as const,
      label: m,
      align: 'right' as const,
      className: `month-cell month-cell--proyectado${i === 0 ? ' month-cell--boundary' : ''}`,
    })),
    {
      key: 'restante2027' as const,
      label: 'Restante 2027',
      align: 'right' as const,
      className: 'month-cell month-cell--proyectado',
    },
    {
      key: 'total2027' as const,
      label: 'Total 2027',
      align: 'right' as const,
      className: 'month-cell month-cell--total',
    },
  ]
}

function formatCell(n: number) {
  const inMillions = n / 1_000_000
  return n === 0 ? '0' : nfMillions.format(inMillions)
}

function buildRows(
  data: Record<string, number[]>,
  data2027Q1: Record<string, number[]>,
  restante2027: Record<string, number>,
) {
  const countries = Object.keys(data)
  const monthTotals = MESES.map((_, i) =>
    countries.reduce((s, c) => s + (data[c]?.[i] ?? 0), 0),
  )
  const grand = monthTotals.reduce((s, v) => s + v, 0)

  const q1Totals = MESES_2027.map((_, i) =>
    countries.reduce((s, c) => s + (data2027Q1[c]?.[i] ?? 0), 0),
  )
  const restanteTotal = countries.reduce((s, c) => s + (restante2027[c] ?? 0), 0)
  const total2027Grand =
    q1Totals.reduce((s, v) => s + v, 0) + restanteTotal

  const countryRows = countries.map((c) => {
    const row: Record<string, string | number | boolean> = { pais: c }
    const rowTotal = data[c].reduce((s, v) => s + v, 0)
    data[c].forEach((v, i) => {
      row[`m${i}`] = formatCell(v)
    })
    row.total = formatCell(rowTotal)
    const q1 = data2027Q1[c] ?? [0, 0, 0]
    q1.forEach((v, i) => {
      row[`y27m${i}`] = formatCell(v)
    })
    const rest = restante2027[c] ?? 0
    row.restante2027 = formatCell(rest)
    const total2027 = q1.reduce((s, v) => s + v, 0) + rest
    row.total2027 = formatCell(total2027)
    return row
  })

  const totalesRow: Record<string, string | number | boolean> = {
    pais: 'Totales',
    isTotal: true,
  }
  monthTotals.forEach((v, i) => {
    totalesRow[`m${i}`] = formatCell(v)
  })
  totalesRow.total = formatCell(grand)
  q1Totals.forEach((v, i) => {
    totalesRow[`y27m${i}`] = formatCell(v)
  })
  totalesRow.restante2027 = formatCell(restanteTotal)
  totalesRow.total2027 = formatCell(total2027Grand)

  const pctRow: Record<string, string | number | boolean> = { pais: '%' }
  monthTotals.forEach((v, i) => {
    const pct = grand > 0 ? (v / grand) * 100 : 0
    pctRow[`m${i}`] = grand > 0
      ? pct.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'
      : '0,00%'
  })
  pctRow.total = grand > 0 ? '100,00%' : '0,00%'
  q1Totals.forEach((v, i) => {
    const pct = total2027Grand > 0 ? (v / total2027Grand) * 100 : 0
    pctRow[`y27m${i}`] = total2027Grand > 0
      ? pct.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'
      : '0,00%'
  })
  const restPct = total2027Grand > 0 ? (restanteTotal / total2027Grand) * 100 : 0
  pctRow.restante2027 = total2027Grand > 0
    ? restPct.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'
    : '0,00%'
  pctRow.total2027 = total2027Grand > 0 ? '100,00%' : '0,00%'

  return { rows: [...countryRows, totalesRow, pctRow], grandTotal: grand, monthTotals, total2027Grand }
}

export function ProyeccionesDesembolsosSlide({
  eyebrow = '2 · CARTERA',
  title = 'Proyecciones de Desembolsos',
  description = 'Programación mensual 2026 por riesgo soberano y no soberano.',
}: ProyeccionesDesembolsosSlideProps = {}) {
  const gs = buildRows(GS_DATA, GS_2027_Q1, GS_RESTANTE_2027)
  const sns = buildRows(SNS_DATA, SNS_2027_Q1, SNS_RESTANTE_2027)
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
