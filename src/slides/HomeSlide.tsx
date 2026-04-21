import { TextCard } from '@/components/cards/TextCard'
import { FonplataLogo } from '@/components/brand/FonplataLogo'
import './HomeSlide.css'

interface HomeSlideProps {
  title: string
  description?: string
  body?: string
  eyebrow?: string
}

export function HomeSlide({ title, description, body, eyebrow }: HomeSlideProps) {
  return (
    <div className="home-slide">
      <div className="home-slide__content">
        <TextCard
          eyebrow={eyebrow}
          title={title}
          description={description}
          body={body}
          variant="hero"
          align="center"
          footer={
            <div className="home-slide__footer">
              <FonplataLogo size="lg" />
            </div>
          }
        />
      </div>
      <div className="home-slide__bg" />
    </div>
  )
}
