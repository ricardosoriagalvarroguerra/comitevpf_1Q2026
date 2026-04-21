import { createContext } from 'react'

export interface PresentationState {
  activeIndex: number
  slideCount: number
  goToSlide: (index: number) => void
  goNext: () => void
  goPrev: () => void
  goToSlideById: (id: string) => void
}

export const PresentationContext = createContext<PresentationState | null>(null)
