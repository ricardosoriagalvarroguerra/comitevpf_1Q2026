import { type ReactNode, useState, useRef, useEffect } from 'react'
import './Tooltip.css'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom'
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible || !ref.current) return
    const el = ref.current
    const rect = el.getBoundingClientRect()
    if (rect.right > window.innerWidth) {
      el.style.left = 'auto'
      el.style.right = '0'
      el.style.transform = 'none'
    }
  }, [visible])

  return (
    <div
      className="tooltip-wrap"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div ref={ref} className={`tooltip tooltip--${position}`} role="tooltip">
          {content}
        </div>
      )}
    </div>
  )
}
