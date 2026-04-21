import type { ReactNode, ButtonHTMLAttributes } from 'react'
import './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  active?: boolean
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  active = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${active ? 'btn--active' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      <span className="btn__label">{children}</span>
    </button>
  )
}
