import { useEffect, useRef, useState } from 'react'
import { usePresentation } from '@/hooks/usePresentation'
import './SlideControls.css'

function exportDeckAsPdf() {
  // Browser-native print → user can choose "Save as PDF".
  // Print stylesheet (in global.css) renders all slides stacked.
  window.print()
}

function exportTablesAsCsv() {
  const tables = Array.from(document.querySelectorAll<HTMLTableElement>('table'))
  if (tables.length === 0) {
    window.alert('No hay tablas para exportar en esta presentación.')
    return
  }
  const escape = (cell: string) => {
    const s = cell.replace(/\s+/g, ' ').trim()
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const sections = tables.map((tbl, idx) => {
    const slide = tbl.closest<HTMLElement>('[data-slide-id]')
    const titleEl = tbl.closest('.table-card')?.querySelector('.table-card__title')
    const heading = titleEl?.textContent?.trim()
      ?? slide?.dataset.slideId
      ?? `Tabla ${idx + 1}`
    const rows = Array.from(tbl.querySelectorAll('tr')).map((tr) =>
      Array.from(tr.querySelectorAll('th,td'))
        .map((c) => escape(c.textContent ?? ''))
        .join(',')
    )
    return `# ${heading}\n${rows.join('\n')}`
  })
  const csv = '\uFEFF' + sections.join('\n\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cof-finanzas-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function SlideControls() {
  const { activeIndex, slideCount, goNext, goPrev, goToSlideById } = usePresentation()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const current = String(activeIndex + 1).padStart(2, '0')
  const total = String(slideCount).padStart(2, '0')

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [menuOpen])

  return (
    <nav className="slide-controls" aria-label="Navegación de slides" ref={navRef}>
      <button
        className="slide-controls__btn"
        onClick={goPrev}
        disabled={activeIndex === 0}
        aria-label="Slide anterior"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 10L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="slide-controls__counter">
        <span className="slide-controls__current">{current}</span>
        <span className="slide-controls__divider" />
        <span className="slide-controls__total">{total}</span>
      </div>

      <button
        className="slide-controls__btn"
        onClick={goNext}
        disabled={activeIndex === slideCount - 1}
        aria-label="Slide siguiente"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <span className="slide-controls__sep" />

      <button
        className="slide-controls__btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menú de opciones"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="slide-controls-menu"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="3" r="1.2" fill="currentColor"/>
          <circle cx="8" cy="8" r="1.2" fill="currentColor"/>
          <circle cx="8" cy="13" r="1.2" fill="currentColor"/>
        </svg>
      </button>

      {menuOpen && (
        <div
          className="slide-controls__menu"
          id="slide-controls-menu"
          role="menu"
        >
          <button
            className="slide-controls__menu-item"
            role="menuitem"
            onClick={() => { goToSlideById('navigation-contenidos'); setMenuOpen(false) }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 3.5h9M2.5 7h9M2.5 10.5h5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Contenidos
          </button>
          <button
            className="slide-controls__menu-item"
            role="menuitem"
            onClick={() => { setMenuOpen(false); exportDeckAsPdf() }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3.5 12.25h7a.875.875 0 00.875-.875V5.25L8.75 2.625H3.5a.875.875 0 00-.875.875v7.875a.875.875 0 00.875.875z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.75 2.625v2.625h2.625" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Exportar PDF
          </button>
          <button
            className="slide-controls__menu-item"
            role="menuitem"
            onClick={() => { setMenuOpen(false); exportTablesAsCsv() }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M2 5.5h10M5.5 5.5V12" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            Exportar CSV
          </button>
        </div>
      )}
    </nav>
  )
}
