import './ThemeToggle.css'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      className={`theme-toggle theme-toggle--${theme}`}
      onClick={onToggle}
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      aria-pressed={theme === 'dark'}
    >
      <svg className="theme-toggle__icon theme-toggle__icon--light" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <svg className="theme-toggle__icon theme-toggle__icon--dark" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M13.5 9.2A5.5 5.5 0 016.8 2.5 6 6 0 1013.5 9.2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
