import type { ReactNode } from 'react'
import './Badge.css'

interface BadgeProps {
  children: ReactNode
  variant?: 'eyebrow' | 'tag' | 'pill'
  color?: 'default' | 'accent' | 'navy'
}

export function Badge({
  children,
  variant = 'tag',
  color = 'default',
}: BadgeProps) {
  return (
    <span className={`badge badge--${variant} badge--${color}`}>
      {children}
    </span>
  )
}
