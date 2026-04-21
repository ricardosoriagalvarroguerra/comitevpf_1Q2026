import { TextCard } from '@/components/cards/TextCard'
import { TableCard } from '@/components/cards/TableCard'
import { Card } from '@/components/ui/Card'
import './DebtSourcesSlide.css'

const ifdColumns = [
  { key: 'n', label: '#', align: 'center' as const, width: '36px' },
  { key: 'instrumento', label: 'Instrumento', align: 'left' as const },
  { key: 'circulante', label: 'Circulante', align: 'center' as const },
  { key: 'disponible', label: 'Disponible', align: 'center' as const },
  { key: 'total', label: 'Total', align: 'center' as const },
  { key: 'spread', label: 'Spread (bps)', align: 'center' as const },
]

const ifdRows = [
  { n: 1, instrumento: 'BID 1 - Desembolso 1', circulante: '23.80', disponible: '0.00', total: '23.80', spread: '121.00' },
  { n: 2, instrumento: 'AFD 1 - Desembolso 1', circulante: '3.41', disponible: '0.00', total: '3.41', spread: '179.83' },
  { n: 3, instrumento: 'BID 1 - Desembolso 2', circulante: '21.80', disponible: '0.00', total: '21.80', spread: '121.00' },
  { n: 4, instrumento: 'ICO 1', circulante: '1.11', disponible: '0.00', total: '1.11', spread: '87.83' },
  { n: 5, instrumento: 'BID 1 - Desembolso 3', circulante: '5.58', disponible: '0.00', total: '5.58', spread: '121.00' },
  { n: 6, instrumento: 'BEI 1', circulante: '5.57', disponible: '0.00', total: '5.57', spread: '106.03' },
  { n: 7, instrumento: 'AFD 1 - Desembolso 2', circulante: '10.23', disponible: '0.00', total: '10.23', spread: '179.83' },
  { n: 8, instrumento: 'BID 1 - Desembolso 4', circulante: '23.70', disponible: '0.00', total: '23.70', spread: '121.00' },
  { n: 9, instrumento: 'BID 1 - Desembolso 5', circulante: '6.56', disponible: '0.00', total: '6.56', spread: '121.00' },
  { n: 10, instrumento: 'BID 1 - Desembolso 6', circulante: '3.56', disponible: '0.00', total: '3.56', spread: '120.00' },
  { n: 11, instrumento: 'BEI 2', circulante: '6.00', disponible: '0.00', total: '6.00', spread: '95.03' },
  { n: 12, instrumento: 'BEI 3', circulante: '10.00', disponible: '0.00', total: '10.00', spread: '87.23' },
  { n: 13, instrumento: 'ICO 2 - Tramo 1', circulante: '6.40', disponible: '0.00', total: '6.40', spread: '96.00' },
  { n: 14, instrumento: 'ICO 2 - Tramo 2', circulante: '5.50', disponible: '0.00', total: '5.50', spread: '101.00' },
  { n: 15, instrumento: 'BEI 4', circulante: '20.00', disponible: '0.00', total: '20.00', spread: '81.30' },
  { n: 16, instrumento: 'BID 2 - Desembolso 1', circulante: '18.40', disponible: '0.00', total: '18.40', spread: '121.00' },
  { n: 17, instrumento: 'AFD 2 - Desembolso 1', circulante: '8.52', disponible: '0.00', total: '8.52', spread: '144.25' },
  { n: 18, instrumento: 'BEI 5', circulante: '18.00', disponible: '0.00', total: '18.00', spread: '93.10' },
  { n: 19, instrumento: 'KfW - Desembolso 1', circulante: '22.77', disponible: '0.00', total: '22.77', spread: '101.12' },
  { n: 20, instrumento: 'BID 2 - Desembolso 2', circulante: '12.52', disponible: '0.00', total: '12.52', spread: '121.00' },
  { n: 21, instrumento: 'BID 2 - Desembolso 3', circulante: '7.05', disponible: '0.00', total: '7.05', spread: '121.00' },
  { n: 22, instrumento: 'CAF 3 - Tramo 1', circulante: '75.00', disponible: '0.00', total: '75.00', spread: '175.00' },
  { n: 23, instrumento: 'CDP', circulante: '27.50', disponible: '0.00', total: '27.50', spread: '130.00' },
  { n: 24, instrumento: 'BID 2 - Desembolso 4', circulante: '5.68', disponible: '0.00', total: '5.68', spread: '121.00' },
  { n: 25, instrumento: 'AFD 2 - Desembolso 2', circulante: '24.58', disponible: '0.00', total: '24.58', spread: '116.40' },
  { n: 26, instrumento: 'KfW - Desembolso 2', circulante: '10.95', disponible: '0.00', total: '10.95', spread: '78.50' },
  { n: 27, instrumento: 'BID 2 - Desembolso 5', circulante: '34.14', disponible: '0.00', total: '34.14', spread: '121.00' },
  { n: 28, instrumento: 'CAF 3 - Tramo 2', circulante: '50.00', disponible: '0.00', total: '50.00', spread: '135.00' },
  { n: 29, instrumento: 'BID 2 - Desembolso 6', circulante: '11.38', disponible: '0.00', total: '11.38', spread: '121.00' },
  { n: 30, instrumento: 'ICO 3 - Tramo 1', circulante: '17.78', disponible: '0.00', total: '17.78', spread: '88.00' },
  { n: 31, instrumento: 'KfW - Desembolso 3', circulante: '6.40', disponible: '0.00', total: '6.40', spread: '83.05' },
  { n: 32, instrumento: 'BID 2 - Desembolso 7', circulante: '10.83', disponible: '0.00', total: '10.83', spread: '121.00' },
  { n: '', instrumento: '— Contratado No Desembolsado —', circulante: '', disponible: '', total: '', spread: '', isSection: true },
  { n: 33, instrumento: 'CDP 2', circulante: '0.00', disponible: '50.00', total: '50.00', spread: 'n/a' },
  { n: 34, instrumento: 'CAF 3', circulante: '0.00', disponible: '25.00', total: '25.00', spread: 'n/a' },
  { n: 35, instrumento: 'ICO 3', circulante: '0.00', disponible: '7.20', total: '7.20', spread: 'n/a' },
  { n: '', instrumento: 'TOTAL', circulante: '514.70', disponible: '82.20', total: '596.90', spread: '124.80', isTotal: true },
]

const mercadoColumns = [
  { key: 'n', label: '#', align: 'center' as const, width: '36px' },
  { key: 'instrumento', label: 'Instrumento', align: 'left' as const },
  { key: 'monto', label: 'Monto (USD MM)', align: 'center' as const },
  { key: 'spread', label: 'Spread (bps)', align: 'center' as const },
]

const mercadoRows = [
  { n: 1, instrumento: 'BBVA 1', monto: '16.67', spread: '157.83' },
  { n: 2, instrumento: 'CHF 2026', monto: '222.67', spread: '164.03' },
  { n: 3, instrumento: 'CHF 2028', monto: '164.47', spread: '125.20' },
  { n: 4, instrumento: 'JPY 2028', monto: '22.51', spread: '192.75' },
  { n: 5, instrumento: 'JPY 2029', monto: '31.51', spread: '205.50' },
  { n: 6, instrumento: 'CHF 2027', monto: '158.57', spread: '189.75' },
  { n: 7, instrumento: 'JPY 2027', monto: '40.17', spread: '166.40' },
  { n: 8, instrumento: 'JPY 2029 - 2', monto: '7.01', spread: '188.40' },
  { n: 9, instrumento: 'CHF 2029', monto: '152.94', spread: '202.90' },
  { n: 10, instrumento: 'BBVA 2', monto: '125.00', spread: '172.37' },
  { n: 11, instrumento: 'MTN 1', monto: '40.00', spread: '130.00' },
  { n: 12, instrumento: 'MTN 2', monto: '40.00', spread: '145.00' },
  { n: 13, instrumento: 'MTN 3', monto: '50.00', spread: '145.00' },
  { n: 14, instrumento: 'MTN 4.1', monto: '30.00', spread: '136.50' },
  { n: 15, instrumento: 'MTN 4.2', monto: '50.00', spread: '145.80' },
  { n: 16, instrumento: 'MTN 5', monto: '50.00', spread: '167.70' },
  { n: 17, instrumento: 'MTN 6', monto: '50.00', spread: '135.00' },
  { n: 18, instrumento: 'MTN 7', monto: '100.00', spread: '135.00' },
  { n: 19, instrumento: 'MTN 8.1', monto: '35.00', spread: '178.40' },
  { n: 20, instrumento: 'MTN 8.2', monto: '25.12', spread: '180.00' },
  { n: 21, instrumento: 'MTN 9', monto: '20.39', spread: '112.50' },
  { n: 22, instrumento: 'MTN 10', monto: '30.00', spread: '130.00' },
  { n: 23, instrumento: 'MTN 11 (INR - DB)', monto: '101.47', spread: '130.00' },
  { n: '', instrumento: 'TOTAL', monto: '1,563.49', spread: '159.68', isTotal: true },
]

const IFD_CIRCULANTE_TOTAL = 514.70
const MERCADO_TOTAL = 1563.49
const DEUDA_TOTAL = IFD_CIRCULANTE_TOTAL + MERCADO_TOTAL

const nfAmount = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
})

interface DebtSourcesSlideProps {
  eyebrow?: string
  title?: string
  description?: string
}

export function DebtSourcesSlide({
  eyebrow = '4 · ENDEUDAMIENTO',
  title = 'Endeudamiento por Instrumento',
  description = 'USD Millones',
}: DebtSourcesSlideProps = {}) {
  return (
    <div className="debt-sources">
      <div className="debt-sources__header">
        <div className="debt-sources__header-text">
          <TextCard
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </div>
        <Card padding="md" className="debt-sources__value-card">
          <span className="debt-sources__value-label">Total Deuda</span>
          <span className="debt-sources__value-number">
            {nfAmount.format(DEUDA_TOTAL)}
          </span>
          <span className="debt-sources__value-unit">USD MM</span>
          <span className="debt-sources__value-detail">
            IFD Circulante <strong>{nfAmount.format(IFD_CIRCULANTE_TOTAL)}</strong>
          </span>
          <span className="debt-sources__value-detail">
            Mercado <strong>{nfAmount.format(MERCADO_TOTAL)}</strong>
          </span>
        </Card>
      </div>
      <div className="debt-sources__tables debt-sources__tables--dual">
        <TableCard
          title="IFD"
          columns={ifdColumns}
          rows={ifdRows}
          className="debt-sources__table-scroll"
        />
        <TableCard
          title="Mercado"
          columns={mercadoColumns}
          rows={mercadoRows}
          className="debt-sources__table-scroll"
        />
      </div>
    </div>
  )
}
