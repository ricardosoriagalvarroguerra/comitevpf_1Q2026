import { useState, useCallback, type ReactNode } from 'react'
import { PresentationContext } from './PresentationContext'

interface ProviderProps {
  children: ReactNode
  slideIds: string[]
}

export function PresentationProvider({ children, slideIds }: ProviderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const slideCount = slideIds.length

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, slideCount - 1)))
  }, [slideCount])

  const goNext = useCallback(() => {
    setActiveIndex((i) => Math.min(i + 1, slideCount - 1))
  }, [slideCount])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => Math.max(i - 1, 0))
  }, [])

  const goToSlideById = useCallback((id: string) => {
    const idx = slideIds.indexOf(id)
    if (idx !== -1) setActiveIndex(idx)
  }, [slideIds])

  return (
    <PresentationContext.Provider
      value={{ activeIndex, slideCount, goToSlide, goNext, goPrev, goToSlideById }}
    >
      {children}
    </PresentationContext.Provider>
  )
}
