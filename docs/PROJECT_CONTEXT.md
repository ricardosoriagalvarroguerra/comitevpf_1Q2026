# COF V3 — Manual de contexto del proyecto

> Documento maestro del proyecto **COF V3 — Comité de Finanzas (FONPLATA)**.
> Sirve como punto de entrada para futuras sesiones de trabajo: resume qué hace
> la app, su arquitectura, módulos clave, convenciones, riesgos y pendientes.
> **Mantener sincronizado** con cada cambio relevante.

---

## 1. ¿Qué hace la aplicación?

COF V3 es un **deck ejecutivo de presentación** (slide-deck single-page) para el
**Comité de Finanzas de FONPLATA**. Funciona como un panel narrativo que recorre
de forma vertical 31 diapositivas agrupadas en 5 secciones temáticas:

1. **Situación Financiera** — balance, ingresos, estado de resultados.
2. **Cartera** — préstamos, flujos por país, proyecciones, tasas activas.
3. **Inversiones** — portafolios FONPLATA, FOCEM, actividad del trimestre.
4. **Endeudamiento** — tasas pasivas, instrumentos, perfil de amortización.
5. **Monitoreo de Riesgos y Política Financiera** — exposición, liquidez, capital, previsión.

La aplicación es **100% frontend**, con **datos mock hardcodeados**. No tiene
backend, base de datos, API ni autenticación.

Casos de uso:
- Presentación visual durante reuniones del Comité de Finanzas.
- Maqueta navegable para validar diseño y narrativa antes de cablear datos
  reales.
- Base estética / arquitectónica para futuras versiones (V4) con datos en vivo.

---

## 2. Arquitectura general

```
┌──────────────────────────────────────────────────────────┐
│  index.html  →  src/main.tsx  →  <App />                 │
│                                                          │
│  <App>                                                   │
│  ├── PresentationProvider (context: índice activo)       │
│  └── AppShell                                            │
│      ├── SlideRenderer  (mapea slides → componentes)     │
│      │   └── Deck (translate3d vertical por activeIndex) │
│      │       └── SlideWrapper × N                        │
│      │           └── <SlideComponent {...slideProps} />  │
│      ├── SlideControls (prev/next, contador, menú)       │
│      └── ThemeToggle (light/dark)                        │
└──────────────────────────────────────────────────────────┘
```

- **Renderizado**: todas las diapositivas se montan en el DOM y se animan con
  un `transform: translate3d(0, -activeIndex * vh, 0)` sobre el stage.
- **Navegación**: teclado (`ArrowDown/Up`, `PageDown/Up`, `Home`, `End`),
  controles inferiores y *table of contents* clickeable.
- **Tema**: light/dark vía atributo `data-theme` en `<html>` y persistencia en
  `localStorage` (`cof-theme`).
- **Sin routing**: el "ruteo" es por índice de slide en memoria.

---

## 3. Módulos, páginas y componentes principales

### 3.1 Capas raíz
| Archivo | Rol |
|---|---|
| `src/main.tsx` | Bootstrap React — monta `<App />` en `#root`. |
| `src/App.tsx` | Composición top-level: provider + shell + renderer + props por slide (datos mock centralizados). |

### 3.2 Layouts (`src/layouts/`)
| Archivo | Rol |
|---|---|
| `AppShell.tsx` | Contenedor visual de toda la app. |
| `Deck.tsx` | Stage scrollable vertical: aplica el desplazamiento por slide. |

### 3.3 Slides (`src/slides/`)
- `SlideWrapper.tsx` — envoltura común con altura del viewport y `data-active`.
- `registry.ts` — mapa `type → ComponentType` (24 entradas).
- 21 slide components únicos + 3 alias por configuración (line-cards-aprobaciones,
  -riesgo, -liquidez reusan `LineCardsSlide`).

| Slide | Resumen |
|---|---|
| `HomeSlide` | Portada hero con TextCard centrado + logo. |
| `ContentsSlide` | Índice con grupos colapsables y navegación a cada slide. |
| `SectionTitleSlide` | Separador full-screen entre secciones. |
| `PortfolioCountrySlide` | D3: barras stacked/línea YoY + filtros + fullscreen por card. |
| `DonutMatrixSlide` | D3: 3 filas × 3 columnas de donuts país (ver fase 4). |
| `RiskCapacitySlide` | D3: card unificado con 3 donuts + 3 bars por bucket de rating + toggle %/MM + fullscreen individual (ver fase 4). |
| `ProyeccionesDesembolsosSlide` | Slide 14: 2 tablas (Garantía/Sin garantía Soberana) con Ejecutado/Proyectado. |
| `ApprovalsByCountrySlide` | Slide 15: D3 barras agrupadas + línea neta suavizada, 6 charts (5 países + General). |
| `VigenciaSlide` | Tablas duales + callout KPI. |
| `LineCardsSlide` | Grid responsive (2/3/4/6 col) de ChartPlaceholder. |
| `LiquidityActivitySlide` | TextCard + tabs de donuts + tabla de posición. |
| `RateAnalysisSlide` | TextCard + chart con tabs (reusado por `AmortizationSlide`). |
| `AmortizationSlide` | Wrapper de RateAnalysisSlide (3 tabs). |
| `DebtAnalysisSlide` | TextCard + dos SegmentedControl + chart. |
| `DebtSourcesSlide` | Tablas duales (IFD + Mercado). |
| `DebtAuthorizationSlide` | TextCard + donut card + line chart. |
| `EmissionsSlide` | TextCard + ChartPlaceholder stacked-bar. |
| `InvestmentPortfolioSlide` | Galería con tabs (Clases / Vencimiento / Histórico). |
| `FocemPortfolioSlide` | Wrapper de InvestmentPortfolioSlide con datos FOCEM. |
| `DualChartsSlide` | TextCard + dos ChartPlaceholder lado a lado. |
| `TextTableSlide` | TextCard + TableCard. |
| `PrevisionSlide` | TextCard + SegmentedControl + line chart. |
| `CapitalAdequacySlide` | Layout 2×2: chart + policy card / detail chart + detail card. |

### 3.4 Componentes reutilizables (`src/components/`)
- **`brand/FonplataLogo`** — logo institucional (sm/md/lg).
- **`cards/`** — KPICard, TextCard, TableCard (con `headerRight` + columns con
  `className`), DonutPlaceholder (legacy), ChartPlaceholder (SVG ligero,
  soporta data real para bar/line/stacked-bar).
- **`charts/`** (D3.js — nuevos en fase 4):
  - `CountryDonut` — donut compartido slides 09, 10.
  - `RateStackedBarChart` — slide 12.
  - `ApprovalsCountryChart` — slide 15 (barras agrupadas + línea suavizada).
- **`navigation/`** — SlideControls (prev/next + menú).
- **`ui/`** — Badge, Button, Card, IconButton, SegmentedControl, ThemeToggle,
  Tooltip, MultiSelect.

### 3.5 Estado y hooks
- `context/PresentationContext.tsx` — estado global del deck (`activeIndex`, navegación).
- `hooks/useSlideNavigation.ts` — listener de teclado.
- `hooks/useTheme.ts` — toggle light/dark + persistencia.
- `hooks/useViewportHeight.ts` — listener de `resize`, devuelve altura actual.

### 3.6 Datos
- `src/data/slides.ts` — orden de slides (`SlideConfig[]`) y el TOC (`navigationTopics`).
- Resto de datos: hardcodeados en `App.tsx` (props centralizadas) o dentro de
  cada slide para los componentes sin props (DebtSourcesSlide, EmissionsSlide,
  LiquidityActivitySlide, etc.).

### 3.7 Tipos
- `src/types/slides.ts` — interfaces históricas (varias **no se usan** porque el
  registry usa `ComponentType<any>` y los slides redeclaran sus props localmente).

---

## 4. Tecnologías utilizadas

- **React 19**, **React DOM 19** (StrictMode activo).
- **TypeScript ~6.0** (modo proyecto con *project references*).
- **Vite 8** + `@vitejs/plugin-react`.
- **ESLint 9** flat config + `typescript-eslint` + `eslint-plugin-react-hooks` +
  `eslint-plugin-react-refresh`.
- **CSS plano por módulo** (sin Tailwind, sin CSS-in-JS, sin Sass). Variables
  de diseño centralizadas en `tokens.css`.
- **Inter** (Google Fonts) como tipografía base.
- **D3.js 7** para los charts principales (slides 08, 09, 10, 12, 15).
  Componentes dedicados en `src/components/charts/` usando `d3-scale`,
  `d3-shape` (pie, arc, line, `curveMonotoneX`), ejes renderizados como
  JSX React.
- `ChartPlaceholder` (pre-existente, SVG ligero propio) aún se usa en
  slides secundarios donde no se requieren ejes interactivos.
- **Sin librería de routing, store ni form**: solo Context API + hooks.
- **Alias `@/*` → `src/*`** (configurado en `vite.config.ts` y `tsconfig.app.json`).

Scripts npm (`package.json`):
```
npm run dev      # Vite dev server, puerto 5174
npm run build    # tsc -b && vite build
npm run preview  # Vite preview, puerto 4174 (o $PORT)
npm run lint     # ESLint sobre todo el repo
```

---

## 5. Estructura de capas

```
COF_V3/
├─ index.html                  ← entry HTML, carga Inter, sets <title>
├─ vite.config.ts              ← alias @/, dev:5174, preview:4174
├─ tsconfig.{json,app,node}    ← project references
├─ eslint.config.js            ← flat config con react-hooks + ts
├─ public/
│   ├─ favicon.svg
│   └─ icons.svg               ← (no usado en src; revisar)
├─ src/
│   ├─ main.tsx                ← entry React
│   ├─ App.tsx                 ← composición + props por slide
│   ├─ assets/
│   │   ├─ estrellafon_transparent.png  ← logo FONPLATA (usado)
│   │   ├─ hero.png                      ← NO USADO
│   │   ├─ react.svg / vite.svg          ← legacy template
│   ├─ context/PresentationContext.tsx
│   ├─ hooks/
│   ├─ layouts/
│   ├─ slides/                 ← 21 slides + registry + wrapper
│   ├─ components/{brand,cards,navigation,ui}
│   ├─ data/slides.ts          ← orden + TOC
│   ├─ types/slides.ts         ← tipos legacy (mayormente sin uso)
│   └─ styles/
│       ├─ index.css           ← @import de los demás
│       ├─ tokens.css          ← design tokens (colores, espacios, etc.)
│       ├─ reset.css
│       ├─ typography.css
│       └─ global.css
└─ docs/
    └─ PROJECT_CONTEXT.md      ← (este archivo)
```

**No hay backend ni base de datos.** Toda la información se persiste solo
en memoria + `localStorage` para el tema.

---

## 6. Archivos críticos para entender el proyecto

| Archivo | Por qué es crítico |
|---|---|
| `src/App.tsx` | Punto de composición: registra props por slide y monta el shell. |
| `src/data/slides.ts` | Define el **orden** del deck y el TOC navegable. |
| `src/slides/registry.ts` | Mapea `type` → componente (debe estar sincronizado con `data/slides.ts`). |
| `src/context/PresentationContext.tsx` | Único estado global: índice activo + navegación. |
| `src/layouts/Deck.tsx` + `src/slides/SlideWrapper.tsx` | Lógica de renderizado vertical y alturas. |
| `src/styles/tokens.css` | Single source of truth de colores, tipografía, espaciado, sombras. |
| `src/hooks/useTheme.ts` | Sistema light/dark. |
| `src/components/cards/*` | Vocabulario visual reutilizable (TextCard, TableCard, ChartPlaceholder, DonutPlaceholder, KPICard). |

---

## 7. Flujos principales de uso

1. **Carga inicial** → `main.tsx` monta `<App />` → tema se hidrata desde
   `localStorage` → se renderizan los 32 slides apilados verticalmente, con el
   índice 0 (`home`) visible.
2. **Navegación por teclado** → `useSlideNavigation` escucha `ArrowUp/Down`,
   `PageUp/Down`, `Home`, `End` y actualiza `activeIndex`.
3. **Navegación por TOC** → `ContentsSlide` expande/colapsa secciones y llama
   `goToSlideById(id)` del contexto.
4. **Controles inferiores** → `SlideControls` muestra `MM/TT`, prev/next y un
   menú con: ir al índice / Exportar PDF (no implementado) / Exportar Excel
   (no implementado).
5. **Toggle de tema** → `ThemeToggle` cambia `data-theme` y persiste.

---

## 8. Convenciones de diseño, código y lógica

### Diseño
- **Single source of truth**: todos los colores, tipografía, espaciado, sombras,
  z-index y duraciones viven en `src/styles/tokens.css` (CSS custom properties).
- **Paleta**: navy + rojo institucional FONPLATA + neutros cálidos. Series de
  charts y por país tienen tokens específicos (`--color-series-N`,
  `--color-country-XXX`).
- **Tipografía**: Inter, escala semántica (`--text-2xs`…`--text-5xl`),
  `font-variant-numeric: tabular-nums` para cifras.
- **Cards**: radio `--radius-card`, sombra `--shadow-card`, padding
  `--card-padding`.
- **Motion**: transiciones lentas para slides (`--duration-slide` 700ms con
  `--ease-slide`), respeto a `prefers-reduced-motion`.
- **Tema**: variables se redefinen vía `[data-theme="dark"]` (asumido en cada CSS
  de slide; revisar cobertura completa).

### Código
- **TypeScript estricto-light**: `noUnusedLocals`, `noUnusedParameters`,
  `verbatimModuleSyntax` (no hay `"strict": true` global — ver §10).
- **Imports**: alias `@/...` (no relativos profundos).
- **Modularidad**: 1 componente = 1 carpeta lógica + su CSS adyacente
  (`Component.tsx` + `Component.css`).
- **Props locales**: cada slide declara su interfaz inline (no usa los tipos
  centralizados en `types/slides.ts`).
- **Estado**: solo Context API + `useState` local. No hay Redux/Zustand.
- **Sin pruebas automatizadas** (no hay Jest/Vitest configurado).

### Lógica
- El `slideRegistry` usa `ComponentType<any>` deliberadamente (1 cast `any`
  marcado con `eslint-disable-next-line`).
- Resolución de props: `slideProps[slide.id] ?? slideProps[slide.type] ?? {}`.
- Slides de sección reciben sólo `{ title }` aplicado manualmente.
- Charts son **placeholders** (no hay librería real); ver §10.

---

## 9. Inventario de elementos visuales

- **5 categorías de cards**: KPI, Texto, Tabla, Donut, Chart (placeholder).
- **Componentes UI**: Badge, Button, IconButton, Card, SegmentedControl,
  ThemeToggle, Tooltip.
- **Layouts**: hero (Home), navigation (Contents), section (separadores),
  content (texto + visual), grid (multi-card).
- **Sistema de íconos**: SVG inline en cada componente (no hay librería de
  íconos importada). `public/icons.svg` existe pero no se referencia desde el
  código.

---

## 10. Pendientes, riesgos y áreas de mejora

> Estos puntos se identificaron en la revisión técnica/funcional del 16-04-2026
> y se reflejan en el resumen ejecutivo. Algunos ya fueron corregidos (ver §11).

### Riesgos y deuda técnica detectados
1. ~~**Charts simulados**~~ — **Resuelto parcialmente en fase 4**: slides
   08, 09, 10, 12, 15 usan D3.js real. Los slides restantes (4, 6, 13,
   21, 24, 28, 30) siguen usando `ChartPlaceholder` con data mock;
   migración pendiente si el contenido se sofistica.
2. **Datos mock**: hay datos hardcodeados duplicados entre `App.tsx` y los
   slides. Se recomienda mover **toda** la data a `src/data/` por dominio
   (cartera, endeudamiento, inversiones, riesgos) para preparar la integración
   con un backend real.
3. **Tipos legacy**: `src/types/slides.ts` describe interfaces que ya no se
   usan (cada slide redeclara sus props). Considerar borrarlas o realinearlas.
4. **Exportación**: los items "Exportar PDF" y "Exportar Excel" del menú son
   *no-ops*. Se requiere wiring real (p.ej. `react-to-pdf` / `xlsx`) o
   eliminar las opciones.
5. **Sin tests**: no hay Vitest/Jest/Playwright. Para una app de presentación
   ejecutiva, al menos pruebas de smoke + visual regression serían deseables.
6. **`tsconfig.app.json` no tiene `"strict": true`**. Se confía en
   `noUnusedLocals/Parameters` pero no se chequea null-safety estricta.
7. **`hero.png`, `react.svg`, `vite.svg`, `public/icons.svg` no se usan.**
   Limpiarlos para reducir el bundle / ruido.
8. **`PrevisionSlide` declara estado y handlers** que disparan re-render aunque
   las opciones reales no afecten datos (los datos son ficticios). OK para
   demo.
9. **No hay Error Boundary** alrededor del `Deck`; si un slide explota, cae
   toda la app.
10. **Accesibilidad**: el deck depende fuertemente del teclado. Falta verificar
    contraste en dark mode y orden de tab dentro del menú de SlideControls.
11. **Performance**: todos los slides están montados a la vez. Para 32 slides
    es manejable; si crece, plantear virtualización o `content-visibility:
    auto`.
12. **`overflow-x: hidden` global** en `body` puede ocultar overflows de slides
    grandes que en realidad deberían avisar al diseñador.

### Recomendaciones (futuras mejoras)
- Integrar un store ligero (Zustand) si más adelante se agrega filtrado por
  período / país / segmento.
- Centralizar las paletas de país en un único helper (hoy se repite la lista
  `['ARG','BOL','BRA','PAR','URU','RNS']` en varios slides).
- Agregar tests E2E (Playwright) que validen al menos: navegación por
  teclado, toggle de tema, colapso del TOC.
- Documentar tokens en una página interna ("design tokens reference") para
  facilitar onboarding.
- Migrar charts a Recharts (encaja con CSS variables y SVG ya en uso).

---

## 11. Cambios aplicados en esta sesión (16-04-2026)

> Esta sección debe **actualizarse cada vez** que se aplique un cambio relevante.

### Fase 1 — análisis (primera ronda)
- Creación de este documento (`docs/PROJECT_CONTEXT.md`).
- Sanity check técnico (`tsc`, `eslint`, `build`) e inspección visual de los
  31 slides en viewport 1440×900 y 768×1024.

### Fase 2 — fixes aplicados (misma sesión)
**Bugs críticos:**
1. ✅ `src/slides/DonutMatrixSlide.tsx` — Fragment con `key` (`<Fragment key={cat}>`).
   12 errores en consola eliminados.
2. ✅ `src/styles/tokens.css` — bloque `:root[data-theme="dark"] { … }`
   completo con overrides de superficie, texto, sombras y selección. Toggle
   light/dark **ahora funciona visualmente**.
3. ✅ `src/slides/DebtSourcesSlide.tsx` — acepta `eyebrow`, `title`,
   `description` con defaults. Slide 14 muestra "Proyecciones de Desembolsos",
   slide 22 muestra "Fuentes de deuda por instrumento".
4. ✅ `src/slides/DebtSourcesSlide.css` + `DebtSourcesSlide.tsx` — grilla
   asimétrica `1.45fr 1fr` (IFD más ancho), padding de celda reducido,
   header "Total (USD MM)" → "Total". Sin overflow horizontal.
5. ✅ Hook movido a archivo propio: `src/hooks/usePresentation.ts`. Context
   value-only en `src/context/PresentationContext.ts`. Provider en
   `src/context/PresentationProvider.tsx`. ESLint fast-refresh ✅.

**Layout / responsive:**
6. ✅ `src/slides/SlideWrapper.css` — `.slide--section .slide__inner` con
   `padding: 0` y `max-width: none`. Section title slides ya no muestran el
   borde del slide siguiente.
7. ✅ `src/slides/TextTableSlide.css` — flex-stretch + width:100% para que
   la `TableCard` ocupe el espacio disponible.
8. ✅ `src/slides/PortfolioCountrySlide.{tsx,css}` — agregado país RNS,
   grid `repeat(auto-fit, minmax(220px, 1fr))`. Sin celda vacía.
9. ✅ `src/slides/InvestmentPortfolioSlide.css` y
   `src/slides/LiquidityActivitySlide.css` — flex-stretch vertical para
   eliminar las franjas vacías en la mitad inferior.
10. ✅ `src/slides/LineCardsSlide.css` — base mobile/tablet con auto-fit.

**Funcionalidad pendiente resuelta:**
11. ✅ "Exportar PDF" → `window.print()` (browser-native, "Save as PDF").
12. ✅ "Exportar Excel" → exporta CSV con BOM UTF-8 de **todas** las tablas
    visibles, agrupadas por título de tabla / id de slide.
13. ✅ Print stylesheet (`@media print` en `global.css`): cada slide ocupa
    una página A4 horizontal, controles ocultos, transiciones desactivadas.
14. ✅ `src/components/navigation/ExportBar.{tsx,css}` eliminados.
15. ✅ Borrados: `src/assets/{hero.png,react.svg,vite.svg}`,
    `public/icons.svg`, `src/types/slides.ts`, `src/types/`.
16. ✅ `src/components/cards/ChartPlaceholder.tsx` — ahora renderiza
    `<MiniChart>` SVG real (line / bar / grouped-bar / stacked-bar) cuando
    se le pasa `data={ labels, series }`. Sin data: fallback al placeholder
    iconográfico.
17. ✅ `App.tsx` — wired chart data real para `evolucion-rubros-balance`,
    `flujos-pais` y `aprobaciones-y-cancelaciones` (los charts ya no son
    placeholders en esos slides).
18. ✅ `src/components/ErrorBoundary.{tsx,css}` y `<ErrorBoundary>`
    envuelve toda la app en `App.tsx`.
19. ✅ `tsconfig.app.json` — agregado `"strict": true`. tsc pasa limpio.
20. ✅ `package.json` — script `npm test` documenta cómo activar Vitest
    (no instalado para no agregar deps automáticamente).

### Validación post-fixes
- `npx tsc -b` → exit 0 (incluye `strict: true`).
- `npx eslint .` → 0 errors, 0 warnings.
- `npm run build` → 239 KB JS / 39 KB CSS / 72 KB gzip — 93 módulos.
- Preview (`npm run dev`) → consola sin errores. 31 slides verificados en
  desktop (1440) y tablet (768). Dark mode visualmente correcto.

### Notas de migración
- El import `from '@/context/PresentationContext'` ahora resuelve al archivo
  `.ts` (sólo el contexto). Para usar el provider: `from
  '@/context/PresentationProvider'`. Para el hook: `from
  '@/hooks/usePresentation'`.
- `ChartType` y `ChartSeries` se exportan ahora desde
  `@/components/cards/ChartPlaceholder` (eran exportados desde el extinto
  `@/types/slides`).

### Fase 3 — copy & UX polish (16-04-2026)
**Slide 01 (Home):**
- `eyebrow`: "Panel ejecutivo · FONPLATA" → **"Información al 31 de Marzo de 2026"**.
- `description` (fecha): "Jueves 19 de febrero" → **"Viernes 24 de Abril"**.
- `body`: copy ejecutivo de cartera reemplazado por **"FONPLATA BANCO DE DESARROLLO"**.
- `title`: "Comite de Finanzas" → **"Comité de Finanzas"** (con tilde).

**Slide 02 (Contenidos):**
- Eliminado el toggle expand/collapse: ahora **todos los topics + items se
  muestran siempre expandidos** en la grilla (3 columnas en desktop, 2 en
  tablet, 1 en mobile gracias al `auto-fit`).
- Removido `useState`, `expandedTopic`, `toggleTopic` y el chevron SVG.
- Click en el header del topic sigue navegando al section title del grupo;
  click en cada subitem navega al slide específico.

**Sweep ortográfico (~50 strings):**
Aplicados acentos correctos en todo el texto visible (mantenidos los IDs
kebab-case que son identificadores internos):
- `App.tsx`: Comité, Información, Situación, Política, Evolución, País,
  Métricas, Composición, Histórico, Adecuación, Período, Préstamos, Pérdidas,
  Concentración, Calificación, Mínimo, Gestión, Rápidamente, Específica, etc.
- `data/slides.ts`: Situación, Préstamos, Evolución, País, Categorías,
  Proyección, Política, Exposición, Previsión, Pérdidas, Adecuación, ¿Cómo?
- Slides individuales: PortfolioCountrySlide, DebtAnalysisSlide,
  LiquidityActivitySlide, CapitalAdequacySlide, FocemPortfolioSlide,
  AmortizationSlide, DebtAuthorizationSlide, PrevisionSlide, DonutMatrixSlide,
  VigenciaSlide, RiskCapacitySlide, InvestmentPortfolioSlide.
- Componentes: SlideControls (`Navegación`, `Menú`), ErrorBoundary
  (`presentación`, `salió`).
- `index.html`: `<title>` y `<meta description>` con tildes.
- `tokens.css`: comment de cabecera.

**Validación post-fase-3:**
- `npx tsc -b` → 0 errores.
- `npx eslint .` → 0 errores, 0 warnings.
- Preview verificado: home OK, contents con todos los items visibles, section
  titles ("Situación Financiera"), tablas y descripciones con tildes
  correctas. Console limpia.

### Fase 4 — charts D3 reales + fullscreen + overhaul de slides de cartera (19–20-04-2026)

> Esta fase introduce **D3.js** como motor de charts para slides críticos y
> agrega la opción de **pantalla completa** por gráfico. Sustituye
> `ChartPlaceholder` (SVG ligero, ya existente) por componentes D3 dedicados
> en los puntos donde se requieren ejes, tooltips, curvas suavizadas y
> transiciones consistentes.

**Infraestructura compartida nueva (`src/components/charts/`):**
1. ✅ `RateStackedBarChart.{tsx,css}` — barras apiladas D3 (`d3.scaleBand`,
   `d3.scaleLinear`, ejes manuales). Hover highlight (opacity 1/0.3 con
   `cubic-bezier(0.645, 0.045, 0.355, 1)` 320ms). Tooltip pegado al borde
   derecho del header (no solapa el título). Botón fullscreen 14px con
   `createPortal` a `body` para escapar del `transform` del Deck.
2. ✅ `CountryDonut.{tsx,css}` — donut D3 reusable con la estética unificada:
   `d3.pie().padAngle(0.012)` + `d3.arc().cornerRadius(2)`, opacity base 0.72,
   labels en negro negrita 8px, total centrado en USD MM, tooltip absoluto
   top-left con swatches circulares. Usado por slides 09 y 10.
3. ✅ `ApprovalsCountryChart.{tsx,css}` — chart compuesto: barras agrupadas
   (Aprobaciones rojo `#c1121f` + Cancelaciones gris `#c4c6c9`) + línea
   suavizada de netas con `d3.curveMonotoneX` en color `var(--color-text)`
   (negro en light, blanco en dark via `[data-theme="dark"]` override).
   Dominio Y configurable vía `domainOverride` para ejes compartidos.
   Fullscreen con portal.

**Patrón de pantalla completa reutilizado en todos los charts:**
- `useState` local + `useEffect` que toggleas `document.body.classList`
  con `'is-chart-fullscreen'`, agrega listener Escape y hace
  `overflow: hidden` en body.
- CSS global en `styles/global.css`:
  `body.is-chart-fullscreen .slide-controls, body.is-chart-fullscreen .theme-toggle { display: none }`.
- Render vía `createPortal(content, document.body)` para escapar del
  `transform: translate3d(…)` del `Deck` (el transform crea un containing
  block para `position: fixed`, rompiendo `inset: 0`).
- En `PortfolioCountrySlide` hubo que agregar un `useEffect([fullscreen])`
  que mide el `wrapRef` y llama `setSize()` manualmente porque el portal
  remonta el subtree de D3Chart y el `ResizeObserver` tardaba en disparar,
  dejando el SVG vacío en el primer frame.

**Slide 08 — `PortfolioCountrySlide` (D3Chart existente):**
4. ✅ Botón fullscreen 22×22 (18×18 en compact) en la barra del card. En
   modo fullscreen se renderiza un `portfolio-country__fs-tip` local que
   replica el tooltip del slide completo (el parent-tooltip queda tapado
   por el overlay).
5. ✅ `notifyHover` centralizado en el D3Chart que mantiene copia local del
   `TooltipState` para el fullscreen.
6. ✅ Desglose grid ahora `overflow: hidden` + `grid-auto-rows: minmax(0,1fr)`,
   cards con `min-height: 0` — 6 países (ARG/BOL/BRA/PAR/RNS/URU) entran
   sin scroll.

**Slide 09 — `DonutMatrixSlide` reconstruido:**
7. ✅ Reemplazado `DonutPlaceholder` por 9 donuts D3 (3 categorías × 3 Q4
   años). Datos reales desde `CARTERA_DATA`.
8. ✅ Paleta país **nueva** (aplica aquí y en slides 10/11):
   `ARG #48cae4`, `BOL #70e000`, `BRA #ffdd00`, `PAR #f94144`, `URU #61a5c2`,
   `RNS #bbbaba`.
9. ✅ Estética: padAngle + cornerRadius, opacity 0.72 (transparencia
   ligera), labels negro-negrita 8px sin decimales (`27%`), total centrado
   en USD MM, swatches como **círculos** (no cuadrados).
10. ✅ En la fila "Aprobado no vigente" el slot de `Q4-2026` muestra la
    **leyenda inline** (6 países en grid 2 columnas) en lugar de un donut.
    Se elimina la leyenda al pie del slide.
11. ✅ Pantalla completa por fila (3 botones total).

**Slide 10 — `RiskCapacitySlide` reconstruido:**
12. ✅ **Un único card unificado** con:
    - Row de etiquetas centradas `Q4-2024 / Q4-2025 / Q4-2026 (PROY.)`.
    - 3 `CountryDonut` (capacidad prestable = `porCobrar + porDesembolsar
      + aprobadoNoVigente`, tomado del Q4 correspondiente).
    - Título compartido **"UTILIZADA POR CALIFICACIÓN CREDITICIA"** con
      divisor y `SegmentedControl` `USD MM | %` (cambia Y-axis y labels,
      denominador = total de cada año).
    - 3 `RatingBarChart` D3 con buckets `GI1 / GI2 / Superior /
      Intermedia / Básica`, stacked por país:
      - URU → GI1, PAR → GI2, BRA → Superior, RNS → Intermedia,
        ARG + BOL → Básica (grilla S&P estándar).
13. ✅ Leyenda (círculos) en la esquina superior derecha del card del
    título (pill con borde y sombra leve), liberando espacio inferior
    para los charts.
14. ✅ Pantalla completa **individual por chart** (6 botones): 3 en donuts
    + 3 en barras. `useFullscreen()` hook extraído para evitar
    duplicación. Botones opacity 0.4 → 1 en hover del chart.

**Slide 12 — `RateAnalysisSlide` + `RateStackedBarChart`:**
15. ✅ Datos reales: 24 meses (ene-24 a dic-25) de tasas activas.
    - Riesgo soberano: stack SOFR (`#adb5bd`) + Margen neto (`#c1121f`)
      + FOCOM (`#48cae4`).
    - Riesgo no soberano: stack SOFR + Margen neto (sin FOCOM).
16. ✅ Tooltip en hover, fullscreen con `overflow: sticky` para mantener
    tooltip visible al desplazarse.

**Slide 14 — `ProyeccionesDesembolsosSlide` nuevo:**
17. ✅ Reemplazó al genérico `DebtSourcesSlide` solo para el tipo
    `debt-sources-proyecciones` (el DebtSourcesSlide original sigue
    cubriendo slide 22).
18. ✅ Dos tablas apiladas: **Garantía Soberana** (RS) y **Sin Garantía
    Soberana** (RNS). 12 meses × 5 países + filas Totales y %. Valores
    formateados en USD MM con locale `es-ES` (`467,71 M USD`).
19. ✅ **Total agregado** en el header de cada tabla (`headerRight` nuevo
    prop en `TableCard`).
20. ✅ Diferenciador visual **Ejecutado vs Proyectado**:
    - Columnas Ene-Mar con tinte `color-mix(accent 7%)`, texto normal.
    - Columnas Abr-Dic con tinte `color-mix(text-muted 4%)` + itálica.
    - Border-left rojo entre Mar y Abr (`.month-cell--boundary`).
    - Leyenda `■ Ejecutado · ■ Proyectado` al lado del Total.
    - `TableColumn` extendido con `className?: string` para targeting
      por columna.

**Slide 15 — `ApprovalsByCountrySlide` nuevo:**
21. ✅ Reemplazó `LineCardsSlide` para el tipo `line-cards-aprobaciones`.
22. ✅ 6 charts (ARG/BOL/BRA/PAR/URU + **General** = suma de los 5) con
    12 años (2014–2025) + Q1-26. Datos hardcodeados en el componente.
23. ✅ Barras agrupadas (aprobaciones arriba, cancelaciones abajo del 0)
    + línea de netas suavizada (`curveMonotoneX`). Línea negra en light,
    blanca en dark (`[data-theme="dark"] .approvals-chart__line`).
24. ✅ **Dominio Y compartido** entre los 5 charts-país (ARG/BOL/BRA/PAR/URU)
    vía `domainOverride` prop (≈ `[-211, 268]` calculado en render), mismo
    patrón que `yMaxOverride` del slide 08 desglose. "General" autoescala.
25. ✅ Fullscreen individual por chart, leyenda (pill) top-right del
    header compartido.

**Cambios en componentes compartidos:**
- `TableCard`:
  - Nuevo prop `headerRight?: ReactNode` para mostrar totales/leyendas
    en la línea del título.
  - `TableColumn.className?: string` aplicado a `<th>` y `<td>` para
    estilos por columna.
- `ChartPlaceholder` (todavía usado en slides 4/6/13/21/24/28/30):
  - Tooltip opcional en `stacked-bar` cuando hay `data.series`.
  - Header refactorizado: `justify-content: flex-start` + `margin-left: auto`
    en `__actions` (más flexible sin romper charts existentes).
- `useFullscreen()` + `body.is-chart-fullscreen`:
  - Patrón estandarizado en todos los charts D3 nuevos.

**Archivos nuevos:**
```
src/components/charts/
├─ CountryDonut.{tsx,css}          ← compartido por slides 09, 10
├─ RateStackedBarChart.{tsx,css}   ← slide 12
└─ ApprovalsCountryChart.{tsx,css} ← slide 15

src/slides/
├─ ProyeccionesDesembolsosSlide.tsx (reusa DebtSourcesSlide.css)
└─ ApprovalsByCountrySlide.{tsx,css}
```

**Archivos modificados (significativos):**
```
src/App.tsx                              ← datos reales para Tasas Activas
src/slides/registry.ts                   ← 2 nuevos mappings
src/slides/DonutMatrixSlide.{tsx,css}    ← rebuilt D3
src/slides/RiskCapacitySlide.{tsx,css}   ← rebuilt D3 + unified card
src/slides/PortfolioCountrySlide.{tsx,css} ← fullscreen + grid fit
src/slides/RateAnalysisSlide.{tsx,css}   ← usa RateStackedBarChart
src/components/cards/TableCard.{tsx,css} ← headerRight + col className
src/components/cards/ChartPlaceholder.{tsx,css} ← tooltip + header
src/styles/global.css                    ← .is-chart-fullscreen rule
```

**Convenciones establecidas en fase 4:**
- Charts grandes = **D3** con React declarativo (scales calculados con
  d3.scale*, ejes/bars/lines renderizados como JSX); evitar d3.select +
  append excepto en `PortfolioCountrySlide.D3Chart` (legacy funcional).
- Paleta país central: ver §8.1 abajo.
- Fullscreen siempre vía `createPortal(node, document.body)` +
  `body.is-chart-fullscreen` para respetar la jerarquía de z-index y
  escapar del transform del Deck.
- Tooltips: `position: absolute` relativo al chart container, `pointer-events: none`,
  contenido con `font-variant-numeric: tabular-nums`.
- Hover highlight estándar: `opacity 1/0.3` con `transition: opacity
  320ms cubic-bezier(0.645, 0.045, 0.355, 1)`.

### 8.1 Paleta de país (canónica desde fase 4)

| País | Hex     | Uso                                                     |
|------|---------|---------------------------------------------------------|
| ARG  | #48cae4 | Donut slides 09/10, bars slide 10, legend               |
| BOL  | #70e000 | ídem                                                    |
| BRA  | #ffdd00 | ídem                                                    |
| PAR  | #f94144 | ídem                                                    |
| URU  | #61a5c2 | ídem                                                    |
| RNS  | #bbbaba | ídem (Riesgo No Soberano)                               |

Estos colores viven en `src/components/charts/CountryDonut.tsx` (exportados
como `COUNTRY_COLORS`). `PortfolioCountrySlide` y `CARTERA_CATEGORIES` usan
una paleta por-categoría distinta (rojo/naranja/amarillo/verde), no se
deben mezclar.

### Validación post-fase-4
- `npx tsc -b` → 0 errores.
- `npx eslint .` → 0 errores, 0 warnings (en archivos tocados).
- Preview verificado: slides 08/09/10/12/14/15 visualmente correctos en
  light y dark; fullscreen abre/cierra en los 6 charts de slide 10,
  5+1 de slide 15, 7 de slide 08 desglose, 1 de slide 12; dark theme
  cambia la línea negra a blanca en slide 15.

---

## 14. Hallazgos del sanity check (16-04-2026)

### 14.1 Errores y warnings de runtime

1. **DonutMatrixSlide — keys faltantes en Fragment** (`src/slides/DonutMatrixSlide.tsx:30`).
   Genera 12 errores en consola por cada render de la matriz porque se usa un
   `<>` (Fragment corto) que no acepta `key`. **Fix sugerido**: importar
   `Fragment` de React y usar `<Fragment key={cat}>` en su lugar.

2. **Dark mode no funcional**. `useTheme.ts` setea `data-theme="dark"` en
   `<html>` y persiste, pero **ningún archivo CSS define reglas para
   `[data-theme="dark"]`**. El icono del toggle cambia, pero la paleta no.
   **Fix sugerido**: añadir un bloque `:root[data-theme="dark"] { … }` en
   `tokens.css` con overrides de `--color-bg`, `--color-surface`,
   `--color-text`, etc.

3. **DebtSourcesSlide ignora props** (`src/slides/DebtSourcesSlide.tsx`). Las
   props que `App.tsx` pasa para el slide `proyecciones-desembolsos`
   (`eyebrow: 'Cartera'`, `title: 'Proyecciones de Desembolsos'`,
   `description: 'Proyeccion de desembolsos por fuente para 2026.'`) se
   descartan silenciosamente. El slide muestra el mismo header hardcodeado
   ("Fuentes de deuda por instrumento") tanto en `deuda-por-fuente`
   (slide 22) como en `proyecciones-desembolsos` (slide 14). **Fix
   sugerido**: aceptar `eyebrow`, `title`, `description` como props con
   defaults.

4. **Tabla "IFD" en DebtSourcesSlide se desborda horizontalmente**. Las
   columnas finales `Total (USD MM)` y `Spread (pbs)` aparecen cortadas
   visualmente (visible en slides 14 y 22). **Fix sugerido**: ajustar
   `min-width` o `font-size` en `TableCard.css`, o reducir el número de
   columnas / abreviar headers.

5. **PresentationContext.tsx — warning de fast-refresh**
   (`src/context/PresentationContext.tsx:49`). El archivo exporta tanto el
   provider como el hook `usePresentation`. **Fix sugerido**: separar
   `usePresentation` a `src/hooks/usePresentation.ts`.

### 14.2 Inconsistencias visuales / layout

6. **`overflow-x: hidden` global** en `body` oculta cortes que serían señales
   de bug. Para auditorías visuales, comentar temporalmente o cambiar por
   `clip` solo en el deck.

7. **Section title slides** dejan ver el borde del slide siguiente al
   alinear verticalmente con `slide__inner`. Notable en slides 3 y 7.

8. **TextTable slides (5, 6)** no aprovechan el ancho completo: `TextCard`
   queda en una columna estrecha y la `TableCard` en otra columna también
   estrecha. Hay >50% de pantalla vacía a la derecha. **Fix sugerido**: en
   `TextTableSlide.css` cambiar el `grid-template-columns` para que la
   tabla ocupe `1fr` y se estire.

9. **PortfolioCountrySlide (8)** tiene 5 países en grilla 3×2 dejando 1
   celda vacía (3a columna fila 2). Las pills de filtro (ARG/BOL/BRA…)
   están top-right separadas de las cards y en tablet se solapan con el
   contenido. **Fix sugerido**: agregar 6º slot (placeholder o RNS) o usar
   grid `repeat(auto-fit, minmax(...))` y mover las pills dentro del header.

10. **InvestmentPortfolioSlide / FocemPortfolioSlide / LiquidityActivitySlide
    (17, 18, 19)** dejan grandes franjas verticales vacías por debajo del
    contenido. **Fix sugerido**: distribuir mejor con `flex: 1` en el
    contenedor inferior o levantar el contenido al centro vertical.

11. **DebtAnalysisSlide / RateAnalysisSlide / EmissionsSlide / PrevisionSlide**
    tienen `ChartPlaceholder` muy grandes que ocupan toda la mitad derecha,
    pero la card de texto izquierda queda casi vacía hacia el fondo.
    Aceptable mientras los charts sean placeholders; con datos reales se
    debería rediseñar la jerarquía.

12. **Tablet (768px)**: los grids de 3 columnas no se adaptan, dejando
    cards muy estrechas o con scroll vertical interno (las grids en
    `LineCardsSlide` con 3 columnas y countries quedan apretadas; las
    pills de filtro en `PortfolioCountrySlide` se solapan visualmente con
    los gráficos).

### 14.3 Funcionalidad no implementada

13. **Exportar PDF / Excel** en el menú de `SlideControls` son no-ops
    (botones que solo cierran el menú).

14. **`ExportBar.tsx` es código muerto** — definido pero no importado en
    ningún lugar del árbol de componentes.

15. **`hero.png`, `react.svg`, `vite.svg` y `public/icons.svg`** no se usan.
    `assets/estrellafon_transparent.png` sí está en uso por `FonplataLogo`.

### 14.4 Consistencia de datos

16. **Conteo de slides**: el deck tiene **31** slides (no 32 como una
    versión previa de este doc indicaba). Corregido.

17. **Tipos legacy** (`src/types/slides.ts`) — definidos pero no consumidos
    por los componentes; los slides redeclaran sus props inline. Recomendado
    borrar el archivo o realinear.

18. **`tsconfig.app.json` no activa `"strict": true`** — solo
    `noUnusedLocals` y `noUnusedParameters`. Habilitarlo expondría null-
    safety bugs si los hubiese.

19. **Slide IDs mezclan español + ingles + numeración**: `slide-7` (debería
    ser `actividad-trimestre`), `slide-14` (debería ser
    `monitoreo-endeudamiento`). Solo cosmético.

20. **Datos hardcodeados duplicados**: la lista de países
    `['ARG','BOL','BRA','PAR','URU','RNS']` aparece en `App.tsx` y
    `DonutMatrixSlide.tsx` (sin RNS); `LiquidityActivitySlide`,
    `DebtSourcesSlide`, `PortfolioCountrySlide` también traen sus propios
    mocks. Centralizar en `src/data/`.

### 14.5 Accesibilidad y UX

21. **Sin Error Boundary** alrededor del Deck — un slide que falle tira
    toda la app.
22. **Foco visible**: revisar el orden de tabulación dentro del menú de
    `SlideControls` (no se ha verificado teclado-only end-to-end).
23. **`aria-label` del menú "Menu de opciones"** no anuncia el estado
    abierto/cerrado (`aria-expanded`).

---

## 15. Estado al cierre de la sesión (16-04-2026)

Tras la fase 2, los hallazgos #1 a #20 de §11 ya están resueltos en código.
Los pendientes restantes (de §14, no abordados en esta sesión):
- **#15 PortfolioCountrySlide pills**: en mobile (<768) las pills aún se
  apilan junto al título. No bloqueante.
- **#22, #23 Accesibilidad**: revisar `aria-expanded` del menú de
  SlideControls y el orden de tab. No bloqueante.
- **#16 Vitest/Jest**: no instalado para no añadir deps sin permiso explícito.
  Comando `npm test` indica el comando para habilitarlo.
- **Charts reales**: el nuevo `ChartPlaceholder` con `data` cubre line / bar /
  grouped-bar / stacked-bar. Para donut-real-data se sigue usando el componente
  `DonutPlaceholder` (que ya rendea SVG real). Para producción a futuro
  podría reemplazarse por Recharts si se necesitan ejes/tooltips/leyendas
  interactivas.

---

## 12. Comandos útiles

```bash
# instalar deps (una vez)
npm install

# servidor de desarrollo (HMR, puerto 5174)
npm run dev

# build de producción
npm run build

# servir el build
npm run preview

# lint
npm run lint
```

Atajos de teclado en runtime:
- `↑` / `↓` o `PageUp` / `PageDown` — navegar slides.
- `Home` / `End` — primer / último slide.
- Click en TOC → ir al slide correspondiente.

---

## 13. Glosario rápido

- **Deck** — colección lineal de slides apilados verticalmente.
- **Slide** — una sección de pantalla completa.
- **Variant** (`hero | navigation | content | grid | section`) — define el
  layout/spacing del wrapper.
- **Type** — clave del `slideRegistry` que decide qué componente renderiza
  cada `SlideConfig`.
- **Section title** — slide separador entre las 5 secciones temáticas.
- **TOC** — tabla de contenidos del `ContentsSlide`.
- **Tokens** — variables CSS centralizadas en `styles/tokens.css`.
