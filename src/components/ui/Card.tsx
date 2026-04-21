import type { ReactNode } from 'react'
import './Card.css'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'flat' | 'hero'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
}: CardProps) {
  return (
    <div className={`card card--${variant} card--pad-${padding} ${className}`}>
      {children}
    </div>
  )
}
