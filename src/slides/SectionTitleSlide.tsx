import { FonplataLogo } from '@/components/brand/FonplataLogo'
import './SectionTitleSlide.css'

interface SectionTitleSlideProps {
  title: string
}

export function SectionTitleSlide({ title }: SectionTitleSlideProps) {
  return (
    <div className="section-title-slide">
      <div className="section-title-slide__content">
        <h2 className="section-title-slide__title">{title}</h2>
        <div className="section-title-slide__logo">
          <FonplataLogo size="lg" />
        </div>
      </div>
      <div className="section-title-slide__accent" />
    </div>
  )
}
