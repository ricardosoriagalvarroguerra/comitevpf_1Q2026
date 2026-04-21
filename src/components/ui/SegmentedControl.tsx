import './SegmentedControl.css'

interface SegmentedControlProps {
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
  size?: 'sm' | 'md'
}

export function SegmentedControl({
  options,
  value,
  onChange,
  size = 'sm',
}: SegmentedControlProps) {
  return (
    <div className={`seg-ctrl seg-ctrl--${size}`} role="radiogroup">
      {options.map((opt) => (
        <button
          key={opt.value}
          role="radio"
          aria-checked={opt.value === value}
          className={`seg-ctrl__btn ${opt.value === value ? 'seg-ctrl__btn--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
