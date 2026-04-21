import type { ReactNode } from 'react'
import { usePresentation } from '@/hooks/usePresentation'
import { useViewportHeight } from '@/hooks/useViewportHeight'
import './SlideWrapper.css'

interface SlideWrapperProps {
  children: ReactNode
  index: number
  variant?: 'hero' | 'navigation' | 'content' | 'grid' | 'section'
  id?: string
}

export function SlideWrapper({
  children,
  index,
  variant = 'content',
  id,
}: SlideWrapperProps) {
  const { activeIndex } = usePresentation()
  const vh = useViewportHeight()
  const isActive = index === activeIndex

  return (
    <section
      className={`slide slide--${variant}`}
      data-active={isActive}
      data-slide-id={id}
      style={{ height: vh }}
    >
      <div className="slide__inner">{children}</div>
    </section>
  )
}
