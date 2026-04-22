import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import './TextCard.css'

interface TextCardProps {
  eyebrow?: string
  title?: string
  description?: ReactNode
  body?: string
  highlights?: string[]
  callout?: { title: string; body: string }
  variant?: 'default' | 'hero'
  align?: 'left' | 'center'
  footer?: ReactNode
  className?: string
}

export function TextCard({
  eyebrow,
  title,
  description,
  body,
  highlights,
  callout,
  variant = 'default',
  align = 'left',
  footer,
  className = '',
}: TextCardProps) {
  const isHero = variant === 'hero'

  return (
    <Card
      variant={isHero ? 'hero' : 'default'}
      padding={isHero ? 'none' : 'md'}
      className={`text-card text-card--${variant} text-card--${align} ${className}`}
    >
      <div className="text-card__content">
        {eyebrow && (
          <span className="text-card__eyebrow">{eyebrow}</span>
        )}
        {title && (
          <h2 className={isHero ? 'text-card__title--hero' : 'text-card__title'}>
            {title}
          </h2>
        )}
        {description && (
          <p className="text-card__description">{description}</p>
        )}
        {body && (
          <p className="text-card__body">{body}</p>
        )}
        {highlights && highlights.length > 0 && (
          <ul className="text-card__highlights">
            {highlights.map((h, i) => (
              <li key={i} className="text-card__highlight-item">{h}</li>
            ))}
          </ul>
        )}
        {callout && (
          <div className="text-card__callout">
            <span className="text-card__callout-title">{callout.title}</span>
            <span className="text-card__callout-body">{callout.body}</span>
          </div>
        )}
      </div>
      {footer && <div className="text-card__footer">{footer}</div>}
    </Card>
  )
}
