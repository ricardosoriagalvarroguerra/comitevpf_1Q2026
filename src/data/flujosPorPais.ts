// Flujos por país — valores en USD Millones, anuales + 1Q-2026
// Agrupa intereses = intereses + intereses_focom + intereses_linea_verde
// Agrupa comisiones = comision_adm + comision_compromiso + comision_gestion
// Combina SOB + NO_SOB por país y año.

export type FlujoPais = 'ARG' | 'BOL' | 'BRA' | 'PAR' | 'URU' | 'GENERAL'

export interface FlujoRow {
  pais: FlujoPais
  anio: string // '2015' ... '2025' | '1Q-2026'
  desembolsos: number
  amortizacion: number
  intereses: number
  comisiones: number
  aporteVoluntario: number
  compensacionReservaCredito: number
  servicioPagoCuenta: number
  mora: number
  flujoNeto: number
}

// Años cubiertos (asegura misma escala x)
export const FLUJO_PERIODOS = [
  '2015', '2016', '2017', '2018', '2019', '2020',
  '2021', '2022', '2023', '2024', '2025', '1Q-2026',
] as const

export const FLUJO_PAISES: { id: FlujoPais; label: string }[] = [
  { id: 'GENERAL', label: 'General' },
  { id: 'ARG', label: 'Argentina' },
  { id: 'BOL', label: 'Bolivia' },
  { id: 'BRA', label: 'Brasil' },
  { id: 'PAR', label: 'Paraguay' },
  { id: 'URU', label: 'Uruguay' },
]

export const FLUJOS_DATA: FlujoRow[] = [
  // ── ARGENTINA ──
  { pais: 'ARG', anio: '2015', desembolsos: 40.206, amortizacion: 11.755, intereses: 1.837, comisiones: 1.067, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 25.548 },
  { pais: 'ARG', anio: '2016', desembolsos: 10.425, amortizacion: 11.575, intereses: 2.821, comisiones: 1.073, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -5.044 },
  { pais: 'ARG', anio: '2017', desembolsos: 44.508, amortizacion: 10.338, intereses: 3.426, comisiones: 1.183, aporteVoluntario: 0, compensacionReservaCredito: 0.022, servicioPagoCuenta: 0, mora: 0, flujoNeto: 29.540 },
  { pais: 'ARG', anio: '2018', desembolsos: 65.627, amortizacion: 13.207, intereses: 5.551, comisiones: 1.967, aporteVoluntario: 0, compensacionReservaCredito: 0.155, servicioPagoCuenta: -0.018, mora: 0, flujoNeto: 44.765 },
  { pais: 'ARG', anio: '2019', desembolsos: 87.382, amortizacion: 17.369, intereses: 9.609, comisiones: 1.952, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 58.450 },
  { pais: 'ARG', anio: '2020', desembolsos: 104.814, amortizacion: 18.782, intereses: 9.724, comisiones: 2.232, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 74.077 },
  { pais: 'ARG', anio: '2021', desembolsos: 107.948, amortizacion: 27.000, intereses: 9.810, comisiones: 2.111, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 69.028 },
  { pais: 'ARG', anio: '2022', desembolsos: 123.009, amortizacion: 36.356, intereses: 14.466, comisiones: 2.067, aporteVoluntario: 0.030, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 70.091 },
  { pais: 'ARG', anio: '2023', desembolsos: 10.418, amortizacion: 44.263, intereses: 36.503, comisiones: 1.330, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -71.678 },
  { pais: 'ARG', anio: '2024', desembolsos: 250.000, amortizacion: 67.617, intereses: 39.469, comisiones: 2.591, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 140.322 },
  { pais: 'ARG', anio: '2025', desembolsos: 21.594, amortizacion: 64.159, intereses: 46.554, comisiones: 1.113, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -90.232 },
  { pais: 'ARG', anio: '1Q-2026', desembolsos: 30.473, amortizacion: 32.173, intereses: 16.620, comisiones: 0.167, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -18.487 },

  // ── BOLIVIA ──
  { pais: 'BOL', anio: '2015', desembolsos: 43.104, amortizacion: 6.239, intereses: 1.774, comisiones: 1.459, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 33.632 },
  { pais: 'BOL', anio: '2016', desembolsos: 57.648, amortizacion: 7.100, intereses: 2.825, comisiones: 0.544, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 47.179 },
  { pais: 'BOL', anio: '2017', desembolsos: 38.239, amortizacion: 10.762, intereses: 4.821, comisiones: 0.552, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 22.103 },
  { pais: 'BOL', anio: '2018', desembolsos: 82.619, amortizacion: 17.551, intereses: 7.020, comisiones: 1.720, aporteVoluntario: 0, compensacionReservaCredito: 0.003, servicioPagoCuenta: 0, mora: 0, flujoNeto: 56.325 },
  { pais: 'BOL', anio: '2019', desembolsos: 71.178, amortizacion: 19.549, intereses: 10.482, comisiones: 1.206, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 39.941 },
  { pais: 'BOL', anio: '2020', desembolsos: 61.851, amortizacion: 16.099, intereses: 10.780, comisiones: 0.855, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 34.116 },
  { pais: 'BOL', anio: '2021', desembolsos: 44.696, amortizacion: 20.939, intereses: 8.158, comisiones: 0.502, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 15.097 },
  { pais: 'BOL', anio: '2022', desembolsos: 66.225, amortizacion: 26.609, intereses: 10.309, comisiones: 1.244, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 28.062 },
  { pais: 'BOL', anio: '2023', desembolsos: 72.885, amortizacion: 27.023, intereses: 27.092, comisiones: 0.646, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 18.124 },
  { pais: 'BOL', anio: '2024', desembolsos: 32.909, amortizacion: 39.511, intereses: 34.892, comisiones: 0.706, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -42.200 },
  { pais: 'BOL', anio: '2025', desembolsos: 39.716, amortizacion: 40.244, intereses: 32.655, comisiones: 1.120, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0.009, flujoNeto: -34.312 },
  { pais: 'BOL', anio: '1Q-2026', desembolsos: 26.773, amortizacion: 12.006, intereses: 11.197, comisiones: 0.162, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0.018, flujoNeto: 3.390 },

  // ── BRASIL ──
  { pais: 'BRA', anio: '2015', desembolsos: 3.045, amortizacion: 15.405, intereses: 3.302, comisiones: 0.028, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -15.691 },
  { pais: 'BRA', anio: '2016', desembolsos: 0, amortizacion: 14.715, intereses: 3.244, comisiones: 0.005, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0.001, flujoNeto: -17.966 },
  { pais: 'BRA', anio: '2017', desembolsos: 4.561, amortizacion: 14.279, intereses: 3.416, comisiones: 0.280, aporteVoluntario: 0, compensacionReservaCredito: 0.073, servicioPagoCuenta: 0, mora: 0.006, flujoNeto: -13.493 },
  { pais: 'BRA', anio: '2018', desembolsos: 1.539, amortizacion: 12.384, intereses: 3.276, comisiones: 0.195, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0.002, flujoNeto: -14.317 },
  { pais: 'BRA', anio: '2019', desembolsos: 21.009, amortizacion: 9.017, intereses: 3.733, comisiones: 0.746, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0.003, flujoNeto: 7.510 },
  { pais: 'BRA', anio: '2020', desembolsos: 38.438, amortizacion: 6.976, intereses: 3.188, comisiones: 1.527, aporteVoluntario: 0, compensacionReservaCredito: 0.207, servicioPagoCuenta: 0, mora: 0.002, flujoNeto: 26.537 },
  { pais: 'BRA', anio: '2021', desembolsos: 44.173, amortizacion: 6.976, intereses: 3.132, comisiones: 0.830, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 33.235 },
  { pais: 'BRA', anio: '2022', desembolsos: 45.324, amortizacion: 15.575, intereses: 6.795, comisiones: 0.619, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 22.336 },
  { pais: 'BRA', anio: '2023', desembolsos: 109.197, amortizacion: 17.967, intereses: 17.601, comisiones: 3.004, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 70.624 },
  { pais: 'BRA', anio: '2024', desembolsos: 209.112, amortizacion: 41.865, intereses: 31.636, comisiones: 3.684, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 131.925 },
  { pais: 'BRA', anio: '2025', desembolsos: 174.614, amortizacion: 34.017, intereses: 31.918, comisiones: 3.350, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0.010, flujoNeto: 105.317 },
  { pais: 'BRA', anio: '1Q-2026', desembolsos: 14.280, amortizacion: 11.428, intereses: 10.761, comisiones: 0.526, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -8.435 },

  // ── PARAGUAY ──
  { pais: 'PAR', anio: '2015', desembolsos: 22.850, amortizacion: 2.043, intereses: 1.506, comisiones: 0.212, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 19.088 },
  { pais: 'PAR', anio: '2016', desembolsos: 19.416, amortizacion: 2.043, intereses: 2.335, comisiones: 0.562, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 14.476 },
  { pais: 'PAR', anio: '2017', desembolsos: 32.507, amortizacion: 10.823, intereses: 3.376, comisiones: 1.014, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 17.293 },
  { pais: 'PAR', anio: '2018', desembolsos: 23.834, amortizacion: 8.797, intereses: 4.732, comisiones: 0.901, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 9.404 },
  { pais: 'PAR', anio: '2019', desembolsos: 17.188, amortizacion: 7.775, intereses: 6.278, comisiones: 1.484, aporteVoluntario: 0, compensacionReservaCredito: 0.020, servicioPagoCuenta: 0, mora: 0, flujoNeto: 1.632 },
  { pais: 'PAR', anio: '2020', desembolsos: 41.374, amortizacion: 7.629, intereses: 4.931, comisiones: 1.111, aporteVoluntario: 0, compensacionReservaCredito: -0.020, servicioPagoCuenta: 0, mora: 0, flujoNeto: 27.722 },
  { pais: 'PAR', anio: '2021', desembolsos: 104.277, amortizacion: 8.504, intereses: 4.085, comisiones: 1.960, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 89.729 },
  { pais: 'PAR', anio: '2022', desembolsos: 86.435, amortizacion: 19.939, intereses: 10.070, comisiones: 0.899, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 55.527 },
  { pais: 'PAR', anio: '2023', desembolsos: 46.293, amortizacion: 39.139, intereses: 29.790, comisiones: 2.317, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -24.954 },
  { pais: 'PAR', anio: '2024', desembolsos: 88.666, amortizacion: 54.775, intereses: 33.817, comisiones: 3.859, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -3.785 },
  { pais: 'PAR', anio: '2025', desembolsos: 117.099, amortizacion: 57.773, intereses: 30.591, comisiones: 1.443, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 27.292 },
  { pais: 'PAR', anio: '1Q-2026', desembolsos: 27.034, amortizacion: 19.582, intereses: 9.049, comisiones: 0.048, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -1.645 },

  // ── URUGUAY ──
  { pais: 'URU', anio: '2015', desembolsos: 10.106, amortizacion: 0, intereses: 1.985, comisiones: 0.099, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 8.022 },
  { pais: 'URU', anio: '2016', desembolsos: 39.645, amortizacion: 0, intereses: 2.946, comisiones: 0.586, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 36.114 },
  { pais: 'URU', anio: '2017', desembolsos: 51.298, amortizacion: 6.697, intereses: 4.914, comisiones: 0.743, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 38.944 },
  { pais: 'URU', anio: '2018', desembolsos: 22.745, amortizacion: 7.020, intereses: 7.360, comisiones: 0.194, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 8.170 },
  { pais: 'URU', anio: '2019', desembolsos: 17.541, amortizacion: 23.499, intereses: 8.719, comisiones: 0.469, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -15.147 },
  { pais: 'URU', anio: '2020', desembolsos: 73.618, amortizacion: 27.571, intereses: 6.538, comisiones: 0.791, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 38.717 },
  { pais: 'URU', anio: '2021', desembolsos: 44.356, amortizacion: 13.927, intereses: 5.700, comisiones: 0.450, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 24.279 },
  { pais: 'URU', anio: '2022', desembolsos: 43.637, amortizacion: 19.340, intereses: 10.367, comisiones: 0.190, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 13.738 },
  { pais: 'URU', anio: '2023', desembolsos: 112.747, amortizacion: 28.021, intereses: 24.868, comisiones: 0.321, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 59.536 },
  { pais: 'URU', anio: '2024', desembolsos: 227.285, amortizacion: 45.115, intereses: 33.002, comisiones: 1.742, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 147.428 },
  { pais: 'URU', anio: '2025', desembolsos: 101.411, amortizacion: 29.983, intereses: 40.331, comisiones: 0.278, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 30.820 },
  { pais: 'URU', anio: '1Q-2026', desembolsos: 17.835, amortizacion: 9.901, intereses: 12.626, comisiones: 0.065, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: -4.757 },

  // ── GENERAL ──
  { pais: 'GENERAL', anio: '2015', desembolsos: 119.311, amortizacion: 35.442, intereses: 10.404, comisiones: 2.865, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 70.599 },
  { pais: 'GENERAL', anio: '2016', desembolsos: 127.134, amortizacion: 35.433, intereses: 14.171, comisiones: 2.770, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0.001, flujoNeto: 74.759 },
  { pais: 'GENERAL', anio: '2017', desembolsos: 171.113, amortizacion: 52.899, intereses: 19.953, comisiones: 3.772, aporteVoluntario: 0, compensacionReservaCredito: 0.095, servicioPagoCuenta: 0, mora: 0.006, flujoNeto: 94.387 },
  { pais: 'GENERAL', anio: '2018', desembolsos: 196.364, amortizacion: 58.959, intereses: 27.939, comisiones: 4.977, aporteVoluntario: 0, compensacionReservaCredito: 0.158, servicioPagoCuenta: -0.018, mora: 0.002, flujoNeto: 104.347 },
  { pais: 'GENERAL', anio: '2019', desembolsos: 214.298, amortizacion: 77.209, intereses: 38.821, comisiones: 5.857, aporteVoluntario: 0, compensacionReservaCredito: 0.020, servicioPagoCuenta: 0, mora: 0.003, flujoNeto: 92.386 },
  { pais: 'GENERAL', anio: '2020', desembolsos: 320.095, amortizacion: 77.057, intereses: 35.161, comisiones: 6.516, aporteVoluntario: 0, compensacionReservaCredito: 0.187, servicioPagoCuenta: 0, mora: 0.002, flujoNeto: 201.169 },
  { pais: 'GENERAL', anio: '2021', desembolsos: 345.450, amortizacion: 77.346, intereses: 30.885, comisiones: 5.853, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 231.368 },
  { pais: 'GENERAL', anio: '2022', desembolsos: 364.630, amortizacion: 117.819, intereses: 52.007, comisiones: 5.019, aporteVoluntario: 0.030, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 189.754 },
  { pais: 'GENERAL', anio: '2023', desembolsos: 351.540, amortizacion: 156.413, intereses: 135.854, comisiones: 7.618, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 51.652 },
  { pais: 'GENERAL', anio: '2024', desembolsos: 807.972, amortizacion: 248.883, intereses: 172.816, comisiones: 12.582, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0, flujoNeto: 373.690 },
  { pais: 'GENERAL', anio: '2025', desembolsos: 454.434, amortizacion: 226.176, intereses: 182.049, comisiones: 7.304, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0.019, flujoNeto: 38.885 },
  { pais: 'GENERAL', anio: '1Q-2026', desembolsos: 116.395, amortizacion: 85.090, intereses: 60.253, comisiones: 0.968, aporteVoluntario: 0, compensacionReservaCredito: 0, servicioPagoCuenta: 0, mora: 0.018, flujoNeto: -29.934 },
]

export function getFlujosByPais(pais: FlujoPais): FlujoRow[] {
  const byYear = new Map<string, FlujoRow>()
  FLUJOS_DATA.filter((r) => r.pais === pais).forEach((r) => byYear.set(r.anio, r))
  return FLUJO_PERIODOS.map(
    (y) =>
      byYear.get(y) ?? {
        pais,
        anio: y,
        desembolsos: 0,
        amortizacion: 0,
        intereses: 0,
        comisiones: 0,
        aporteVoluntario: 0,
        compensacionReservaCredito: 0,
        servicioPagoCuenta: 0,
        mora: 0,
        flujoNeto: 0,
      },
  )
}
