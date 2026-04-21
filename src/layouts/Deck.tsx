import type { ReactNode } from 'react'
import { usePresentation } from '@/hooks/usePresentation'
import { useViewportHeight } from '@/hooks/useViewportHeight'
import './Deck.css'

interface DeckProps {
  children: ReactNode
}

export function Deck({ children }: DeckProps) {
  const { activeIndex } = usePresentation()
  const vh = useViewportHeight()

  return (
    <div className="deck" style={{ height: vh }}>
      <div
        className="deck__stage"
        style={{
          transform: `translate3d(0, ${-activeIndex * vh}px, 0)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
