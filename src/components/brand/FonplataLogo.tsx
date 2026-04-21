import logoSrc from '@/assets/estrellafon_transparent.png'
import './FonplataLogo.css'

interface FonplataLogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export function FonplataLogo({ size = 'md' }: FonplataLogoProps) {
  return (
    <img
      src={logoSrc}
      alt="FONPLATA"
      className={`fonplata-logo fonplata-logo--${size}`}
      draggable={false}
    />
  )
}
