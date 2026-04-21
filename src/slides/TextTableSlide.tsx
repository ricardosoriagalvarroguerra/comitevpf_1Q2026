import { TextCard } from '@/components/cards/TextCard'
import { TableCard } from '@/components/cards/TableCard'
import './TextTableSlide.css'

interface TextTableSlideProps {
  eyebrow?: string
  title: string
  description?: string
  body?: string
  highlights?: string[]
  tableTitle: string
  tableColumns: Array<{ key: string; label: string; align?: 'left' | 'center' | 'right' }>
  tableRows: Array<Record<string, string | number | boolean | undefined>>
}

export function TextTableSlide({
  eyebrow,
  title,
  description,
  body,
  highlights,
  tableTitle,
  tableColumns,
  tableRows,
}: TextTableSlideProps) {
  return (
    <div className="text-table-slide">
      <div className="text-table-slide__text">
        <TextCard
          eyebrow={eyebrow}
          title={title}
          description={description}
          body={body}
          highlights={highlights}
        />
      </div>
      <div className="text-table-slide__table">
        <TableCard
          title={tableTitle}
          columns={tableColumns}
          rows={tableRows}
        />
      </div>
    </div>
  )
}
