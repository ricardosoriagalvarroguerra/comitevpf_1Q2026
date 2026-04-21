import { TextCard } from '@/components/cards/TextCard'
import { ChartPlaceholder } from '@/components/cards/ChartPlaceholder'
import { Card } from '@/components/ui/Card'
import './PrevisionSlide.css'

interface PrevisionRow {
  code: string
  pais: string
  carteraDic: string
  carteraMar: string
  carteraVar: string
  moodys: string
  sp: string
  fitch: string
  pct: string
  prevDic: string
  prevMar: string
  prevVar: string
  prevK: string
  kind?: 'subtotal' | 'total'
}

const ROWS: PrevisionRow[] = [
  { code: 'ARG', pais: 'ARGENTINA', carteraDic: '598,8', carteraMar: '597,1', carteraVar: '-1,7', moodys: 'Caa1', sp: 'CCC+', fitch: 'CCC+', pct: 'B+', prevDic: '6,2', prevMar: '6,2', prevVar: '0,0', prevK: '10,5' },
  { code: 'BOL', pais: 'BOLIVIA', carteraDic: '431,7', carteraMar: '446,5', carteraVar: '14,8', moodys: 'Caa3', sp: 'CCC+', fitch: 'CCC', pct: 'B', prevDic: '7,8', prevMar: '6,3', prevVar: '-1,5', prevK: '14,0' },
  { code: 'BRA', pais: 'BRASIL', carteraDic: '379,0', carteraMar: '386,4', carteraVar: '7,4', moodys: 'Ba1', sp: 'BB', fitch: 'BB', pct: 'BBB', prevDic: '0,7', prevMar: '0,7', prevVar: '0,0', prevK: '1,9' },
  { code: 'PAR', pais: 'PARAGUAY', carteraDic: '455,7', carteraMar: '464,6', carteraVar: '9,0', moodys: 'Baa3', sp: 'BBB-', fitch: 'BB+', pct: 'A-', prevDic: '0,1', prevMar: '0,1', prevVar: '0,0', prevK: '0,3' },
  { code: 'URU', pais: 'URUGUAY', carteraDic: '598,8', carteraMar: '606,7', carteraVar: '7,9', moodys: 'Baa1', sp: 'BBB+', fitch: 'BBB', pct: 'A+', prevDic: '1,9', prevMar: '1,9', prevVar: '0,0', prevK: '3,1' },
  { code: 'SOB', pais: 'Soberano', carteraDic: '2.464,1', carteraMar: '2.501,4', carteraVar: '37,3', moodys: '—', sp: '—', fitch: '—', pct: '—', prevDic: '16,8', prevMar: '15,2', prevVar: '-1,5', prevK: '6,1', kind: 'subtotal' },
  { code: 'BADESUL', pais: 'BADESUL', carteraDic: '30,0', carteraMar: '28,3', carteraVar: '-1,7', moodys: '—', sp: 'BB', fitch: '—', pct: 'BB+', prevDic: '0,4', prevMar: '0,4', prevVar: '0,0', prevK: '13,3' },
  { code: 'BDMG', pais: 'BDMG', carteraDic: '34,0', carteraMar: '31,2', carteraVar: '-2,8', moodys: '—', sp: 'BB-', fitch: '—', pct: 'BB', prevDic: '0,7', prevMar: '0,6', prevVar: '-0,1', prevK: '19,5' },
  { code: 'CASAN', pais: 'CASAN', carteraDic: '55,0', carteraMar: '55,0', carteraVar: '0,0', moodys: '—', sp: 'B+', fitch: '—', pct: 'BB-', prevDic: '1,9', prevMar: '1,9', prevVar: '0,0', prevK: '35,3' },
  { code: 'BNF', pais: 'BNF', carteraDic: '7,5', carteraMar: '6,0', carteraVar: '-1,5', moodys: '—', sp: 'BB', fitch: '—', pct: 'BB+', prevDic: '0,1', prevMar: '0,1', prevVar: '0,0', prevK: '13,3' },
  { code: 'NS', pais: 'No Soberano', carteraDic: '126,5', carteraMar: '120,5', carteraVar: '-6,0', moodys: '—', sp: '—', fitch: '—', pct: '—', prevDic: '3,1', prevMar: '3,0', prevVar: '-0,1', prevK: '24,9', kind: 'subtotal' },
  { code: 'TOTAL', pais: 'Total', carteraDic: '2.590,6', carteraMar: '2.621,9', carteraVar: '31,3', moodys: '—', sp: '—', fitch: '—', pct: '—', prevDic: '19,9', prevMar: '18,2', prevVar: '-1,6', prevK: '7,0', kind: 'total' },
]

const RATIO_LABELS = ['Dic-20', 'Dic-21', 'Dic-22', 'Dic-23', 'Dic-24', 'Dic-25', 'Mar-26']
const RATIO_VALUES = [0.78, 0.81, 0.77, 1.03, 0.92, 0.77, 0.70]

export function PrevisionSlide() {
  return (
    <div className="prevision-slide">
      <TextCard
        eyebrow="3 · MONITOREO DE RIESGOS"
        title="Previsión para Pérdida de Cartera de Préstamos"
        description="Cartera bruta, calificación y previsión por país · USD Millones"
      />

      <Card padding="none" className="table-card prevision-slide__table">
        <div className="table-card__body prevision-slide__table-body">
          <table className="table-card__table prevision-slide__tbl">
            <thead>
              <tr className="prevision-slide__group-row">
                <th rowSpan={2} className="table-card__th prevision-slide__sticky-col">País</th>
                <th colSpan={3} className="table-card__th prevision-slide__group">Cartera bruta</th>
                <th colSpan={4} className="table-card__th prevision-slide__group">Calificación al 31/3/2026</th>
                <th colSpan={3} className="table-card__th prevision-slide__group">Previsión</th>
                <th rowSpan={2} className="table-card__th prevision-slide__group">Prev. c/ USD 1.000</th>
              </tr>
              <tr>
                <th className="table-card__th">31/12/25</th>
                <th className="table-card__th">31/3/26</th>
                <th className="table-card__th">Var.</th>
                <th className="table-card__th">Moody&apos;s</th>
                <th className="table-card__th">S&amp;P</th>
                <th className="table-card__th">Fitch</th>
                <th className="table-card__th">Rating c/ PCT</th>
                <th className="table-card__th">31/12/25</th>
                <th className="table-card__th">31/3/26</th>
                <th className="table-card__th">Var.</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr
                  key={r.code}
                  className={`table-card__tr prevision-slide__tr ${
                    r.kind === 'total' ? 'table-card__tr--total' : ''
                  } ${r.kind === 'subtotal' ? 'prevision-slide__tr--subtotal' : ''}`}
                >
                  <td className="table-card__td prevision-slide__sticky-col">
                    <span className="prevision-slide__code">{r.code}</span>
                    <span className="prevision-slide__pais">{r.pais}</span>
                  </td>
                  <td className="table-card__td prevision-slide__num">{r.carteraDic}</td>
                  <td className="table-card__td prevision-slide__num">{r.carteraMar}</td>
                  <td className={`table-card__td prevision-slide__num ${varClass(r.carteraVar)}`}>{r.carteraVar}</td>
                  <td className="table-card__td prevision-slide__rating">{r.moodys}</td>
                  <td className="table-card__td prevision-slide__rating">{r.sp}</td>
                  <td className="table-card__td prevision-slide__rating">{r.fitch}</td>
                  <td className="table-card__td prevision-slide__rating">{r.pct}</td>
                  <td className="table-card__td prevision-slide__num">{r.prevDic}</td>
                  <td className="table-card__td prevision-slide__num">{r.prevMar}</td>
                  <td className={`table-card__td prevision-slide__num ${varClass(r.prevVar)}`}>{r.prevVar}</td>
                  <td className="table-card__td prevision-slide__num">{r.prevK}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="prevision-slide__chart">
        <ChartPlaceholder
          title="Ratio Previsión / Cartera por cobrar"
          subtitle="Evolución trimestral"
          chartType="line"
          unit="%"
          height="full"
          data={{
            labels: RATIO_LABELS,
            series: [
              {
                name: 'Ratio',
                values: RATIO_VALUES,
                color: 'var(--color-accent)',
              },
            ],
          }}
        />
      </div>
    </div>
  )
}

function varClass(v: string): string {
  if (v.startsWith('-')) return 'prevision-slide__num--neg'
  if (v === '0,0') return 'prevision-slide__num--zero'
  return 'prevision-slide__num--pos'
}
