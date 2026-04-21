import { useEffect, useRef, useState, type ReactNode } from 'react'
import './MultiSelect.css'

export interface MultiSelectOption<T extends string = string> {
  value: T
  label: string
  color?: string
}

interface MultiSelectProps<T extends string = string> {
  label: string
  options: Array<MultiSelectOption<T>>
  selected: Set<T>
  onChange: (next: Set<T>) => void
  renderOption?: (opt: MultiSelectOption<T>) => ReactNode
  size?: 'sm' | 'md'
}

export function MultiSelect<T extends string>({
  label,
  options,
  selected,
  onChange,
  renderOption,
  size = 'sm',
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = (v: T) => {
    const next = new Set(selected)
    if (next.has(v)) {
      if (next.size === 1) return
      next.delete(v)
    } else {
      next.add(v)
    }
    onChange(next)
  }

  const selectAll = () => onChange(new Set(options.map((o) => o.value)))
  const summary =
    selected.size === options.length
      ? 'Todos'
      : `${selected.size} de ${options.length}`

  return (
    <div
      className={`multi-select multi-select--${size} ${open ? 'is-open' : ''}`}
      ref={ref}
    >
      <button
        type="button"
        className="multi-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="multi-select__label">{label}</span>
        <span className="multi-select__summary">{summary}</span>
        <svg
          className="multi-select__caret"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
        >
          <path
            d="M2 3.5 L5 6.5 L8 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open ? (
        <div className="multi-select__panel" role="listbox">
          <header className="multi-select__panel-header">
            <span>{label}</span>
            <button
              type="button"
              className="multi-select__link"
              onClick={selectAll}
            >
              Todos
            </button>
          </header>
          <ul className="multi-select__list">
            {options.map((o) => {
              const checked = selected.has(o.value)
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={checked}
                    className={`multi-select__option ${
                      checked ? 'is-checked' : ''
                    }`}
                    onClick={() => toggle(o.value)}
                  >
                    <span
                      className={`multi-select__check ${
                        checked ? 'is-checked' : ''
                      }`}
                      aria-hidden="true"
                    >
                      {checked ? (
                        <svg width="10" height="10" viewBox="0 0 10 10">
                          <path
                            d="M1.5 5 L4 7.5 L8.5 2.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </span>
                    {renderOption ? (
                      renderOption(o)
                    ) : (
                      <span className="multi-select__option-label">
                        {o.color ? (
                          <span
                            className="multi-select__dot"
                            style={{ background: o.color }}
                          />
                        ) : null}
                        {o.label}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
