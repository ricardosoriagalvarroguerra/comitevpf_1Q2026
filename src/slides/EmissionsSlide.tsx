import { TextCard } from '@/components/cards/TextCard'
import { Card } from '@/components/ui/Card'
import './EmissionsSlide.css'

export function EmissionsSlide() {
  return (
    <div className="emissions-slide">
      <TextCard
        eyebrow="4 · ENDEUDAMIENTO"
        title="Endeudamiento 2025"
        description="USD Millones"
      />
      <Card padding="lg" className="emissions-slide__message-card">
        <div className="emissions-slide__message">
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="emissions-slide__message-icon"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <span className="emissions-slide__message-eyebrow">Pendiente</span>
          <h3 className="emissions-slide__message-title">Coordinar con el área</h3>
          <p className="emissions-slide__message-desc">
            Esta sección está pendiente de definición de contenido en conjunto con el área
            responsable.
          </p>
        </div>
      </Card>
    </div>
  )
}
