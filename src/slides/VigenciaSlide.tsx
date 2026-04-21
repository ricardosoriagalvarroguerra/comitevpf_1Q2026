import { TextCard } from '@/components/cards/TextCard'
import { TableCard } from '@/components/cards/TableCard'
import './VigenciaSlide.css'

const etapaColumns = [
  { key: 'codigo', label: 'Código', align: 'left' as const },
  { key: 'nombre', label: 'Nombre', align: 'left' as const },
  { key: 'monto', label: 'Monto (USD MM)', align: 'center' as const },
  { key: 'previsibilidad', label: 'Previsibilidad', align: 'center' as const },
]

const etapaRows = [
  { codigo: 'ARG-65/2025 II', nombre: 'AGUA POTABLE MENDOZA', monto: '25,00', previsibilidad: '' },
  { codigo: 'ARG-65/2025 III', nombre: 'AGUA POTABLE MENDOZA', monto: '25,00', previsibilidad: '' },
  { codigo: 'BOL-38/2024 II', nombre: 'GENERACIÓN EMPLEO IV', monto: '50,00', previsibilidad: '' },
  { codigo: 'BOL-39/2024 II', nombre: 'INFRAESTRUCTURA COMPLEMENTARIA', monto: '25,00', previsibilidad: '' },
  { codigo: 'PAR-27/2019 II', nombre: 'YPEJHÚ', monto: '90,00', previsibilidad: '' },
  { codigo: 'PAR-28/2020 II', nombre: 'BIOCEÁNICO', monto: '110,00', previsibilidad: <strong>A</strong> },
  { codigo: 'PAR-28/2020 III', nombre: 'BIOCEÁNICO', monto: '110,00', previsibilidad: '' },
  { codigo: 'URU-25/2024 II', nombre: 'UNIVERSALIZACIÓN DEL SANEAMIENTO', monto: '120,00', previsibilidad: <strong>A</strong> },
  { codigo: 'URU-25/2024 III', nombre: 'UNIVERSALIZACIÓN DEL SANEAMIENTO', monto: '125,00', previsibilidad: '' },
  { codigo: 'URU-25/2024 IV', nombre: 'UNIVERSALIZACIÓN DEL SANEAMIENTO', monto: '20,00', previsibilidad: '' },
  { codigo: 'URU-26/2024 II', nombre: 'CAJA BANCARIA', monto: '25,00', previsibilidad: '' },
  { codigo: 'URU-27/2024 II', nombre: 'SANEAMIENTO MALDONADO', monto: '22,54', previsibilidad: <strong>A</strong> },
  { codigo: 'URU-27/2024 III', nombre: 'SANEAMIENTO MALDONADO', monto: '14,41', previsibilidad: '' },
  { codigo: 'URU-27/2024 IV', nombre: 'SANEAMIENTO MALDONADO', monto: '5,09', previsibilidad: '' },
]

const aprobadaColumns = [
  { key: 'codigo', label: 'Código', align: 'left' as const },
  { key: 'nombre', label: 'Nombre', align: 'left' as const },
  { key: 'monto', label: 'Monto (USD MM)', align: 'center' as const },
  { key: 'previsibilidad', label: 'Previsibilidad', align: 'center' as const },
]

const aprobadaRows = [
  { codigo: 'ARG-064#1', nombre: 'BIOCEÁNICO SALTA', monto: '35,00', previsibilidad: '' },
  { codigo: 'ARG-066#1', nombre: 'INFRAESTRUCTURA PRIORITARIA CHACO', monto: '30,00', previsibilidad: '' },
  { codigo: 'BOL-038#1', nombre: 'GENERACIÓN EMPLEO IV', monto: '50,00', previsibilidad: '' },
  { codigo: 'BRA-041#1', nombre: 'FLORIANÓPOLIS', monto: '50,00', previsibilidad: '' },
  { codigo: 'BRA-045#1', nombre: 'ITAPEVI', monto: '28,80', previsibilidad: '' },
  { codigo: 'BRA-047#1', nombre: 'PRODESAN PARA LAGOS - COSANPA', monto: '50,00', previsibilidad: '' },
  { codigo: 'BRA-050#1', nombre: 'MOVILIDAD Y DRENAJE PROMOD', monto: '50,00', previsibilidad: '' },
  { codigo: 'BRA-051#1', nombre: 'PETROLINA', monto: '20,00', previsibilidad: '' },
]

const TOTAL_ETAPA = 767.04
const TOTAL_APROBADA = 313.80

const nfAmount = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
})

function TotalBadge({ value }: { value: number }) {
  return (
    <span className="vigencia-slide__total-badge">
      <span className="vigencia-slide__total-label">Total</span>
      <strong className="vigencia-slide__total-value">{nfAmount.format(value)}</strong>
      <span className="vigencia-slide__total-unit">USD MM</span>
    </span>
  )
}

export function VigenciaSlide() {
  return (
    <div className="vigencia-slide">
      <div className="vigencia-slide__text">
        <TextCard
          eyebrow="Vigencia y activación"
          title="Vigencia y Activación Esperada"
          description="Proyectos en etapas pendientes de activación y aprobados no vigentes."
        />
      </div>
      <div className="vigencia-slide__tables">
        <TableCard
          title="Etapas Pendientes de Activación"
          columns={etapaColumns}
          rows={etapaRows}
          headerRight={<TotalBadge value={TOTAL_ETAPA} />}
          className="vigencia-slide__table"
        />
        <TableCard
          title="Aprobadas no Vigentes"
          columns={aprobadaColumns}
          rows={aprobadaRows}
          headerRight={<TotalBadge value={TOTAL_APROBADA} />}
          className="vigencia-slide__table"
        />
      </div>
    </div>
  )
}
