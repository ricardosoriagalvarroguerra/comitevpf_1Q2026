import { usePresentation } from '@/hooks/usePresentation'
import { FonplataLogo } from '@/components/brand/FonplataLogo'
import { Card } from '@/components/ui/Card'
import './ContentsSlide.css'

interface SubItem {
  id: string
  label: string
}

export interface TopicGroup {
  id: string
  tag: string
  title: string
  description: string
  items: SubItem[]
}

interface ContentsSlideProps {
  title: string
  description?: string
  topics: TopicGroup[]
}

export function ContentsSlide({ title, description, topics }: ContentsSlideProps) {
  const { goToSlideById } = usePresentation()

  return (
    <div className="contents-slide">
      <div className="contents-slide__intro">
        <FonplataLogo size="md" />
        <h2 className="contents-slide__title">{title}</h2>
        {description && <p className="contents-slide__desc">{description}</p>}
      </div>
      <div className="contents-slide__grid">
        {topics.map((topic, ti) => (
          <Card key={topic.id} padding="none" className="contents-slide__card">
            <button
              className="contents-slide__topic-btn"
              onClick={() => goToSlideById(topic.id)}
            >
              <span className="contents-slide__topic-index">
                {String(ti + 1).padStart(2, '0')}.
              </span>
              <span className="contents-slide__topic-title">{topic.title}</span>
            </button>
            {topic.items.length > 0 && (
              <div className="contents-slide__items">
                {topic.items.map((item, ii) => (
                  <button
                    key={item.id}
                    className="contents-slide__item-btn"
                    onClick={() => goToSlideById(item.id)}
                  >
                    <span className="contents-slide__item-index">
                      {ti + 1}.{ii + 1}
                    </span>
                    <span className="contents-slide__item-label">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
