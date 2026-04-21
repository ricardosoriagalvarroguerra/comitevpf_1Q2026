import { TextCard } from '@/components/cards/TextCard'
import { Card } from '@/components/ui/Card'
import './PlaceholderSlide.css'

interface PlaceholderSlideProps {
  eyebrow?: string
  title?: string
  description?: string
  message?: string
  detail?: string
}

export function PlaceholderSlide({
  eyebrow,
  title,
  description,
  message = 'Coordinar con el área',
  detail = 'Esta sección está pendiente de definición de contenido en conjunto con el área responsable.',
}: PlaceholderSlideProps) {
  return (
    <div className="placeholder-slide">
      <TextCard eyebrow={eyebrow} title={title} description={description} />
      <Card padding="lg" className="placeholder-slide__message-card">
        <div className="placeholder-slide__message">
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="placeholder-slide__message-icon"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <span className="placeholder-slide__message-eyebrow">Pendiente</span>
          <h3 className="placeholder-slide__message-title">{message}</h3>
          <p className="placeholder-slide__message-desc">{detail}</p>
        </div>
      </Card>
    </div>
  )
}
