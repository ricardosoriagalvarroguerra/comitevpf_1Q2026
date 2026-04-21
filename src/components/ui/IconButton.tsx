import type { ReactNode, ButtonHTMLAttributes } from 'react'
import './IconButton.css'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outline' | 'secondary'
}

export function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`icon-btn icon-btn--${size} icon-btn--${variant} ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  )
}
