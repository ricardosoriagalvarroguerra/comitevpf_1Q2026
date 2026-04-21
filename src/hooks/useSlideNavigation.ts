import { useEffect } from 'react'
import { usePresentation } from '@/hooks/usePresentation'

export function useSlideNavigation() {
  const { goNext, goPrev, goToSlide, slideCount } = usePresentation()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault()
          goNext()
          break
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          goPrev()
          break
        case 'Home':
          e.preventDefault()
          goToSlide(0)
          break
        case 'End':
          e.preventDefault()
          goToSlide(slideCount - 1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev, goToSlide, slideCount])
}
