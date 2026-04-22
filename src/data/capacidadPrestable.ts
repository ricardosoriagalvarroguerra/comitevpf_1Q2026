export type CapacidadCountry = 'ARG' | 'BOL' | 'BRA' | 'PAR' | 'URU' | 'RNS'

export interface CapacidadPeriod {
  period: string
  utilizadaPorPais: Record<CapacidadCountry, number>
  utilizadaTotal: number
  patrimonio: number
  capacidadMax: number
  maxPorPais: number
  maxRNS: number
}

export const CAPACIDAD_PRESTABLE: CapacidadPeriod[] = [
  {
    period: 'Q1-2026',
    utilizadaPorPais: { ARG: 726.0, BOL: 620.5, BRA: 1117.7, PAR: 578.5, URU: 647.3, RNS: 150.5 },
    utilizadaTotal: 3840.6,
    patrimonio: 1875.9,
    capacidadMax: 5627.8,
    maxPorPais: 1406.9,
    maxRNS: 337.7,
  },
  {
    period: 'Q2-2026',
    utilizadaPorPais: { ARG: 804.5, BOL: 609.0, BRA: 1277.1, PAR: 574.6, URU: 642.3, RNS: 201.7 },
    utilizadaTotal: 4109.1,
    patrimonio: 1895.5,
    capacidadMax: 5686.5,
    maxPorPais: 1421.6,
    maxRNS: 341.2,
  },
  {
    period: 'Q3-2026',
    utilizadaPorPais: { ARG: 835.5, BOL: 606.1, BRA: 1299.6, PAR: 554.6, URU: 632.4, RNS: 231.3 },
    utilizadaTotal: 4159.4,
    patrimonio: 1919.1,
    capacidadMax: 5757.3,
    maxPorPais: 1439.3,
    maxRNS: 345.4,
  },
  {
    period: 'Q4-2026',
    utilizadaPorPais: { ARG: 825.9, BOL: 676.7, BRA: 1325.8, PAR: 660.7, URU: 750.3, RNS: 229.2 },
    utilizadaTotal: 4468.6,
    patrimonio: 1953.1,
    capacidadMax: 5859.4,
    maxPorPais: 1464.9,
    maxRNS: 351.6,
  },
  {
    period: 'Q1-2027',
    utilizadaPorPais: { ARG: 903.9, BOL: 669.0, BRA: 1317.6, PAR: 635.9, URU: 737.6, RNS: 249.2 },
    utilizadaTotal: 4513.1,
    patrimonio: 1976.4,
    capacidadMax: 5929.1,
    maxPorPais: 1482.3,
    maxRNS: 355.7,
  },
]
